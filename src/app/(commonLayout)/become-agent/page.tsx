import { RegisterForm } from "@/components/modules/authentication/RegisterForm";

export default function page() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <h3 className="mb-6 text-2xl font-semibold text-center text-red-600">
          Become a Agent
        </h3>
        <RegisterForm />
      </div>
    </div>
  );
}
