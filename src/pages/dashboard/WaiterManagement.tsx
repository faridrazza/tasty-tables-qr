import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type WaiterProfile = Tables<"waiter_profiles">;

const WaiterManagement = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: waiters, isLoading: isLoadingWaiters } = useQuery({
    queryKey: ["waiters"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("waiter_profiles")
        .select("*")
        .eq("restaurant_id", user?.id);

      if (error) throw error;
      return data as WaiterProfile[];
    },
  });

  const createWaiter = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create auth account for waiter
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "waiter",
            restaurant_id: user?.id,
          },
        },
      });

      if (authError) throw authError;

      // Create waiter profile
      const { error: profileError } = await supabase
        .from("waiter_profiles")
        .insert({
          id: authData.user?.id,
          name,
          email,
          restaurant_id: user?.id,
        });

      if (profileError) throw profileError;

      toast({
        title: "Waiter account created successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["waiters"] });
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Error creating waiter:", error);
      toast({
        title: "Failed to create waiter account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWaiter = useMutation({
    mutationFn: async (waiterId: string) => {
      const { error } = await supabase
        .from("waiter_profiles")
        .delete()
        .eq("id", waiterId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiters"] });
      toast({
        title: "Waiter deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete waiter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Add New Waiter</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter waiter's name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter waiter's email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <Button onClick={createWaiter} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Waiter Account"
            )}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Waiter List</h2>
        {isLoadingWaiters ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !waiters?.length ? (
          <p className="text-center text-gray-500 py-4">No waiters found</p>
        ) : (
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
                      onClick={() => deleteWaiter.mutate(waiter.id)}
                      disabled={deleteWaiter.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default WaiterManagement;