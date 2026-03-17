import {z} from "zod";



export  const CreateDirectConversationSchema  = z.object({
    receiverId:z.uuid("Invalid receiverId format"),
})

export const CreateGroupConversationSchema = z.object({
  title: z
    .string()
    .min(3, "Group title must be at least 3 characters")
    .max(100, "Group title too long"),

  memberIds: z
    .array(z.uuid())
    .min(1, "At least one member required"),
});


export type CreateDirectConversationDto = z.infer<typeof CreateDirectConversationSchema>;
export type CreateGroupConversationDto = z.infer<typeof CreateGroupConversationSchema>;