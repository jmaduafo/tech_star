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

export const CreateMemberSchema = z.object({
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
  confirm: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(100, {
      message: "Password is too long. Must be 100 characters at most.",
  }),
  location: z.string().min(1, {
    message: "You must select a location",
  }),
  job_title: z.string().min(1, {
    message: "You must select a job title",
  }),
  role: z.enum(["viewer", "admin", "editor"], {
    message: "Role must either be 'viewer', 'editor', or 'admin'"
  }),
  hire_type: z.string().min(1, {
    message: "You must select a hire type",
  }),
});

export const EditUserSchema = z.object({
  first_name: z.string().min(1, {
    message: "First name must be filled in",
  }),
  last_name: z.string().min(1, {
    message: "Last name must be filled in",
  }),
  location: z.nullable(z.string()),
  job_title: z.nullable(z.string()),
  image_url: z.string().url().optional(),
});

export const EditMemberSchema = z.object({
  role: z.enum(["viewer", "admin", "editor"]),
  hire_type: z.enum(["employee", "contractor", "independent"])
});

export const LoginUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email field cannot be left empty." })
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

export const NamesValidation = z.object({
  first_name: z.string().min(1, {
    message: "First name must be filled in",
  }),
  last_name: z.string().min(1, {
    message: "Last name must be filled in",
  }),
});

export const PasswordValidation = z.object({
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters",
    })
    .max(100, {
      message: "Password is too long. Must be 100 characters at most.",
    }),
});

export const EmailValidation = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1, { message: "You must enter a name." }),
  country: z.string().min(1, { message: "You must select a country." }),
  city:  z.nullable(z.string()),
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

export const EditProjectSchema = z.object({
  name: z.string().min(1, { message: "You must enter a name." }),
  country: z.string().min(1, { message: "You must select a country." }),
  city:  z.nullable(z.string()),
  month: z.string().min(1, { message: "You must select a month." }),
  is_completed: z.boolean(),
  year: z
    .number()
    .min(1900, {
      message: "The year cannot be less than the year 1900",
    })
    .max(new Date().getFullYear(), {
      message: "The year must be equal to or less than the current year.",
    }),
});

export const CreateStagesSchema = z.object({
  name: z.string().min(1, { message: "You must enter a name for this stage." }),
  description: z.string().min(1, {
    message: "You must enter a description for this stage.",
  }),
});

export const EditStageSchema = z.object({
  name: z.string().min(1, { message: "You must enter a name for this stage." }),
  description: z.string().min(1, {
    message: "You must enter a description for this stage.",
  }),
  is_completed: z.boolean(),
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
  location: z.string().min(1, { message: "You must select a location." }),
  is_unavailable: z.boolean(),
  additional_info: z.nullable(z.string()),
});

export const CreateContractSchema = z.object({
  code: z.string().min(1, { message: "You must enter a contract code." }),
  desc: z
    .string()
    .min(1, { message: "You must enter a contract description." }),
  date: z
    .date({
      required_error: "Please select a date",
    })
    .min(new Date("1960-01-01"), {
      message: "The date cannot be earlier than 1960",
    }),
  bank_names: z.string().array().nonempty({
    message: "There must be at least one bank entered.",
  }),
  stage_id: z.string().nonempty({
    message: "There must be a stage selected.",
  }),
  is_completed: z.boolean(),
  currency: z
    .object({
      code: z.string().nonempty({
        message: "You must enter a currency code.",
      }),
      name: z.string().nonempty({
        message: "You must enter a currency name.",
      }),
      symbol: z.string().nonempty({
        message: "You must enter a currency symbol.",
      }),
      amount: z
        .number()
        .min(0.01, {
          message: "You must enter an amount greater than 0.",
        })
        .or(z.string().includes("Unlimited")),
    })
    .array()
    .nonempty({
      message: "You must enter a currency and amount.",
    }),
  comment: z.nullable(z.string())
});

export const CreatePaymentSchema = z.object({
  desc: z.nullable(z.string()),
  date: z
    .date({
      required_error: "Please select a date",
    })
    .min(new Date("1960-01-01"), {
      message: "The date cannot be earlier than 1960",
    }),
  bank_names: z.string().array().nonempty({
    message: "There must be at least one bank entered.",
  }),
  is_completed: z.boolean(),
  stage_id: z.string().nonempty({
    message: "There must be a stage selected.",
  }),
  currency: z
    .object({
      code: z.string().nonempty({
        message: "You must enter a currency code.",
      }),
      name: z.string().nonempty({
        message: "You must enter a currency name.",
      }),
      symbol: z.string().nonempty({
        message: "You must enter a currency symbol.",
      }),
      amount: z
        .number()
        .min(0.01, {
          message: "You must enter an amount greater than 0.",
        })
        .or(z.string().includes("Unlimited")),
    })
    .array()
    .nonempty({
      message: "You must enter a currency and amount.",
    }),
  comment: z.nullable(z.string())
});
