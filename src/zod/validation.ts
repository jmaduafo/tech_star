import { z } from "zod";

export const CreateUserSchema = z.object({
  first_name: z.string().min(1, {
    message: "First name must be filled in",
  }),
  last_name: z.string().min(1, {
    message: "Last name must be filled in",
  }),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(100, {
      message: "Password is too long. Must be 100 characters at most.",
    }),
});

export const LoginUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(100, {
      message: "Password is too long. Must be 100 characters at most.",
    }),
});
