import {z} from "zod";

export const  RoleSchema = z.object({
     name: z.string()
})

export type roleSchemaDto = z.infer<typeof RoleSchema>;
