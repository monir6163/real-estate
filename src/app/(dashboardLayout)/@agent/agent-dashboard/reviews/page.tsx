import { getAgentReviews } from "@/actions/review";
import MyReviews from "@/components/MyReviews";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);

export default async function AgentReviewsPage() {
  const { data: reviews } = await getAgentReviews();
  const safeReviews = reviews || [];

  const totalReviews = safeReviews.length;
  const averageRating =
    totalReviews > 0
      ? safeReviews.reduce(
          (sum: number, review: any) => sum + review.rating,
          0,
        ) / totalReviews
      : 0;
  const recentReviews = safeReviews.filter((review: any) => {
    const reviewDate = new Date(review.createdAt).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return reviewDate >= sevenDaysAgo;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Agent Reviews
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Track feedback across all of your listed properties.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Reviews
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {formatNumber(totalReviews)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Average Rating
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {averageRating > 0 ? `${formatNumber(averageRating)} / 5` : "N/A"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last 7 Days
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {formatNumber(recentReviews)}
          </p>
        </div>
      </div>

      <MyReviews reviews={safeReviews} />
    </div>
  );
}
