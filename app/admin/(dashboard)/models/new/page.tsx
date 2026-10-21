import { ModelForm } from "@/components/admin/ModelForm";

export const instant = false;

export default function AdminNewModelPage() {
  return (
    <div>
      <h1 className="text-2xl font-light">New model</h1>
      <p className="mb-8 mt-1 text-sm text-black/50">
        Create a profile. The slug is generated from the name if left empty.
      </p>
      <ModelForm />
    </div>
  );
}
