import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { devices } from "../../../config/schema/Device.model";
import {  DeviceFilterDTO, DeviceTypeEnum, PlatformEnum } from "../Dtos/deviceDtos";
import { and, eq, gte, desc } from "drizzle-orm";
import { IDeviceRepository } from "./device.Repository.interface";
import { DeviceEntity } from "../entity/deviceEntity";
import { DeviceMapper } from "../mapper/deviceMapper";
import { InternalServerException, NotFoundExceptions } from "../../../utils/Catch-error";



@injectable()
export class DeviceRepository implements IDeviceRepository{
    constructor(@inject(TOKENS.DB) private db:DbOrTx){}

async registerDevice (device: DeviceEntity): Promise<DeviceEntity>{
        const payload = DeviceMapper.toInsert(device)
      const [result] = await this.db
                                  .insert(devices)
                                  .values(payload)
                                  .returning();

      if(!result) throw  new InternalServerException("Failed to register device");                 
      return DeviceMapper.toEntity(result)
    }

 async findById(id: string): Promise<DeviceEntity | null> {
     const result =   await this.db.select()
                           .from(devices)
                           .where(
                                and(
                                    eq(devices.id,id),
                                    eq(devices.isBlocked,false)
                                )
                          )
                           .then(row => row[0] || null)
                           
      return result ?  DeviceMapper.toEntity(result)  : null                  
  }

 async findByUserId(userId: string): Promise<DeviceEntity[]> {
      const result = await this.db.select()
                                   .from(devices)
                                   .where(
                                       and(
                                        eq(devices.userId, userId),
                                       eq(devices.isBlocked,false)
                                       )
                                   )
      return   result.map(DeviceMapper.toEntity)                            
  }

 async  findByRefreshToken(token: string): Promise<DeviceEntity | null> {
       const [result] = await this.db.select().from(devices)
                                     .where(
                                        eq(devices.refreshToken, token)
                                     ).limit(1)
       
       return result ? DeviceMapper.toEntity(result) : null
  }

async update(device: DeviceEntity): Promise<DeviceEntity> {
  if (!device.id) {
    throw new Error("Device ID is required for update");
  }

  const payload = DeviceMapper.toUpdate(device);

  const [result] = await this.db
    .update(devices)
    .set(payload)
    .where(eq(devices.id, device.id))
    .returning();

  if (!result) {
    throw new InternalServerException("Failed to update device");
  }

  return DeviceMapper.toEntity(result);
}

async findActiveDevicesByUser(userId: string): Promise<DeviceEntity[]> {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
       const result = await this.db.select()
                                     .from(devices)
                                     .where(
                                         and(
                                             eq(devices.userId, userId),
                                       gte(devices.lastActive, sevenDaysAgo)
                                         )
                                     )
         return result.map(DeviceMapper.toEntity);
  }


async  deleteById(id: string): Promise<boolean> {
        
       const result = await this.db.delete(devices)
                                   .where(
                                        eq(devices.id,id)
                                   )
      return !!result;
  }

async  deleteByUserId(userId: string): Promise<boolean> {
        const result = await this.db.delete(devices)
                                   .where(
                                        eq(devices.userId,userId)
                                   )
      
      return !!result;
  }


async findAll(params: {
  page: number;
  limit: number;
}): Promise<DeviceEntity[]> {

  const { page, limit } = params;

  const offset = (page - 1) * limit;

  const result = await this.db
    .select()
    .from(devices)
    .orderBy(desc(devices.createdAt))
    .limit(limit)
    .offset(offset);

  return result.map(DeviceMapper.toEntity);
}


async findByFilters(params:DeviceFilterDTO): Promise<DeviceEntity[]> {

  const conditions = [];

  if (params.userId) {
    conditions.push(eq(devices.userId, params.userId));
  }

  if (params.deviceType) {
    conditions.push(eq(devices.deviceType, params.deviceType));
  }

  if (params.platform) {
    conditions.push(eq(devices.platform, params.platform));
  }

  if (params.isTrusted !== undefined) {
    conditions.push(eq(devices.isTrusted, params.isTrusted));
  }

  const result = await this.db
    .select()
    .from(devices)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return result.map(DeviceMapper.toEntity);
}


async findDeviceByUserAndFingerprint(userId: string, fingerprint: string): Promise<DeviceEntity | null> {
    const result =  await this.db
                              .select()
                              .from(devices)
                              .where(
                                      and(
                                 eq(devices.userId, userId),
                                 eq(devices.deviceName, fingerprint)
                                )
                      ).then(res => res[0] ?? null); // Returns the device or null
    
  return result ? DeviceMapper.toEntity(result) : null
  
}
  

}





