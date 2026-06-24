import { format, isToday, isYesterday } from "date-fns";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const formatSidebarTime = (timestamp?: string | null) => {
  if (!timestamp) return ""; // return empty string if no timestamp

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return ""; // invalid date guard

  if (isToday(date)) {
    return format(date, "h:mm a"); // e.g., 7:20 PM
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "dd/MM/yy"); // e.g., 14/03/26
};

let cachedFingerprint: string | null = null;

export const getDeviceFingerprint = async () => {
  if (cachedFingerprint) return cachedFingerprint;

  const stored = localStorage.getItem("fp");
  if (stored) {
    cachedFingerprint = stored;
    return stored;
  }

  const fp = await FingerprintJS.load();
  const result = await fp.get();

  cachedFingerprint = result.visitorId;

  localStorage.setItem("fp", cachedFingerprint);

  return cachedFingerprint;
};
