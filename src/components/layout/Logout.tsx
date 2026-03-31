"use client";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function Logout() {
  const { push, refresh } = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          push("/");
          refresh();
          toast.success("Logged out successfully!");
        },
      },
    });
  };
  return (
    <Button
      variant="destructive"
      className="cursor-pointer w-full justify-start"
      onClick={handleLogout}
    >
      <LogOutIcon className="h-4 w-4" />
      Log out
    </Button>
  );
}
