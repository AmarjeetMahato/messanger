import { DeviceEntity } from "../entity/deviceEntity";
import { CreateDeviceInput,UpdateDeviceInput, DeviceFilterDTO, DeviceUserResponse } from "../Dtos/deviceDtos";

export interface IDeviceService {

  // 🔹 Register new device session (login flow)
  registerDevice(userId: string,email:string, device: CreateDeviceInput): Promise<DeviceUserResponse>;

  // 🔹 Get device by ID (with ownership check)
  getDeviceById(deviceId: string,userId: string): Promise<DeviceUserResponse>;

  // 🔹 Get all devices for logged-in user
  getUserDevices(userId: string): Promise<DeviceUserResponse[]>;

  // 🔹 Get active sessions
  getActiveDevices(userId: string): Promise<DeviceUserResponse[]>;

  // 🔹 Update device (business logic applied here)
  updateDevice(userId: string,device: UpdateDeviceInput): Promise<DeviceUserResponse>;

  // 🔹 Logout single device
  logoutDevice(deviceId: string,userId: string): Promise<boolean>;

  // 🔹 Logout all devices (security feature)
  logoutAllDevices(userId: string): Promise<boolean>;

  // 🔹 Refresh session (important for JWT rotation)
  refreshDeviceSession(userId: string,fingerprint: string): Promise<DeviceUserResponse>;

  // 🔹 Admin: get all devices (pagination)
  getAllDevices(params: {page: number;limit: number}): Promise<DeviceUserResponse[]>;

  // 🔹 Admin: filtered search
  searchDevices(userId:string, params: DeviceFilterDTO): Promise<DeviceUserResponse[]>;

  // 🔹 Detect duplicate / suspicious device
  findByUserAndFingerprint(userId: string,fingerprint: string): Promise<DeviceUserResponse | null>;
}