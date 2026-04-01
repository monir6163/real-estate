"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { defaultValues, RegisterFormSchema } from "@/schema/registerSchema";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = React.useState(false);
  const pathname = "/become-agent";
  const path = usePathname();
  const router = useRouter();

  if (path === pathname) {
    defaultValues.role = "AGENT";
  } else {
    defaultValues.role = "USER";
  }

  const form = useForm({
    defaultValues: defaultValues,
    validators: { onSubmit: RegisterFormSchema },
    onSubmit: async ({ value }: { value: typeof defaultValues }) => {
      const toastId = toast.loading("Creating your account...");
      try {
        const { error } = await authClient.signUp.email(value);
        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }
        toast.success("Account created! Please check your email.", {
          id: toastId,
        });
        router.push(`/verify-request?email=${encodeURIComponent(value.email)}`);
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.", {
          id: toastId,
        });
      }
    },
  });

  const handleGoogleLogin = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL!,
    });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        placeholder="Enter full name"
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        type="email"
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        placeholder="Enter email address"
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          placeholder="Enter password"
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <Button type="submit" className="w-full">
                {path === pathname
                  ? "Create a Agent Account"
                  : "Create your account"}
              </Button>
              {path !== pathname && (
                <FieldDescription className="text-center text-red-600">
                  Become a Agent{" "}
                  <Link
                    href="/become-agent"
                    className="text-primary hover:underline"
                  >
                    Click here
                  </Link>
                </FieldDescription>
              )}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card"></FieldSeparator>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="mr-2" />
                Continue with Google
              </Button>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log In
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              width={800}
              height={400}
              src="/hero-city.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
