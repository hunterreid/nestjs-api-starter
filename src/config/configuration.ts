export interface AppConfig {
  environment: 'development' | 'production';
  port: number;
  nodeEnv: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export interface LoggingConfig {
  level: string;
}

export interface DebugConfig {
  enableDebugEndpoints: boolean;
}

export default () => ({
  app: {
    environment: process.env.ENVIRONMENT || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  } as AppConfig,
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  } as RedisConfig,
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  } as LoggingConfig,
  debug: {
    enableDebugEndpoints: process.env.ENABLE_DEBUG_ENDPOINTS === 'true',
  } as DebugConfig,
});
