import { UserProfile } from "../../@types/UserProfile";

export interface IUserCacheService {
  cacheUser(user: UserProfile): Promise<void>;
  getUser(userId: string): Promise<UserProfile | null>;
  removeUser(userId: string): Promise<void>;
}
