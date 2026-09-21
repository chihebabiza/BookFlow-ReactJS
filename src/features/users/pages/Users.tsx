import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { FormSheet } from "@/components/common/FormSheet";
import { DataTable } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { columns } from "@/features/users/components/columns";
import { getUsers } from "@/features/users/api/users.api";
import type { User } from "@/features/users/types/user.types";
import { CreateUserForm } from "../components/CreateUserForm";

export function Users() {
  const [addOpen, setAddOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setUsers(await getUsers());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load users.",
      );
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getUsers()
      .then((data) => {
        if (isMounted) setUsers(data);
      })
      .catch((error) => {
        if (isMounted) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load users.",
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

  if (isLoading) return <div>Loading users...</div>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and access.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>Add User</Button>
      </div>
      <FormSheet open={addOpen} onOpenChange={setAddOpen}>
        <CreateUserForm
          onSuccess={() => {
            setAddOpen(false);
            fetchUsers();
          }}
        />
      </FormSheet>
      <DataTable columns={columns(fetchUsers)} data={users} />
    </div>
  );
}
