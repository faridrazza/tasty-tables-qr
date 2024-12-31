import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useRequireAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication Error",
          description: "Please log in to access your menu",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access your menu",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);
}