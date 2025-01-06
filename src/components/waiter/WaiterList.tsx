import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";

type WaiterProfile = Tables<"waiter_profiles">;

interface WaiterListProps {
  waiters: WaiterProfile[] | undefined;
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const WaiterList = ({ waiters, isLoading, onDelete, isDeleting }: WaiterListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!waiters?.length) {
    return <p className="text-center text-gray-500 py-4">No waiters found</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {waiters.map((waiter) => (
          <TableRow key={waiter.id}>
            <TableCell>{waiter.name}</TableCell>
            <TableCell>{waiter.email}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(waiter.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};