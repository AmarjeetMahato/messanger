import { UsersResponse, UserResponse } from "@/@types/UserType";
import { baseAPI } from "./baseApi";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserResponse, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
    }),

    getUserByUserId: builder.query<UserResponse, string>({
      query: (userId) => ({
        url: `/user/get_user/${userId}`,
        method: "GET",
      }),
    }),

    getAllUsers: builder.query<UsersResponse, { limit: number; page: number }>({
      query: ({ limit, page }) => ({
        url: "/user/get_all_users",
        method: "GET",
        params: { limit, page },
      }),
    }),
  }),
});

export const { useGetMeQuery, useGetAllUsersQuery, useGetUserByUserIdQuery } =
  userAPI;
