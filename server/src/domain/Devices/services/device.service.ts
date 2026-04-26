import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { CreateDeviceInput, DeviceFilterDTO, DeviceUserResponse, UpdateDeviceInput } from "../Dtos/deviceDtos";
import { BadRequestException, ForbiddenException, InternalServerException, NotFoundExceptions, UnauthorizedException } from "../../../utils/Catch-error";
import { IDeviceService } from "./device.service.Interface";
import { DeviceMapper } from "../mapper/deviceMapper";
import type { IDeviceRepository } from "../repository/device.Repository.interface";
import { EmailService } from "../../Auth/services/email.Service";
import { DeviceEntity } from "../entity/deviceEntity";


@injectable()
export class DeviceService implements IDeviceService{

     constructor(
        @inject(TOKENS.DeviceRepository) private repo:IDeviceRepository,
        @inject(TOKENS.EmailService) private emailService:EmailService,
        
){}
     
 async registerDevice(userId: string,email:string, device: CreateDeviceInput): Promise<DeviceUserResponse> {

  if (!userId) throw new BadRequestException("userId shouldn't be null or empty");

  if (!device) throw new BadRequestException("invalid fields input");
  
  // 🔹 Step 1: check existing device
  const existingDevice = await this.repo.findDeviceByUserAndFingerprint(userId,device.deviceName!);

  let deviceEntity: DeviceEntity;

  // 🔥 CASE 1: NEW DEVICE
  if (!existingDevice) {

    const newDevice = DeviceMapper.fromCreateDto(device, userId);

    newDevice.isTrusted = false;
    newDevice.isBlocked = false;

    // optional: mark as "pending verification" via metadata if needed
    // newDevice.verificationStatus = "PENDING"
    await this.emailService.sendNewDeviceAlert(email,device.deviceName!)

    deviceEntity = await this.repo.registerDevice(newDevice);
  }

  // 🔥 CASE 2: EXISTING DEVICE
  else {

    // DO NOT auto-trust blindly (important security fix)
    if (!existingDevice.isTrusted) {

      // still untrusted → resend verification if needed
      await this.emailService.sendNewDeviceAlert(email,device.deviceName!);

    }

    existingDevice.markActive();

    deviceEntity = await this.repo.update(existingDevice);
  }

  // 🔹 Final safety check
  if (!deviceEntity?.id) {
    throw new InternalServerException("Failed to create Device");
  }

  return DeviceMapper.toUserResponse(deviceEntity);
}
async getDeviceById(deviceId: string, userId: string): Promise<DeviceUserResponse> {
             if(!deviceId) throw new BadRequestException("DeviceId should not be empty")
             if(!userId) throw new BadRequestException("UserId should not be empty") 
                
             const device = await  this.repo.findById(deviceId);
             if(!device || !device.id){
                  throw new NotFoundExceptions("Device details not found")
             }
             if(device?.userId !== userId){
                  throw new UnauthorizedException("Unauthorized User")
             } 
             return DeviceMapper.toUserResponse(device);
        }

async getUserDevices(userId: string): Promise<DeviceUserResponse[]> {

           if(!userId)  throw new BadRequestException("UserId should not be null")
           const  devices = await this.repo.findByUserId(userId);
           if(!devices)  throw new NotFoundExceptions("Device details not found");
           const allowedDevices = devices.filter(
                       d => !d.isDeviceBlocked
                 );
           return allowedDevices.map(DeviceMapper.toUserResponse);
        }

  // 🔹 ACTIVE DEVICES (only non-blocked)
  async getActiveDevices(userId: string): Promise<DeviceUserResponse[]> {
    if (!userId) {
      throw new BadRequestException("UserId should not be null");
    }
    const devices = await this.repo.findByUserId(userId);
    const active = devices.filter(d => !d.isBlocked);
    return active.map(DeviceMapper.toUserResponse);
  }

  // 🔹 UPDATE DEVICE
  async updateDevice(userId: string,device: UpdateDeviceInput): Promise<DeviceUserResponse> {
    if( !userId) throw new BadRequestException("UserId not found")
    if(!device) throw new BadRequestException("Invalid fields Values") 

    const existing = await this.repo.findById(device.id!);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundExceptions("Device not found");
    }
    if(device.isBlocked){
          throw new ForbiddenException("Can't update blocked device")
    }
    const updatedEntity = DeviceMapper.updateEntity(existing, device);
    const result = await this.repo.update(updatedEntity);
    return DeviceMapper.toUserResponse(result);
  }

  // 🔹 LOGOUT SINGLE DEVICE
  async logoutDevice(deviceId: string, userId: string): Promise<boolean> {
        if(!deviceId) throw new BadRequestException("deviceId should not be null")
        if(!userId) throw new BadRequestException("userId should not be null")        
                 
    const device = await this.repo.findById(deviceId);
    if (!device || device.userId !== userId) {
      throw new ForbiddenException("Unauthorized device access");
    }
    return await this.repo.deleteById(deviceId);
  }

  // 🔹 LOGOUT ALL DEVICES
  async logoutAllDevices(userId: string): Promise<boolean> {
    if (!userId) {
      throw new BadRequestException("UserId required");
    }
    const device = await this.repo.findByUserId(userId);
    if(device.length === 0){
           throw new BadRequestException("No device found"); 
    }
    return await this.repo.deleteByUserId(userId);
  }

  // 🔹 REFRESH DEVICE SESSION (JWT rotation logic)
  async refreshDeviceSession(userId: string,fingerprint: string): Promise<DeviceUserResponse> {

    const device = await this.repo.findDeviceByUserAndFingerprint(userId,fingerprint);

    if (!device) throw new NotFoundExceptions("Device not found");

    if (device.isBlocked)  throw new ForbiddenException("Device is blocked");
    
    device.markActive();

    const updated = await this.repo.update(device);
    return DeviceMapper.toUserResponse(updated);
  }

  // 🔹 ADMIN: GET ALL DEVICES
  async getAllDevices(params: {
    page: number;
    limit: number;
  }): Promise<DeviceUserResponse[]> {

    const devices = await this.repo.findAll(params);

    return devices.map(DeviceMapper.toUserResponse);
  }

  // 🔹 ADMIN: SEARCH DEVICES
  async searchDevices(userId:string, params: DeviceFilterDTO ): Promise<DeviceUserResponse[]> {

    const devices = await this.repo.findByFilters(params);
    return devices.map(DeviceMapper.toUserResponse);
  }

  // 🔹 FIND BY USER + FINGERPRINT
  async findByUserAndFingerprint(userId: string,fingerprint: string): Promise<DeviceUserResponse | null> {

    const device = await this.repo.findDeviceByUserAndFingerprint(
      userId,
      fingerprint
    );

    if (!device) return null;
    return DeviceMapper.toUserResponse(device);
  }

;
}