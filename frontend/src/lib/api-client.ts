import { OpenAPI } from "./api/core/OpenAPI";

// Konfiguracja klienta API
OpenAPI.BASE = "http://localhost:3000";
OpenAPI.HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
