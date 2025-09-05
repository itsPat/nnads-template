declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;

    DATABASE_URL: string;

    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    CLOUDFLARE_R2_ACCESS_KEY: string;
    CLOUDFLARE_R2_SECRET_KEY: string;
    CLOUDFLARE_R2_BUCKET_NAME: string;
    CLOUDFLARE_R2_ENDPOINT: string;

    OPENROUTER_API_KEY: string;
  }
}
