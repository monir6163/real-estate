"use client";

import { updateProperty } from "@/actions/properties";
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
import { createPropertySchema } from "@/schema/propertySchema";
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
    if (error.errors && error.errors[0]) {
      return error.errors[0].message;
    }
    return error.message || "Invalid value";
  }
};

interface PropertyImage {
  id: string;
  url: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  listingType: string;
  status: string;
  thumbnail: string;
  isFeatured: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  propertyImages?: PropertyImage[];
}

interface EditPropertyFormProps {
  property: Property;
}

export default function EditPropertyForm({ property }: EditPropertyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const form = useForm({
    defaultValues: {
      title: property.title,
      description: property.description,
      location: property.location,
      address: property.address || "",
      type: property.type,
      listingType: property.listingType,
      status: property.status || "AVAILABLE",
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      isPremium: property.isPremium,
      isFeatured: property.isFeatured,
      thumbnail: null as any,
      propertyImages: [] as any,
    },
    onSubmit: async ({ value }: { value: any }) => {
      try {
        setIsLoading(true);

        // Create FormData for multipart update
        const formData = new FormData();

        const totalUploadBytes =
          (newThumbnailFile?.size || 0) +
          newImageFiles.reduce((sum, file) => sum + file.size, 0);

        if (totalUploadBytes > MAX_UPLOAD_BYTES) {
          throw new Error(
            "Total new upload size is too large. Keep files under 4MB.",
          );
        }

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

        // Add new thumbnail file if selected
        if (newThumbnailFile) {
          formData.append("thumbnail", newThumbnailFile);
        }

        // Add new property images if selected
        if (newImageFiles && newImageFiles.length > 0) {
          newImageFiles.forEach((imageFile: File) => {
            formData.append("images", imageFile);
          });
        }

        // Submit to backend
        const result = await updateProperty(property.id, formData);

        if (!result.success) {
          throw new Error(result.message);
        }

        toast.success(result.message || "Property updated successfully!");
      } catch (error) {
        console.error("Error updating property:", error);
        toast.error(
          getErrorMessage(
            error,
            "Could not update property. Please review your changes and try again.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const renderFieldError = (fieldMeta: any) => {
    // @tanstack/react-form stores errors as an array of strings
    const errors = fieldMeta?.errors;
    if (!errors || errors.length === 0) return null;

    // errors[0] should be the error message string
    const message = errors[0];
    if (!message) return null;

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
            Edit Property
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Update your property listing details
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            <CardDescription>
              Update the details of your property listing
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
                          className={isInvalid ? "border-red-500" : ""}
                        />
                        {isInvalid && renderFieldError(field.state.meta)}
                      </div>
                    );
                  }}
                />

                <form.Field
                  name="area"
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
                          className={isInvalid ? "border-red-500" : ""}
                        />
                        {isInvalid && renderFieldError(field.state.meta)}
                      </div>
                    );
                  }}
                />

                <form.Field
                  name="bathrooms"
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

              {/* Status */}
              <form.Field
                name="status"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as any)
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="SOLD">Sold</SelectItem>
                        <SelectItem value="RENTED">Rented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              {/* Current Thumbnail */}
              {property.thumbnail && (
                <div className="space-y-2">
                  <Label>Current Thumbnail</Label>
                  <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                    <img
                      src={property.thumbnail}
                      alt="Current thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Select a new image below to replace it
                  </p>
                </div>
              )}

              {/* New Thumbnail Image */}
              <form.Field
                name="thumbnail"
                children={() => (
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">
                      New Thumbnail Image (Optional)
                    </Label>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewThumbnailFile(file);
                        }
                      }}
                    />
                    {newThumbnailFile && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Selected: {newThumbnailFile.name}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Current Property Images */}
              {property.propertyImages &&
                property.propertyImages.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Property Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.propertyImages.map((image) => (
                        <div
                          key={image.id}
                          className="relative h-24 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden"
                        >
                          <img
                            src={image.url}
                            alt="Property"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Add new images below to add more photos
                    </p>
                  </div>
                )}

              {/* New Property Images */}
              <form.Field
                name="propertyImages"
                children={() => (
                  <div className="space-y-2">
                    <Label htmlFor="propertyImages">
                      Add Additional Property Images (Max total size: 4MB)
                    </Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select multiple images to add to your property
                    </p>
                    <Input
                      id="propertyImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setNewImageFiles(files);
                      }}
                    />
                    {newImageFiles && newImageFiles.length > 0 && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p>Selected images:</p>
                        <ul className="list-disc list-inside">
                          {newImageFiles.map((file: File, index: number) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              />

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Updating property..." : "Update Property"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
