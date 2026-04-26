import { DeviceFilterDTO, DeviceTypeEnum, PlatformEnum } from "../Dtos/deviceDtos";
import { DeviceEntity } from "../entity/deviceEntity";

export interface IDeviceRepository {

  // 🔹 Create device session
  registerDevice(device: DeviceEntity): Promise<DeviceEntity>;

  // 🔹 Get by ID
  findById(id: string): Promise<DeviceEntity | null>;

  // 🔹 Get all devices of a user (normal user feature)
  findByUserId(userId: string): Promise<DeviceEntity[]>;

  // 🔹 Find by refresh token (auth flow)
  findByRefreshToken(token: string): Promise<DeviceEntity | null>;

  // 🔹 Update device (lastActive, refreshToken, trust, etc.)
  update(device: DeviceEntity): Promise<DeviceEntity>;

  // 🔹 Delete single device (logout device)
  deleteById(id: string): Promise<boolean>;

  // 🔹 Delete all devices of a user (logout all)
  deleteByUserId(userId: string): Promise<boolean>;

  // 🔹 Get active devices (useful for sessions UI)
  findActiveDevicesByUser(userId: string): Promise<DeviceEntity[]>;

  // 🔹 Admin: pagination (all users devices)
  findAll(params: {
    page: number;
    limit: number;
  }): Promise<DeviceEntity[]>;

  // 🔹 Admin: filtered search
  findByFilters(params: DeviceFilterDTO): Promise<DeviceEntity[]>;

  findDeviceByUserAndFingerprint(userId: string, fingerprint: string) : Promise<DeviceEntity | null>;
}