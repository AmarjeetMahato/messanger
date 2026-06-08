import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { AuthRepository } from "../repository/auth.Repository";
import { CreateUserSchemaDto, LoginUserDto } from "../dtos/authDto";
import {
  AlreadyExistsException,
  BadRequestException,
  ForbiddenException,
  InternalServerException,
  NotFoundExceptions,
  TooManyRequestsException,
  UnauthorizedException,
} from "../../../utils/Catch-error";
import { Message } from "../../../utils/ErrorCode.ENUM";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  generateUserToken,
} from "../../../middleware/generateToken";
import { AccessTokenPayload } from "../../../@types/jwt.types";
import { Response, Request } from "express";
import { CreateDeviceInput } from "../../Devices/Dtos/deviceDtos";
import { parseDeviceInfo } from "../../../helpers/parseDeviceInfo";
import { EmailService } from "./email.Service";
import { generateEmailVerificationOTP, verifyOTP } from "../../../utils/token";
import { CreateTokenInput } from "../../Token/dtos/tokenDto";
import { AuthMapper } from "../mapper/authMapper";
import { IAuthService } from "./IAuthService";
import type { IDeviceService } from "../../Devices/services/device.service.Interface";
import type { ITokenService } from "../../Token/services/token.Service.Interface";
import type { IRoleService } from "../../Role/services/role.Service.Interface";
import type { IUserService } from "../../Users/services/user.Service.Interface";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TOKENS.AuthRepository) private repo: AuthRepository,
    @inject(TOKENS.DeviceService) private deviceService: IDeviceService,
    @inject(TOKENS.EmailService) private emailService: EmailService,
    @inject(TOKENS.TokenService) private tokenService: ITokenService,
    @inject(TOKENS.UserRepositoy) private userService: IUserService,
    @inject(TOKENS.RoleService) private roleService: IRoleService,
  ) {}

  async createUser(data: CreateUserSchemaDto, res: Response) {
    const roleNames = await this.roleService.fetchRoleByName(
      data.roleName ?? "user",
    );
    if (!roleNames) {
      throw new NotFoundExceptions("Roles name not found");
    }
    const duplicateEmail = await this.repo.fetchUserByEmail(data.email);
    if (duplicateEmail) {
      throw new AlreadyExistsException(Message.EMAIL_ALREADY_EXISTS);
    }
    // ✅ hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // ✅ Step 1: DTO → Entity
    const createdEntity = AuthMapper.fromCreateDto({
      ...data,
      roleName: roleNames.roleId,
      password: hashedPassword,
    });
    // ✅ Step 2: Entity → Persistence
    const persistence = AuthMapper.toPersistence(createdEntity);
    const result = await this.repo.createUser(persistence);

    // ✅ Step 4: Row → Entity
    const savedEntity = AuthMapper.toEntity(result);

    const { expiresAt, hashedOTP, rawOTP } = generateEmailVerificationOTP();

    const verificationToken = generateUserToken({ userId: result.id });

    res.cookie("verificationToken", verificationToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    const tokenData: CreateTokenInput = {
      tokenHash: hashedOTP,
      type: "email_verification",
      userId: savedEntity?.id,
      otpGeneratedAt: new Date(),
      otpExpiresAt: expiresAt,
      lastOtpRequestedAt: new Date(),
      validatedAt: null,
    };
    const createToken = await this.tokenService.createToken(tokenData);

    // fire-and-forget async email
    void (await this.emailService
      .sendVerificationEmail(data.email, rawOTP)
      .catch((err) => console.error("Email failed:", err)));

    return AuthMapper.toRegisterResponse(savedEntity);
  }

  async verificationEmailWithToken(
    userId: string,
    Otp: string,
    req: Request,
  ): Promise<void> {
    if (!Otp) throw new UnauthorizedException("Otp is required");

    // ✅ FIX: fetch by userId + type (VERY IMPORTANT)
    const tokenRow = await this.tokenService.fetchOtp(
      userId,
      "email_verification",
    );

    if (!tokenRow) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }

    // 1️⃣ Check expiry
    if (tokenRow.otpExpiresAt && new Date() > tokenRow.otpExpiresAt) {
      throw new UnauthorizedException("OTP has expired");
    }

    // 2️⃣ Verify OTP
    const isValid = verifyOTP(Otp, tokenRow.tokenHash);
    if (!isValid) {
      throw new UnauthorizedException("Invalid OTP");
    }

    // 3️⃣ Mark token used
    await this.tokenService.markTokenValidated(tokenRow.tokenId!);

    // 4️⃣ Invalidate other OTPs
    await this.tokenService.invalidateToken(
      userId,
      "email_verification",
      tokenRow.tokenId!,
    );

    // 5️⃣ Mark user verified
    await this.userService.markedUserVerify(userId);

    // 6️⃣ Build auth payload (FIXED: DO NOT use req.user here)
    const user = await this.userService.getUserByuserId(userId);
    const role = await this.roleService.fetchRoleById(user.roleId);

    const payload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      roles: role.roleId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 7️⃣ Device fingerprint
    const fingerprint =
      (req.headers["x-device-fingerprint"] as string) || req.body.fingerprint;

    if (!fingerprint) {
      throw new BadRequestException("Device fingerprint is required");
    }

    const deviceInfo = parseDeviceInfo(req);

    const rawDeviceData: CreateDeviceInput = {
      userId: userId,
      fingerprint,
      refreshToken,
      deviceName: `${deviceInfo.browser ?? "Unknown"} on ${deviceInfo.platform ?? "Unknown"}`,
      deviceType: deviceInfo.deviceType as "mobile" | "desktop" | "tablet",
      platform: deviceInfo.platform?.toLowerCase() as
        | "ios"
        | "android"
        | "windows"
        | "macos"
        | "linux",
      osVersion: deviceInfo.osVersion ?? null,
      browser: deviceInfo.browser ?? null,
      isBlocked: false,
      ipAddress: req.ip ?? null,
      userAgent: req.headers["user-agent"] ?? null,
      pushToken: null,
      isTrusted: false,
      timezone: deviceInfo.timezone,
    };

    await this.deviceService.registerDevice(
      userId,
      payload.email,
      rawDeviceData,
    );

    // OPTIONAL: return tokens if needed (or set cookies in controller)
    // return { accessToken, refreshToken };
  }

  async loginUser(data: LoginUserDto, req: Request, res: Response) {
    const user = await this.repo.fetchUserByEmail(data.email);
    if (!user || !user?.id || !user?.passwordHash || !user?.email) {
      throw new UnauthorizedException(Message.INVALID_CREDENTIALS);
    }

    if (user.isVerified === false) {
      throw new BadRequestException("Verify your Email");
    }

    const cleanRoles = user.roles?.filter((r): r is string => Boolean(r)) ?? [];
    const roles = cleanRoles.length > 0 ? cleanRoles : ["USER"];
    // 1️⃣ Check if user is blocked temporarily
    if (user?.isBlocked && user?.blockedUntil instanceof Date) {
      const now = new Date();
      if (user?.blockedUntil > now) {
        throw new ForbiddenException(
          `Account temporarily blocked until ${user.blockedUntil.toISOString()}`,
        );
      } else {
        // Block expired → reset
        await this.repo.resetFailedAttempts(user?.id);
        user.isBlocked = false;
        user.blockedUntil = null;
      }
    }

    // Compare the password
    const comparePassword = await bcrypt.compare(
      data.password,
      user?.passwordHash,
    );
    if (!comparePassword) {
      // Increment failed attempts
      await this.repo.incrementFailedAttempts(user.id);
      if (
        user &&
        user?.failedLoginAttempts &&
        user?.failedLoginAttempts + 1 >= 3
      ) {
        // Temporary block: 15 minutes
        const blockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        await this.repo.blockUserTemporarily(user.id, blockedUntil);

        // Optional: send email to user for info
        this.emailService.sendAccountBlockedEmail(user.email, blockedUntil);

        throw new ForbiddenException(
          `Account temporarily blocked due to multiple failed login attempts until ${blockedUntil.toISOString()}`,
        );
      }
      throw new UnauthorizedException(Message.INVALID_CREDENTIALS);
    }

    if (!user?.isVerified) {
      throw new UnauthorizedException(Message.EMAIL_NOT_VERIFIED);
    }

    // 4️⃣ Reset failed login attempts on successful login
    if (user && user?.failedLoginAttempts && user?.failedLoginAttempts > 0) {
      await this.repo.resetFailedAttempts(user?.id);
    }

    const payload: AccessTokenPayload = {
      userId: user?.id,
      email: user?.email,
      roles: roles[0]!,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Create device entry

    res.cookie("accessToken", accessToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    const fingerprint =
      (req.headers["x-device-fingerprint"] as string) || req.body.fingerprint;

    if (!fingerprint) {
      throw new BadRequestException("Device fingerprint is required");
    }

    const deviceInfo = parseDeviceInfo(req); // 👈 call the function first
    const rawDeviceData: CreateDeviceInput = {
      userId: user.id, // must match DB type (uuid string OR number)
      fingerprint: fingerprint,
      refreshToken,
      deviceName: `${deviceInfo.browser ?? "Unknown"} on ${deviceInfo.platform ?? "Unknown"}`,
      deviceType: deviceInfo.deviceType as "mobile" | "desktop" | "tablet",
      platform: deviceInfo.platform?.toLowerCase() as
        | "ios"
        | "android"
        | "windows"
        | "macos"
        | "linux",
      osVersion: deviceInfo.osVersion ?? null,
      browser: deviceInfo.browser ?? null,
      isBlocked: false,
      ipAddress: req.ip ?? null,
      userAgent: req.headers["user-agent"] ?? null,
      pushToken: null,
      isTrusted: false,
      timezone: deviceInfo.timezone,
    };

    await this.deviceService.registerDevice(
      user.id!,
      payload.email,
      rawDeviceData,
    );
    return;
  }

  async fetchUser(userId: string) {
    if (!userId) {
      throw new BadRequestException("User is required");
    }
    const result = await this.repo.fetchUserByUserId(userId);
    if (!result?.id) {
      throw new InternalServerException("Failed to fetch users");
    }

    // Manually pick the safe fields
    const userProfile = {
      id: result.id,
      email: result.email,
      username: result.username,
      fullName: result.fullName,
      avatarUrl: result.avatarUrl,
      isVerified: result.isVerified,
      lastSeen: result.lastSeen,
    };
    return userProfile;
  }

  async resendVerificationOtp(userId: string): Promise<void> {
    // 1. Fetch user
    const user = await this.userService.getUserByuserId(userId);

    if (!user) {
      throw new NotFoundExceptions("User not found");
    }

    // 2. Already verified?
    if (user.isVerified) {
      throw new BadRequestException("Email already verified");
    }

    // 3. Fetch existing token
    const existingToken = await this.tokenService.fetchOtp(
      userId,
      "email_verification",
    );

    // 4. Cooldown check
    if (
      existingToken?.lastOtpRequestedAt &&
      Date.now() - existingToken.lastOtpRequestedAt.getTime() < 60_000
    ) {
      throw new TooManyRequestsException(
        "Please wait before requesting another OTP",
      );
    }

    // 5. Generate new OTP
    const { rawOTP, hashedOTP, expiresAt } = generateEmailVerificationOTP();

    // 6. Update existing token
    if (existingToken) {
      await this.tokenService.updateToken(existingToken.tokenId!, {
        tokenHash: hashedOTP,
        otpGeneratedAt: new Date(),
        otpExpiresAt: expiresAt,
        lastOtpRequestedAt: new Date(),
        validatedAt: null,
      });
    } else {
      await this.tokenService.createToken({
        userId,
        type: "email_verification",
        tokenHash: hashedOTP,
        otpGeneratedAt: new Date(),
        otpExpiresAt: expiresAt,
        lastOtpRequestedAt: new Date(),
        validatedAt: null,
      });
    }

    // 7. Send email
    void this.emailService
      .sendVerificationEmail(user.email, rawOTP)
      .catch((err) => console.error("Failed to send OTP:", err));
  }

  async logoutuser(res: Response) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: "none",
    });
    return;
  }
}
