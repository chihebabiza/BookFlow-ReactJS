import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/common/FormField";
import { FormSubmitButton } from "@/components/common/FormSubmitButton";
import { Input } from "@/components/ui/input";
import { createAuthor } from "@/features/authors/api/authors.api";
import { countriesApi } from "@/features/countries/api/countries.api";
import type { Country } from "@/features/countries/types/country.types";
import type { AuthorCreate } from "@/features/authors/types/author.types";

type CreateAuthorFormProps = { onSuccess: () => void };

export function CreateAuthorForm({ onSuccess }: CreateAuthorFormProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryId, setCountryId] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    countriesApi
      .getAll()
      .then(setCountries)
      .catch(() => toast.error("Failed to load countries."))
      .finally(() => setIsLoadingCountries(false));
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!firstName.trim()) nextErrors.firstName = "First name is required";
    if (!lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!countryId) nextErrors.countryId = "Please select a country";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setIsSubmitting(true);
      const author: AuthorCreate = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        countryId,
      };
      await createAuthor(author);
      toast.success("Author added successfully");
      setFirstName("");
      setLastName("");
      setCountryId(0);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add author",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <FormField label="First Name" required error={errors.firstName}>
          <Input
            id="author-first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormField>
        <FormField label="Last Name" required error={errors.lastName}>
          <Input
            id="author-last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormField>
        <FormField label="Country" required error={errors.countryId}>
          <select
            id="author-country-id"
            value={countryId}
            onChange={(e) => setCountryId(Number(e.target.value))}
            disabled={isLoadingCountries}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value={0}>
              {isLoadingCountries ? "Loading countries..." : "Select a country"}
            </option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <FormSubmitButton isPending={isSubmitting} pendingText="Adding...">
        Add Author
      </FormSubmitButton>
    </form>
  );
}
