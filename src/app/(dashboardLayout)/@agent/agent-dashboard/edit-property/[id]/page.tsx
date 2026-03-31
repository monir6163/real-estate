import { getPropertyById } from "@/actions/properties";
import EditPropertyForm from "@/components/EditPropertyForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: property } = await getPropertyById(id);

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Property Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            The property you're looking for doesn't exist or you don't have
            access to it.
          </p>
        </div>
      </div>
    );
  }

  return <EditPropertyForm property={property} />;
}
