import { ownerGetProperties } from "@/actions/properties";

export default async function page() {
  const { data } = await ownerGetProperties();
  console.log(data);
  return <div>page</div>;
}
