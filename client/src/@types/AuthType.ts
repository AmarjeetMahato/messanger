
export interface RequestRegisterUserDto {
  email: string;
  password: string;
  username: string;
  roleName?: string;
  fullName?: string;
  avatarUrl?: string;
  mfaEnabled?: boolean;
}

export interface ResponseAuthDto{
       message:string,
       success:boolean,
}

export interface VerifyEmailWithOTP{
       otp:number;
}

export interface LoginUserDto{
    email:string,
    password:string
}