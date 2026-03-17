import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const baseURL = "http://localhost:5000/api/v1";

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

  tagTypes: ["User", "Auth","Message","Conversation"],

  // TypeScript requires endpoints to be typed
  endpoints: (builder) => ({}),
});