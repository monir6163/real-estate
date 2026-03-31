import { ownerGetProperties } from "@/actions/properties";
import MyPropertiesGrid from "@/components/MyPropertiesGrid";

export default async function MyPropertiesPage() {
  const { data } = await ownerGetProperties();

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

      <MyPropertiesGrid properties={data || []} />
    </div>
  );
}
