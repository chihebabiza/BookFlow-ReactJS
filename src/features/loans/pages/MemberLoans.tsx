import { ArrowLeft } from "lucide-react";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { FormSheet } from "@/components/common/FormSheet";
import { getMemberById } from "@/features/members/api/member.api";
import { getColumns } from "@/features/loans/components/columns";
import { ReturnLoanForm } from "@/features/loans/components/ReturnLoanForm";
import { getLoansByMemberId } from "@/features/loans/api/loans.api";
import type { Member } from "@/features/members/types/member.types";
import type { Loan } from "@/features/loans/types/loan.types";

export function MemberLoans() {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const parsedMemberId = Number(memberId);
  const [member, setMember] = useState<Member | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returnLoan, setReturnLoan] = React.useState<Loan | null>(null);

  const fetchLoans = useCallback(async () => {
    try {
      setLoans(await getLoansByMemberId(parsedMemberId));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to refresh member loans.",
      );
    }
  }, [parsedMemberId]);

  useEffect(() => {
    if (!Number.isInteger(parsedMemberId) || parsedMemberId <= 0) return;
    let isMounted = true;

    Promise.all([
      getMemberById(parsedMemberId),
      getLoansByMemberId(parsedMemberId),
    ])
      .then(([memberData, loanData]) => {
        if (!isMounted) return;
        setMember(memberData);
        setLoans(loanData);
      })
      .catch(
        (error) =>
          isMounted &&
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load member loans.",
          ),
      )
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [fetchLoans, parsedMemberId]);

  if (!Number.isInteger(parsedMemberId) || parsedMemberId <= 0) {
    return <p className="text-destructive">Invalid member.</p>;
  }

  if (isLoading) {
    return <div>Loading member loans...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          title="Back to members"
          onClick={() => navigate("/members")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Member Loans</h1>
          <p className="text-muted-foreground">
            {member && `${member.user.firstName} ${member.user.lastName}`}
          </p>
        </div>
      </div>

      <DataTable
        columns={getColumns(setReturnLoan)}
        data={loans}
        exportFileName={`loans`}
      />
      {returnLoan && (
        <FormSheet
          open={Boolean(returnLoan)}
          onOpenChange={(open) => !open && setReturnLoan(null)}
        >
          <ReturnLoanForm
            loan={returnLoan}
            onSuccess={() => {
              setReturnLoan(null);
              fetchLoans();
            }}
          />
        </FormSheet>
      )}
    </div>
  );
}
