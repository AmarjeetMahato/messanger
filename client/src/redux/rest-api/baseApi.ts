import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseURL = "http://localhost:5000";

// Base API
export const baseAPI = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    credentials: "include", // for cookies
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["User", "Auth"],

  // TypeScript requires endpoints to be typed
  endpoints: (builder) => ({}),
});