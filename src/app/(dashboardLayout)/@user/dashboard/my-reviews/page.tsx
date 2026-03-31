import { getUserReviews } from "@/actions/review";
import MyReviews from "@/components/MyReviews";

export default async function MyReviewsPage() {
  const { data: reviews } = await getUserReviews();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Reviews
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          View all reviews you have submitted
        </p>
      </div>

      <MyReviews reviews={reviews || []} />
    </div>
  );
}
