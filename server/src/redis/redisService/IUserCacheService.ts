import { inject, injectable } from "tsyringe";
import { IUserCacheService } from "./UserCacheService";
import { UserProfile } from "../../@types/UserProfile";
import Redis from "ioredis";
import { NotFoundExceptions } from "../../utils/Catch-error";

@injectable()
export class UserCacheService implements IUserCacheService {
  constructor(@inject("RedisClient") private readonly redis: Redis) {}

  async cacheUser(user: UserProfile): Promise<void> {
    await this.redis.set(`user:${user.id}`, JSON.stringify(user));

    await this.redis.set(`user:email:${user.email}`, user.id);

    await this.redis.set(`user:username:${user.username}`, user.id);
  }

  async getUser(userId: string): Promise<UserProfile | null> {
    const user = await this.redis.get(`user:${userId}`);
    if (!user) {
      return null;
    }
    return JSON.parse(user) as UserProfile;
  }

  async removeUser(userId: string): Promise<void> {
    await this.redis.del(`user:${userId}`);
  }
}
