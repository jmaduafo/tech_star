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

export const CreateProjectSchema = z.object({
  name: z.string().min(1, { message: "You must enter a name." }),
  country: z.string().min(1, { message: "You must select a country." }),
  month: z.string().min(1, { message: "You must select a month." }),
  year: z
    .number()
    .min(1900, {
      message: "The year cannot be less than the year 1900",
    })
    .max(new Date().getFullYear(), {
      message: "The year must be equal to or less than the current year.",
    }),
});

export const CreateContractorSchema = z.object({
  name: z.string().min(1, { message: "You must enter a name." }),
  importance_level: z
    .number()
    .min(0, {
      message: "Level of importance should be greater than or equal to 0.",
    })
    .max(5, {
      message: "Level of importance should be less than or equal to 5.",
    }),
});
