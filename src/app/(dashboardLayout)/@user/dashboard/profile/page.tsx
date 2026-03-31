import { userService } from "@/services/user.service";
import { User } from "@/types";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const { data: user, status } = await userService.getCurrentUser();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information and preferences
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <ProfileCard user={user as User} />
        </div>

        {/* Profile Form - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <ProfileForm user={user as User} />
        </div>
      </div>
    </div>
  );
}
