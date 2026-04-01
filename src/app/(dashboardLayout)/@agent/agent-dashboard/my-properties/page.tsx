import { ownerGetProperties } from "@/actions/properties";
import MyPropertiesGrid from "@/components/MyPropertiesGrid";

export default async function MyPropertiesPage() {
  let data: any[] = [];
  let error: string | null = null;

  try {
    const response = await ownerGetProperties();
    data = response.data || [];
  } catch (err) {
    error = "Failed to load properties. Please try again later.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Properties
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage and view all your property listings
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <MyPropertiesGrid properties={data} />
    </div>
  );
}
