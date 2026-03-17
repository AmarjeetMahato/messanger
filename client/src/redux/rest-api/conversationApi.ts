
import { ConversationResponse, CreateConversationRequest, CreateConversationResponse } from "@/@types/ConversationTypes";
import { baseAPI } from "./baseApi";

export const conversationApi = baseAPI.injectEndpoints({
     endpoints:(builder)=>({

            createConversation: builder.mutation<CreateConversationResponse,CreateConversationRequest>({
                 query:(body)=>({
                     url:"conversation/create",
                     method:"POST",
                     body
                 }),
                 invalidatesTags:["Conversation"]
            }),
         
            fetchUserConversation: builder.query<ConversationResponse,void>({
                 query:()=>({
                    url:"conversation/fetch_convo_by_userId",
                    method:"GET",
                 }),
                 providesTags: ["Conversation"]
            })

     })
})


export const  {
     useFetchUserConversationQuery,
     useCreateConversationMutation
} = conversationApi;