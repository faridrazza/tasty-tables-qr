import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import type { WaiterProfile, WaiterFormData } from "@/types/waiter";

const WaiterManagement = () => {
  const [formData, setFormData] = useState<WaiterFormData>({
    name: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch waiters
  const { data: waiters, isLoading } = useQuery({
    queryKey: ["waiters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waiter_profiles")
        .select("*");
      if (error) throw error;
      return data as WaiterProfile[];
    },
  });

  // Create waiter
  const createWaiter = useMutation({
    mutationFn: async (data: WaiterFormData) => {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: "waiter",
          },
        },
      });
      if (authError) throw authError;

      // Then create waiter profile
      const { error: profileError } = await supabase
        .from("waiter_profiles")
        .insert({
          id: authData.user!.id,
          name: data.name,
          email: data.email,
          restaurant_id: (await supabase.auth.getUser()).data.user!.id,
        });
      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiters"] });
      toast({ title: "Waiter created successfully" });
      setFormData({ name: "", email: "", password: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create waiter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete waiter
  const deleteWaiter = useMutation({
    mutationFn: async (waiterId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(waiterId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiters"] });
      toast({ title: "Waiter deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete waiter",
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
      <div>
        <h2 className="text-2xl font-bold mb-4">Add New Waiter</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={createWaiter.isPending}>
            {createWaiter.isPending ? "Creating..." : "Create Waiter"}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Waiter List</h2>
        <div className="grid gap-4">
          {waiters?.map((waiter) => (
            <div
              key={waiter.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div>
                <h3 className="font-medium">{waiter.name}</h3>
                <p className="text-sm text-gray-600">{waiter.email}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteWaiter.mutate(waiter.id)}
                disabled={deleteWaiter.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaiterManagement;