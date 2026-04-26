import {z} from "zod";


export const roleCreateSchemaParams = z.object({
    roleId: z.uuid({ message:"Invalid role Id"})
})

export const  RoleSchema = z.object({
     name: z.string()
})

export const roleResponseSchema = z.object({
  roleId: z.uuid(),
  name: z.string().min(1).max(100),
  createdDate: z.date(),
  lastModifiedDate: z.date().nullable(),
});

export type RoleResponseDto = z.infer<typeof roleResponseSchema>;
export type roleSchemaDto = z.infer<typeof RoleSchema>;
