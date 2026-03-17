import { Request } from "express";
import  {UAParser} from "ua-parser-js";

export const parseDeviceInfo = (req: Request) => {
  const ua = req.headers["user-agent"] ?? "";
  const parser = new UAParser(ua);

  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // optional: detect server TZ

      // Map OS to valid enum
  let platform: "ios" | "android" | "windows" | "macos" | "linux" | "browser" = "browser";


  if (os.name) {
    const osName = os.name.toLowerCase();
    if (["ios", "android", "windows", "macos", "linux"].includes(osName)) {
      platform = osName as typeof platform;
    }
  }

  return {
    deviceType: (device.type ?? "desktop") as "mobile" | "desktop" | "tablet",
    platform,
    osVersion: os.version ?? null,
    browser: browser.name ?? null,
    timezone
  };
};