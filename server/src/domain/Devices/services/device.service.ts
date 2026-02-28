import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import { DeviceRepository } from "../repository/device.repository";
import { CreateDeviceInput } from "../Dtos/deviceDtos";
import { ForbiddenException, InternalServerException } from "../../../utils/Catch-error";


@injectable()
export class DeviceService{

     constructor(@inject(TOKENS.DeviceRepository) private repo:DeviceRepository){};


     async regiterUserDevice(deviceDto:CreateDeviceInput){
             
             const existingDevice = await this.repo.findDeviceByUserAndFingerprint
             (
                   deviceDto.userId,
                   deviceDto.deviceName!

             )
             // If device is new → mark as untrusted and send verification
             if(!existingDevice){
                  deviceDto.isTrusted=false
                     // TODO: send verification email here
             }else{
                 deviceDto.isTrusted=true
             }
          
             const createDevice = await this.repo.registerDevice(deviceDto);
             if(!createDevice?.id){
                throw new InternalServerException("Failed to create Device");
             }
             return createDevice;
     }
}