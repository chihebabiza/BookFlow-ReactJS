import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { createUser } from "@/features/users/api/users.api";

type Props = { onSuccess: () => void };
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  confirmPassword: string;
};
type Errors = Partial<Record<keyof FormData, string>>;
const initialData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  passwordHash: "",
  confirmPassword: "",
};

export function CreateMemberForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    if (!formData.passwordHash.trim())
      nextErrors.passwordHash = "Password is required.";
    if (!formData.confirmPassword.trim())
      nextErrors.confirmPassword = "Please confirm the password.";
    else if (formData.passwordHash !== formData.confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setIsSubmitting(true);
      await createUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        passwordHash: formData.passwordHash.trim(),
        role: 0,
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
        <FormField label="Email" required error={errors.email}>
          <Input
            id="member-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </FormField>
        <FormField label="Password" required error={errors.passwordHash}>
          <div className="relative">
            <Input
              id="member-password"
              type={showPassword ? "text" : "password"}
              value={formData.passwordHash}
              onChange={(e) => handleChange("passwordHash", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>
        <FormField
          label="Confirm Password"
          required
          error={errors.confirmPassword}
        >
          <div className="relative">
            <Input
              id="member-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>
      </div>
      <FormSubmitButton isPending={isSubmitting} pendingText="Adding...">
        Add Member
      </FormSubmitButton>
    </form>
  );
}
