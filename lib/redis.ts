import { DEFAULT_USER_ID } from "@/lib/config";
import { mergePreferences } from "@/lib/preferences";
import { createClient } from "redis";
import type { UserPreferences } from "@/types/preferences";

const REDIS_URL = process.env.REDIS_URL;
type RedisClient = ReturnType<typeof createClient>;

const globalForRedis = global as unknown as {
  redis: RedisClient | undefined;
  redisConnecting: Promise<RedisClient> | undefined;
};

let client: RedisClient | undefined = globalForRedis.redis;
let connecting: Promise<RedisClient> | undefined = globalForRedis.redisConnecting;

function getPreferenceKey(userId: string) {
  return `user-preferences:${userId}`;
}

export function isRedisConfigured() {
  return Boolean(REDIS_URL);
}

function createRedisClient() {
  return createClient({ url: REDIS_URL });
}

async function getRedisClient() {
  if (!isRedisConfigured()) {
    throw new Error("Redis is not configured");
  }

  if (client?.isOpen) {
    return client;
  }

  if (connecting) {
    return connecting;
  }

  connecting = (async () => {
    const nextClient = createRedisClient();
    nextClient.on("error", (error) => {
      console.error("Redis client error:", error);
    });
    await nextClient.connect();
    client = nextClient;
    return nextClient;
  })();

  try {
    return await connecting;
  } finally {
    connecting = undefined;
    globalForRedis.redisConnecting = undefined;
  }
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  if (!isRedisConfigured() || userId === DEFAULT_USER_ID) {
    return null;
  }

  const redis = await getRedisClient();
  const raw = await redis.get(getPreferenceKey(userId));

  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as Partial<UserPreferences>;
  return mergePreferences(parsed);
}

export async function setUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
  if (!isRedisConfigured() || userId === DEFAULT_USER_ID) {
    return;
  }

  const redis = await getRedisClient();
  await redis.set(getPreferenceKey(userId), JSON.stringify(preferences));
}
