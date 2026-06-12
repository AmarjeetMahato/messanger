import {
  ApiResponse,
  LoginUserDto,
  LogoutResponse,
  RequestRegisterUserDto,
  ResponseAuthDto,
  VerifyEmailWithOTP,
} from "@/@types/AuthType";
import { baseAPI } from "./baseApi";

export const authApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ResponseAuthDto, RequestRegisterUserDto>({
      query: (data) => ({
        url: "/auth/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    emailVerification: builder.mutation<ResponseAuthDto, VerifyEmailWithOTP>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<ResponseAuthDto, LoginUserDto>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.query<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    resendOtp: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "auth/resend-otp",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useEmailVerificationMutation,
  useLoginMutation,
  useLazyLogoutQuery,
  useResendOtpMutation,
} = authApi;
