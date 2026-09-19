import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { updateMember } from "@/features/members/api/member.api";
import type { Member } from "@/features/members/types/member.types";

type Props = { member: Member; onSuccess: () => void };
type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
};
type Errors = Partial<Record<keyof FormData, string>>;

export function EditMemberForm({ member, onSuccess }: Props) {
  const initialData: FormData = {
    firstName: member.firstName,
    lastName: member.lastName,
    phone: member.phone,
    isActive: member.isActive,
  };
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);
  const handleChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
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
      await updateMember(member.id, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        isActive: formData.isActive,
      });
      toast.success("Member updated successfully");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update member.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div>
          <h2 className="text-xl font-semibold">Edit Member</h2>
          <p className="text-sm text-muted-foreground">
            Update the member information.
          </p>
        </div>
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
        <FormField label="Active">
          <Switch
            id="member-active"
            checked={formData.isActive}
            onCheckedChange={(value) => handleChange("isActive", value)}
            aria-label="Member is active"
          />
        </FormField>
      </div>
      <FormSubmitButton
        isPending={isSubmitting}
        disabled={!isDirty}
        pendingText="Updating..."
      >
        Update Member
      </FormSubmitButton>
    </form>
  );
}
