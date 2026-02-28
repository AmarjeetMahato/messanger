import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../helpers/tokens";
import {type DbOrTx } from "../../../config/database";
import { devices } from "../../../config/schema/Device.model";
import { CreateDeviceInput } from "../Dtos/deviceDtos";
import { and, eq } from "drizzle-orm";



@injectable()
export class DeviceRepository{
    constructor(@inject(TOKENS.DB) private db:DbOrTx){}

    async registerDevice(deviceDto:CreateDeviceInput){
      const [result] = await this.db
      .insert(devices)
      .values({
        userId: deviceDto.userId, // ✅ use userId, NOT id
        refreshToken: deviceDto.refreshToken,
        ipAddress: deviceDto.ipAddress,
        userAgent: deviceDto.userAgent,
        deviceType: deviceDto.deviceType,
        platform: deviceDto.platform,
        osVersion: deviceDto.osVersion,
        browser: deviceDto.browser,
        deviceName: deviceDto.deviceName,
        pushToken: deviceDto.pushToken,
        isTrusted: deviceDto.isTrusted,
        timezone: deviceDto.timezone ? new Date(deviceDto.timezone) : new Date(),
      })
      .returning();
     return  result;
    }


async findDeviceByUserAndFingerprint(userId: string, fingerprint: string) {
    return this.db
    .select()
    .from(devices)
    .where(
      and(
        eq(devices.userId, userId),
        eq(devices.deviceName, fingerprint)
      )
    )
    .limit(1) // Better practice than .get() for some drivers
    .then(res => res[0] ?? null); // Returns the device or null
  }

}





