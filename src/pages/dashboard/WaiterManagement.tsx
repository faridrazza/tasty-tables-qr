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
import { WaiterProfile, WaiterProfileRow } from "@/integrations/supabase/types/tables/waiter";

interface WaiterFormData {
  name: string;
  email: string;
  password: string;
}

const WaiterManagement = () => {
  const [formData, setFormData] = useState<WaiterFormData>({
    name: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: waiters, isLoading } = useQuery({
    queryKey: ["waiters"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("waiter_profiles")
        .select("*")
        .eq("restaurant_id", user?.id);

      if (error) throw error;
      return data as WaiterProfileRow[];
    },
  });

  const createWaiter = useMutation({
    mutationFn: async (data: WaiterFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // First check if the user exists
      const { data: existingUsers } = await supabase
        .from("waiter_profiles")
        .select("email")
        .eq("email", data.email)
        .single();

      if (existingUsers) {
        throw new Error("A waiter with this email already exists");
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: "waiter",
            name: data.name,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          throw new Error("This email is already registered. Please use a different email address.");
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // Create waiter profile
      const { error: profileError } = await supabase
        .from("waiter_profiles")
        .insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          restaurant_id: user?.id,
        } as WaiterProfile["Insert"]);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiters"] });
      toast({ 
        title: "Success",
        description: "Waiter account created successfully"
      });
      setFormData({ name: "", email: "", password: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
        title: "Success",
        description: "Waiter account deleted successfully" 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWaiter.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Waiter</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={createWaiter.isPending}>
            {createWaiter.isPending ? "Creating..." : "Create Waiter Account"}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waiters?.map((waiter) => (
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
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WaiterManagement;