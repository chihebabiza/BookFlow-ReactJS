import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { createMember } from "@/features/members/api/member.api";

type Props = { onSuccess: () => void };
type FormData = { firstName: string; lastName: string; phone: string };
type Errors = Partial<Record<keyof FormData, string>>;
const initialData: FormData = { firstName: "", lastName: "", phone: "" };

export function CreateMemberForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Errors = {};
    if (!formData.firstName.trim())
      nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      nextErrors.lastName = "Last name is required.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setIsSubmitting(true);
      await createMember({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
      });
      toast.success("Member added successfully");
      setFormData(initialData);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add member.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <FormField label="First Name" required error={errors.firstName}>
          <Input
            id="member-first-name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </FormField>
        <FormField label="Last Name" required error={errors.lastName}>
          <Input
            id="member-last-name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </FormField>
        <FormField label="Phone" required error={errors.phone}>
          <Input
            id="member-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </FormField>
      </div>
      <FormSubmitButton isPending={isSubmitting} pendingText="Adding...">
        Add Member
      </FormSubmitButton>
    </form>
  );
}
