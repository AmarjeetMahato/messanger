import { baseAPI } from "./baseApi";


export  const userAPI = baseAPI.injectEndpoints({
         endpoints:(builder)=>({
              
             getMe: builder.query({
                 query:()=>({
                    url:"auth/me",
                   method:"GET",
                 })
             })
         })
});

export const {useGetMeQuery} = userAPI;