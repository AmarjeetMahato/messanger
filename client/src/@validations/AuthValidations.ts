import {z}  from "zod";

export const createUserSchema = z.object({
  email: z.email("Invalid email format").max(255),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  roleName: z.string().optional(),
  username: z.string().min(3).max(50)
             .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, underscores"),
  fullName: z.string().max(100).optional(),
  avatarUrl: z
  .string()
  .optional()
  .refine(
    (val) => !val || /^https?:\/\/.+/.test(val),
    { message: "Invalid avatar URL" }
  ),
  mfaEnabled: z.boolean().optional(),
});



export const loginSchema = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),

  password: z
    .string()
    .min(1, { message: "Password is required" }),
}).strict();

export type CreateUserSchemaDto = z.infer<typeof createUserSchema>
export type LoginUserDto = z.infer<typeof loginSchema>
