import { baseAPI } from "./baseApi";
import {
  MessageQueryResponse,
  MessageRequest,
  MessageResponse,
} from "@/@types/MessageTypes";

export const messageApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<MessageQueryResponse, string>({
      query: (conversationId) => `/message/${conversationId}`,
      providesTags: ["Message"],
    }),

    sendMessages: builder.mutation<MessageResponse, MessageRequest>({
      query: (data) => ({
        url: "/message/send-message",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const { useSendMessagesMutation, useGetMessagesQuery } = messageApi;
