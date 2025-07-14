import { OpenAPI } from "./api/core/OpenAPI";

// Configure API client
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
OpenAPI.WITH_CREDENTIALS = false;

export { OpenAPI };
