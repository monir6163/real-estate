import * as z from "zod";

export const createReviewSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating can be at most 5 stars"),
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(500, "Comment must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type CreateReviewFormType = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating can be at most 5 stars")
    .optional(),
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(500, "Comment must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateReviewFormType = z.infer<typeof updateReviewSchema>;

export const defaultReviewValues = {
  propertyId: "",
  rating: 5,
  comment: "",
};
