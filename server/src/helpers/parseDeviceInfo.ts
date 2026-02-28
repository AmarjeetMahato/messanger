import { Request } from "express";
import  {UAParser} from "ua-parser-js";

export const parseDeviceInfo = (req: Request) => {
  const ua = req.headers["user-agent"] ?? "";
  const parser = new UAParser(ua);

  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // optional: detect server TZ

  return {
    deviceType: (device.type ?? "desktop") as "mobile" | "desktop" | "tablet",
    platform: (os.name ?? "unknown").toLowerCase() as
      | "ios"
      | "android"
      | "windows"
      | "macos"
      | "linux",
    osVersion: os.version ?? null,
    browser: browser.name ?? null,
    timezone
  };
};