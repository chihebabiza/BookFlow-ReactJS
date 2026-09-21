import { DataTable } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/common/FormSheet";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthors } from "@/features/authors/api/authors.api";
import type { Author } from "@/features/authors/types/author.types";
import { columns } from "../components/columns";
import { CreateAuthorForm } from "../components/CreateAuthorForm";

export function Authors() {
  const [addOpen, setAddOpen] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuthors = useCallback(async () => {
    try {
      setAuthors(await getAuthors());
    } catch (error) {
      console.error("Failed to load authors:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load authors.",
      );
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getAuthors()
      .then((data) => {
        if (isMounted) setAuthors(data);
      })
      .catch((error) => {
        console.error("Failed to load authors:", error);
        if (isMounted) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load authors.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <div>Loading authors...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Authors</h1>

          <p className="text-muted-foreground">
            Manage and organize your library authors.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>Add Author</Button>
      </div>

      <FormSheet open={addOpen} onOpenChange={setAddOpen}>
        <CreateAuthorForm
          onSuccess={() => {
            setAddOpen(false);
            fetchAuthors();
          }}
        />
      </FormSheet>

      <DataTable columns={columns(fetchAuthors)} data={authors} />
    </div>
  );
}
