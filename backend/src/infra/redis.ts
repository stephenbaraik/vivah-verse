import Redis from 'ioredis';

export type RedisConnectionOptions = {
  host: string;
  port: number;
  username?: string;
  password?: string;
  db?: number;
  tls?: Record<string, unknown>;
};

export function parseRedisUrl(redisUrl: string): RedisConnectionOptions {
  const url = new URL(redisUrl);

  const portFromUrl = url.port ? Number(url.port) : 6379;
  const dbFromPath =
    url.pathname && url.pathname !== '/'
      ? Number(url.pathname.slice(1))
      : undefined;

  return {
    host: url.hostname,
    port: Number.isFinite(portFromUrl) ? portFromUrl : 6379,
    username: url.username || undefined,
    password: url.password || undefined,
    db: Number.isFinite(dbFromPath as number)
      ? (dbFromPath as number)
      : undefined,
    tls: url.protocol === 'rediss:' ? {} : undefined,
  };
}

export function createRedisClient(redisUrl: string): Redis {
  const options = parseRedisUrl(redisUrl);
  return new Redis({
    host: options.host,
    port: options.port,
    username: options.username,
    password: options.password,
    db: options.db,
    tls: options.tls,
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    lazyConnect: true,
  });
}
