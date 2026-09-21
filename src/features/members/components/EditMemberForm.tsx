import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { updateUser } from "@/features/users/api/users.api";
import type { Member } from "@/features/members/types/member.types";
import {
  getUserRoleValue,
  type UserRoleValue,
  type UserUpdate,
} from "@/features/users/types/user.types";

type Props = { member: Member; onSuccess: () => void };
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  role: UserRoleValue;
};
type Errors = Partial<Record<keyof FormData, string>>;

export function EditMemberForm({ member, onSuccess }: Props) {
  const initialData: FormData = {
    firstName: member.user.firstName,
    lastName: member.user.lastName,
    email: member.user.email,
    isActive: member.user.isActive,
    role: getUserRoleValue(member.user.role),
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
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setIsSubmitting(true);
      const userData: UserUpdate = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        isActive: formData.isActive,
      };
      await updateUser(member.user.id, userData);
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
        <FormField label="Email" required error={errors.email}>
          <Input
            id="member-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
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
