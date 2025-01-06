import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type WaiterProfile = Tables<"waiter_profiles">;

export const useWaiterManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: waiters, isLoading: isLoadingWaiters } = useQuery({
    queryKey: ["waiters"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("waiter_profiles")
        .select("*")
        .eq("restaurant_id", user.id);

      if (error) throw error;
      return data as WaiterProfile[];
    },
  });

  const createWaiter = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("No authenticated user");
      
      // Create auth account for waiter
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "waiter",
            restaurant_id: currentUser.id,
          },
        },
      });

      // Handle specific error cases
      if (authError) {
        if (authError.message === "User already registered") {
          throw new Error("A user with this email already exists. Please use a different email address.");
        }
        throw authError;
      }

      if (!authData.user?.id) throw new Error("Failed to create user account");

      // Create waiter profile
      const { error: profileError } = await supabase
        .from("waiter_profiles")
        .insert({
          id: authData.user.id,
          name,
          email,
          restaurant_id: currentUser.id,
        });

      if (profileError) throw profileError;

      toast({
        title: "Waiter account created successfully",
        description: "Please inform the waiter to check their email for verification.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["waiters"] });
      return true;
    } catch (error: any) {
      console.error("Error creating waiter:", error);
      toast({
        title: "Failed to create waiter account",
        description: error.message,
        variant: "destructive",
      });
      return false;
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

  return {
    waiters,
    isLoadingWaiters,
    isLoading,
    createWaiter,
    deleteWaiter,
  };
};