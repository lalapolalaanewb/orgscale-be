declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    MONGO_DB_NAME: string;
    MONGODB_URI: string;
    MONGODB_OPTION: string;
    MONGO_ROOT_USERNAME: string;
    MONGO_ROOT_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
    API_KEY: string;
  }
}
