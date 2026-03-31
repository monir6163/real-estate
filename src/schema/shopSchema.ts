import * as z from "zod";

const ShopFormSchema = z.object({
  shopName: z.string().min(1, { message: "Shop name is required" }),
  description: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

type ShopFormType = z.infer<typeof ShopFormSchema>;

const defaultValues: ShopFormType = {
  shopName: "",
  address: "",
  phone: "",
  description: "",
};

export { defaultValues, ShopFormSchema, type ShopFormType };
