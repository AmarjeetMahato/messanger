import { randomUUID } from "crypto";
import { DeviceRow, DeviceInsert } from "../../../config/schema/Device.model";
import { CreateDeviceInput, UpdateDeviceInput, DeviceUserResponse, DeviceAdminResponse } from "../Dtos/deviceDtos";
import { DeviceEntity } from "../entity/deviceEntity";

export class DeviceMapper {
  constructor() {}

  // 🔹 DB → Entity
  static toEntity(row: DeviceRow): DeviceEntity {
    return new DeviceEntity(
      row.id,
      row.userId,
      row.fingerprint,
      row.deviceType,
      row.platform,

      row.deviceName ?? null,
      row.osVersion ?? null,
      row.browser ?? null,
      row.isBlocked ?? false,
      row.ipAddress ?? null,
      row.userAgent ?? null,
      row.refreshToken ?? null,

      row.lastActive ?? new Date(),
      row.isTrusted ?? false,
      row.timezone ?? null,
      row.pushToken ?? null,

      row.createdAt ?? new Date()
    );
  }

  // 🔹 Create DTO → Entity
  static fromCreateDto(
    dto: CreateDeviceInput,
    userId: string
  ): DeviceEntity {
    return new DeviceEntity(
       dto.id!,
      userId,
      dto.fingerprint,
      dto.deviceType,
      dto.platform,

      dto.deviceName ?? null,
      dto.osVersion ?? null,
      dto.browser ?? null,
      dto.isBlocked ?? false,
      dto.ipAddress ?? null,
      dto.userAgent ?? null,
      null, // refreshToken handled separately

      new Date(),
      false,
      dto.timezone ?? null,
      dto.pushToken ?? null,

      new Date()
    );
  }

  // 🔹 Update DTO → mutate Entity (controlled update)
  static updateEntity(
    entity: DeviceEntity,
    dto: UpdateDeviceInput
  ): DeviceEntity {
    if (dto.deviceName !== undefined) {
      entity.deviceName = dto.deviceName;
    }

    if (dto.osVersion !== undefined) {
      entity.osVersion = dto.osVersion;
    }

    if (dto.browser !== undefined) {
      entity.browser = dto.browser;
    }

    if (dto.pushToken !== undefined) {
      entity.pushToken = dto.pushToken;
    }

    if (dto.timezone !== undefined) {
      entity.timezone = dto.timezone;
    }

    entity.markActive();

    return entity;
  }

  // 🔹 Entity → DB Insert
  static toInsert(entity: DeviceEntity): DeviceInsert {
    return {
      id: entity.id,
      userId: entity.userId,
      fingerprint: entity.fingerprint,
      deviceType: entity.deviceType,
      platform: entity.platform,

      deviceName: entity.deviceName,
      osVersion: entity.osVersion,
      browser: entity.browser,

      ipAddress: entity.ipAddress,
      userAgent: entity.userAgent,
      refreshToken: entity.refreshToken,

      lastActive: entity.lastActive,
      isTrusted: entity.isTrusted,
      timezone: entity.timezone,
      pushToken: entity.pushToken,

      createdAt: entity.createdAt
    };
  }

  // 🔹 Entity → DB Update (partial safe update)
  static toUpdate(entity: DeviceEntity): Partial<DeviceInsert> {
    return {
      deviceName: entity.deviceName,
      osVersion: entity.osVersion,
      browser: entity.browser,
      refreshToken: entity.refreshToken,
      lastActive: entity.lastActive,
      isTrusted: entity.isTrusted,
      timezone: entity.timezone,
      pushToken: entity.pushToken
    };
  }

 static toUserResponse(entity: DeviceEntity): DeviceUserResponse {
  return {
    id: entity.id,
    userId: entity.userId,

    deviceType: entity.deviceType,
    platform: entity.platform,

    deviceName: entity.deviceName,
    osVersion: entity.osVersion,
    browser: entity.browser,

    ipAddress: entity.ipAddress,

    isTrusted: entity.isTrusted,
    timezone: entity.timezone,

    lastActive: entity.lastActive,
    createdAt: entity.createdAt,
  };
}

static toAdminResponse(entity: DeviceEntity): DeviceAdminResponse {
  return {
    id: entity.id,
    userId: entity.userId,

    deviceType: entity.deviceType,
    platform: entity.platform,

    deviceName: entity.deviceName,
    osVersion: entity.osVersion,
    browser: entity.browser,

    ipAddress: entity.ipAddress,
    userAgent: entity.userAgent,
    pushToken: entity.pushToken,

    isTrusted: entity.isTrusted,
    timezone: entity.timezone,

    lastActive: entity.lastActive,
    createdAt: entity.createdAt,
  };
}
}