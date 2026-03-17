import { format, isToday, isYesterday } from "date-fns";

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