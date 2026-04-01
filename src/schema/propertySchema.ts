import * as z from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  location: z.string().min(1, "Location is required"),
  address: z.string().optional(),
  bedrooms: z.coerce
    .number()
    .int()
    .nonnegative("Bedrooms must be a non-negative integer"),
  bathrooms: z.coerce
    .number()
    .int()
    .nonnegative("Bathrooms must be a non-negative integer"),
  area: z.coerce.number().positive("Area must be a positive number"),
  type: z.enum(["APARTMENT", "HOUSE", "COMMERCIAL", "LAND"]),
  listingType: z.enum(["RENT", "SALE"]),
  status: z.enum(["AVAILABLE", "RENTED", "SOLD"]).default("AVAILABLE"),
  isPremium: z.coerce.boolean(),
  isFeatured: z.coerce.boolean(),
  thumbnail: z.any(),
  propertyImages: z.any(),
});

export type CreatePropertyFormType = z.infer<typeof createPropertySchema>;

export const defaultPropertyValues = {
  title: "",
  description: "",
  price: 0,
  location: "",
  address: "",
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  type: "APARTMENT" as const,
  listingType: "RENT" as const,
  status: "AVAILABLE" as const,
  isPremium: true,
  isFeatured: false,
  thumbnail: undefined as File | undefined,
  propertyImages: [] as File[],
};
