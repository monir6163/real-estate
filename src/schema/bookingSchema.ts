import * as z from "zod";

export const createBookingSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  visitDate: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Visit date must be in the future"),
  message: z
    .string()
    .max(500, "Message must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type CreateBookingFormType = z.infer<typeof createBookingSchema>;

export const defaultBookingValues = {
  propertyId: "",
  visitDate: new Date().toISOString().split("T")[0],
  message: "",
};
