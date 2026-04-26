export class DeviceEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly fingerprint:string,
    // System Data
    public readonly deviceType: "mobile" | "desktop" | "tablet" | "web" | "smarttv",
    public readonly platform: "ios" | "android" | "windows" | "macos" | "linux" | "browser",

    public deviceName: string | null,
    public osVersion: string | null,
    public browser: string | null,
    
    public isBlocked: boolean,
    // Security Data
    public ipAddress: string | null,
    public userAgent: string | null,
    public refreshToken: string | null,

    public lastActive: Date,
    public isTrusted: boolean,
    public timezone: string | null,
    public pushToken: string | null,

    public readonly createdAt: Date
  ) {}

  // ✅ Domain behaviors
  markActive() {
    this.lastActive = new Date();
  }

  markTrusted() {
    this.isTrusted = true;
  }

  updateRefreshToken(token: string) {
    this.refreshToken = token;
    this.markActive();
  }

  isDeviceBlocked(){
    return this.isBlocked
  }

  removeRefreshToken() {
    this.refreshToken = null;
  }
}