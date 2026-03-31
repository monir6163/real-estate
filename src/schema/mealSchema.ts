import { z } from "zod";

const mealFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  cuisine: z.string().min(2, "Cuisine is required"),
  dietary: z.array(z.string()).min(1, "add at least one dietary preference"),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(10000, "Price value is too high"),
  calories: z
    .number()
    .min(0, "Calories cannot be negative")
    .max(5000, "Calories value is too high"),
  ingredients: z.array(z.string()).min(1, "Add at least one ingredient"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().optional(),
  isAvailable: z.boolean(),
  mealType: z.string().min(1, "Meal type is required"),
  spiceLevel: z.enum(["Low", "Medium", "High"]),
  categoryId: z.string().min(1, "Category is required"),
});
type MealFormType = z.infer<typeof mealFormSchema>;

const defaultValues: MealFormType = {
  name: "",
  cuisine: "",
  dietary: [],
  price: 0,
  calories: 0,
  ingredients: [],
  description: "",
  image: undefined,
  isAvailable: true,
  mealType: "",
  spiceLevel: "Low",
  categoryId: "",
};

export { defaultValues, mealFormSchema, type MealFormType };
