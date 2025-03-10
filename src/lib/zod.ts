import { z, ZodError } from "zod";

export const rsvpSchemaReal = z.object({
  email: z.string().email("Please enter a valid email address."),
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(50, "First name is too long."),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(50, "Last name is too long."),
  willAttend: z.enum(["Yes", "No", "Maybe"], {
    errorMap: () => ({ message: "Please select an option." }),
  }),
  willSleepOver: z.enum(["Yes", "No"], {
    errorMap: () => ({ message: "Please select an option." }),
  }),
});

export const rsvpSchemaFake = z.object({
  email: z.string().email("Please enter a valid email address."),
  firstName: z
    .string()
    .min(1, "First name is required.")
    .max(50, "First name is too long."),
  lastName: z
    .string()
    .min(1, "Last name is required.")
    .max(50, "Last name is too long."),
  willAttend: z.enum(["Yes", "No", "Maybe"], {
    errorMap: () => ({ message: "Please select an option." }),
  }),
});

export const formatZodErrors = (error: ZodError) => {
  return error.issues.map((issue) => `${issue.message}`).join(", ");
};
