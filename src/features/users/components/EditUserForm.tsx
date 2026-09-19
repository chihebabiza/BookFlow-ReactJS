import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/features/users/api/users.api";
import {
  getUserRoleValue,
  userRoles,
  type User,
  type UserRoleValue,
} from "@/features/users/types/user.types";

type Props = { user: User; onSuccess: () => void };
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleValue;
  isActive: boolean;
};
type Errors = Partial<Record<keyof FormData, string>>;

export function EditUserForm({ user, onSuccess }: Props) {
  const initialData: FormData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: getUserRoleValue(user.role),
    isActive: user.isActive,
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
      await updateUser(user.id, {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      });
      toast.success("User updated successfully");
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div>
          <h2 className="text-xl font-semibold">Edit User</h2>
          <p className="text-sm text-muted-foreground">
            Update the user information.
          </p>
        </div>
        <FormField label="First Name" required error={errors.firstName}>
          <Input
            id="user-first-name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </FormField>
        <FormField label="Last Name" required error={errors.lastName}>
          <Input
            id="user-last-name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </FormField>
        <FormField label="Email" required error={errors.email}>
          <Input
            id="user-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </FormField>
        <FormField label="Role" required error={errors.role}>
          <Select
            value={String(formData.role)}
            onValueChange={(value) =>
              handleChange("role", Number(value) as UserRoleValue)
            }
          >
            <SelectTrigger id="user-role" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {userRoles.map((role) => (
                <SelectItem key={role.value} value={String(role.value)}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Active">
          <Switch
            id="user-active"
            checked={formData.isActive}
            onCheckedChange={(value) => handleChange("isActive", value)}
            aria-label="User is active"
          />
        </FormField>
      </div>
      <FormSubmitButton
        isPending={isSubmitting}
        disabled={!isDirty}
        pendingText="Updating..."
      >
        Update User
      </FormSubmitButton>
    </form>
  );
}
