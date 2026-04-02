"use client";

import { createProperty } from "@/actions/properties";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error-message";
import {
  createPropertySchema,
  defaultPropertyValues,
} from "@/schema/propertySchema";
import { useForm } from "@tanstack/react-form";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// Helper function to validate a single field with Zod schema
const validateField = (fieldName: string, value: any) => {
  try {
    const fieldSchema = createPropertySchema.pick({ [fieldName]: true } as any);
    fieldSchema.parse({ [fieldName]: value });
    return undefined;
  } catch (error: any) {
    const issues = error?.issues || error?.errors;

    if (issues && issues.length > 0) {
      return issues[0].message;
    }

    return "Invalid value";
  }
};
export default function CreatePropertyForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: defaultPropertyValues,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        setIsLoading(true);

        // Validate thumbnail exists
        if (!value.thumbnail) {
          throw new Error("Thumbnail image is required");
        }
        if (!value.propertyImages || value.propertyImages.length === 0) {
          throw new Error("At least one property image is required");
        }

        // Validate total upload size (thumbnail + all images)

        const imageFiles: File[] = value.propertyImages || [];
        const totalUploadBytes =
          (value.thumbnail?.size || 0) +
          imageFiles.reduce(
            (sum: number, file: File) => sum + (file?.size || 0),
            0,
          );

        if (totalUploadBytes > MAX_UPLOAD_BYTES) {
          throw new Error(
            "Total image size is too large. Keep thumbnail + images under 4MB.",
          );
        }

        // Create FormData for multipart upload
        const formData = new FormData();

        // Add form fields - string values
        formData.append("title", value.title);
        formData.append("description", value.description);
        formData.append("location", value.location);
        formData.append("address", value.address || "");
        formData.append("type", value.type);
        formData.append("listingType", value.listingType);
        formData.append("status", value.status || "AVAILABLE");

        // Add form fields - numeric values (sent as strings, backend will parse)
        formData.append("price", String(value.price));
        formData.append("bedrooms", String(Math.floor(value.bedrooms)));
        formData.append("bathrooms", String(Math.floor(value.bathrooms)));
        formData.append("area", String(value.area));

        // Add form fields - boolean values (sent as strings, backend will parse)
        formData.append("isPremium", String(value.isPremium === true));
        formData.append("isFeatured", String(value.isFeatured === true));

        // Add thumbnail file
        formData.append("thumbnail", value.thumbnail);

        // Add property images
        if (imageFiles.length > 0) {
          imageFiles.forEach((imageFile: File) => {
            formData.append("images", imageFile);
          });
        }

        // Submit to backend via server action
        const result = await createProperty(formData);

        if (!result.success) {
          throw new Error(result.message);
        }

        toast.success(result.message || "Property created successfully!");
        form.reset();
      } catch (error) {
        console.error("Error creating property:", error);
        toast.error(
          getErrorMessage(
            error,
            "Could not create property. Please check the form and try again.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const renderFieldError = (fieldMeta: any) => {
    const errors = fieldMeta?.errors;
    if (!errors || errors.length === 0) return null;

    const message =
      typeof errors[0] === "string"
        ? errors[0]
        : errors[0]?.message || "Invalid input";

    return (
      <div className="mt-2 flex items-center gap-2 text-red-500 text-sm font-medium">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Create New Property
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            List your property to attract potential buyers or renters
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            <CardDescription>
              Fill in all required fields to create your listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              {/* Title */}
              <form.Field
                name="title"
                validators={{
                  onBlur: ({ value }: { value: any }) =>
                    validateField("title", value),
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Beautiful 3-Bedroom Apartment in Downtown"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={isInvalid ? "border-red-500" : ""}
                      />
                      {isInvalid && renderFieldError(field.state.meta)}
                    </div>
                  );
                }}
              />

              {/* Description */}
              <form.Field
                name="description"
                validators={{
                  onBlur: ({ value }: { value: any }) =>
                    validateField("description", value),
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your property, amenities, and features..."
                        rows={5}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={isInvalid ? "border-red-500" : ""}
                      />
                      {isInvalid && renderFieldError(field.state.meta)}
                    </div>
                  );
                }}
              />

              {/* Location and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field
                  name="location"
                  validators={{
                    onBlur: ({ value }: { value: any }) =>
                      validateField("location", value),
                  }}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Dhaka, New York"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className={isInvalid ? "border-red-500" : ""}
                        />
                        {isInvalid && renderFieldError(field.state.meta)}
                      </div>
                    );
                  }}
                />

                <form.Field
                  name="address"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="address">Address (Optional)</Label>
                      <Input
                        id="address"
                        placeholder="Detailed address"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                />
              </div>

              {/* Price and Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field
                  name="price"
                  validators={{
                    onBlur: ({ value }: { value: any }) =>
                      validateField("price", value),
                  }}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor="price">
                          Price{" "}
                          {form.getFieldValue("listingType") === "RENT"
                            ? "(per month)"
                            : ""}{" "}
                          *
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="0"
                          step="0.01"
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value) || 0)
                          }
                          onBlur={field.handleBlur}
                          className={isInvalid ? "border-red-500" : ""}
                        />
                        {isInvalid && renderFieldError(field.state.meta)}
                      </div>
                    );
                  }}
                />

                <form.Field
                  name="area"
                  validators={{
                    onBlur: ({ value }: { value: any }) =>
                      validateField("area", value),
                  }}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor="area">Area (sqft) *</Label>
                        <Input
                          id="area"
                          type="number"
                          placeholder="0"
                          step="0.01"
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseFloat(e.target.value) || 0)
                          }
                          onBlur={field.handleBlur}
                          className={isInvalid ? "border-red-500" : ""}
                        />
                        {isInvalid && renderFieldError(field.state.meta)}
                      </div>
                    );
                  }}
                />
              </div>

              {/* Bedrooms and Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field
                  name="bedrooms"
                  validators={{
                    onBlur: ({ value }: { value: any }) =>
                      validateField("bedrooms", value),
                  }}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms *</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          placeholder="0"
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value) || 0)
                          }
                          onBlur={field.handleBlur}
                          className={isInvalid ? "border-red-500" : ""}
                        />
                        {isInvalid && renderFieldError(field.state.meta)}
                      </div>
                    );
                  }}
                />

                <form.Field
                  name="bathrooms"
                  validators={{
                    onBlur: ({ value }: { value: any }) =>
                      validateField("bathrooms", value),
                  }}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms *</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          placeholder="0"
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value) || 0)
                          }
                          onBlur={field.handleBlur}
                          className={isInvalid ? "border-red-500" : ""}
                        />
                        {isInvalid && renderFieldError(field.state.meta)}
                      </div>
                    );
                  }}
                />
              </div>

              {/* Type */}
              <form.Field
                name="type"
                validators={{
                  onBlur: ({ value }: { value: any }) =>
                    validateField("type", value),
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="type">Property Type *</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as any)
                        }
                      >
                        <SelectTrigger
                          id="type"
                          className={isInvalid ? "border-red-500" : ""}
                          onBlur={field.handleBlur}
                        >
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APARTMENT">Apartment</SelectItem>
                          <SelectItem value="HOUSE">House</SelectItem>
                          <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                          <SelectItem value="LAND">Land</SelectItem>
                        </SelectContent>
                      </Select>
                      {isInvalid && renderFieldError(field.state.meta)}
                    </div>
                  );
                }}
              />

              {/* Listing Type */}
              <form.Field
                name="listingType"
                validators={{
                  onBlur: ({ value }: { value: any }) =>
                    validateField("listingType", value),
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="listingType">Listing Type *</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as any)
                        }
                      >
                        <SelectTrigger
                          id="listingType"
                          className={isInvalid ? "border-red-500" : ""}
                          onBlur={field.handleBlur}
                        >
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RENT">For Rent</SelectItem>
                          <SelectItem value="SALE">For Sale</SelectItem>
                        </SelectContent>
                      </Select>
                      {isInvalid && renderFieldError(field.state.meta)}
                    </div>
                  );
                }}
              />

              {/* Thumbnail Image */}
              <form.Field
                name="thumbnail"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Thumbnail Image *</Label>
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.handleChange(file);
                          }
                        }}
                        className={isInvalid ? "border-red-500" : ""}
                      />
                      {field.state.value && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Selected: {(field.state.value as File).name}
                        </p>
                      )}
                      {isInvalid && renderFieldError(field.state.meta)}
                    </div>
                  );
                }}
              />

              {/* Property Images */}
              <form.Field
                name="propertyImages"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="propertyImages">
                      Additional Property Images (Max total size: 4MB)
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select multiple images from your device
                    </p>
                    <Input
                      id="propertyImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        field.handleChange(files);
                      }}
                    />
                    {field.state.value && field.state.value.length > 0 && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p>Selected images:</p>
                        <ul className="list-disc list-inside">
                          {field.state.value.map(
                            (file: File, index: number) => (
                              <li key={index}>{file.name}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              />

              {/* Checkbox */}
              {/* <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <form.Field
                  name="isPremium"
                  children={(field) => (
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="isPremium"
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(!!checked)
                        }
                      />
                      <Label htmlFor="isPremium" className="cursor-pointer">
                        Mark as Premium Listing
                      </Label>
                    </div>
                  )}
                />
              </div> */}

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Creating property..." : "Create Property"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isLoading}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
