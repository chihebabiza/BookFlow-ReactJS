import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { FormSheet } from "@/components/common/FormSheet";
import { DataTable } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { getMembers } from "@/features/members/api/member.api";
import type { Member } from "@/features/members/types/member.types";
import { columns } from "../components/columns";
import { CreateMemberForm } from "../components/CreateMemberForm";

export function Members() {
  const [addOpen, setAddOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    try {
      setMembers(await getMembers());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load members.",
      );
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getMembers()
      .then((data) => {
        if (isMounted) setMembers(data);
      })
      .catch((error) => {
        if (isMounted) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load members.",
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
    return <div>Loading members...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>

          <p className="text-muted-foreground">
            Manage and organize your library members.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>Add Member</Button>
      </div>

      <FormSheet open={addOpen} onOpenChange={setAddOpen}>
        <CreateMemberForm
          onSuccess={() => {
            setAddOpen(false);
            fetchMembers();
          }}
        />
      </FormSheet>

      <DataTable columns={columns(fetchMembers)} data={members} />
    </div>
  );
}
