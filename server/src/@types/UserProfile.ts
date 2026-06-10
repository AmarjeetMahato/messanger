export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  isVerified: boolean | null;
  lastSeen: Date | null;
}
