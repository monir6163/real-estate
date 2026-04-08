"use client";
import { Badge } from "@/components/ui/badge";
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
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import * as z from "zod";

import { FaGoogle } from "react-icons/fa6";

const LoginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = React.useState(false);
  const lastMethod = authClient.getLastUsedLoginMethod();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: { onSubmit: LoginFormSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in...");
      try {
        const { error } = await authClient.signIn.email(value);
        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }
        toast.success("Logged in successfully!", {
          id: toastId,
        });
        router.push("/");
      } catch {
        toast.error("An unexpected error occurred. Please try again.", {
          id: toastId,
        });
      }
    },
  });

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL!,
    });
  };

  const demoCredentials = [
    {
      role: "Admin",
      email: "monirhossain6163@gmail.com",
      password: "123456789",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      role: "Agent",
      email: "ultrasrealpro@gmail.com",
      password: "12345678",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      role: "User",
      email: "monirdev1@gmail.com",
      password: "123456789",
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  const handleDemoLogin = (email: string, password: string) => {
    form.setFieldValue("email", email);
    form.setFieldValue("password", password);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Demo Login Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm font-semibold text-foreground mb-4">
          Demo Credentials
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {demoCredentials.map((demo) => (
            <button
              key={demo.role}
              onClick={() => handleDemoLogin(demo.email, demo.password)}
              className={cn(
                "px-4 py-3 rounded-lg text-white font-medium transition-all text-sm",
                demo.color,
              )}
            >
              <div className="font-semibold">{demo.role}</div>
              <div className="text-xs opacity-90 mt-1">{demo.email}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Login Card */}
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
                <span className="inline-flex items-center gap-2">
                  Log In
                  {lastMethod === "email" && (
                    <Badge variant="secondary">Last used</Badge>
                  )}
                </span>
              </Button>

              <FieldDescription className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </FieldDescription>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card"></FieldSeparator>
              <Button
                type="button"
                variant={lastMethod === "google" ? "default" : "outline"}
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <span className="inline-flex items-center gap-2">
                  <FaGoogle />
                  Continue with Google
                  {lastMethod === "google" && (
                    <Badge variant="secondary">Last used</Badge>
                  )}
                </span>
              </Button>
              <FieldDescription className="text-center">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
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
