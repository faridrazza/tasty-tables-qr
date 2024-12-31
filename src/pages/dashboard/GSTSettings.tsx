import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const formSchema = z.object({
  restaurant_name: z.string().min(1, "Restaurant name is required"),
  address: z.string().min(1, "Address is required"),
  gst_rate: z.string().min(1, "GST rate is required"),
  gst_number: z.string().min(1, "GST number is required"),
});

const GSTSettings = () => {
  useRequireAuth(); // Ensure user is authenticated
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: gstSettings, isLoading } = useQuery({
    queryKey: ["gst-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gst_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurant_name: "",
      address: "",
      gst_rate: "",
      gst_number: "",
    },
    values: gstSettings
      ? {
          restaurant_name: gstSettings.restaurant_name,
          address: gstSettings.address,
          gst_rate: gstSettings.gst_rate.toString(),
          gst_number: gstSettings.gst_number,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found");

      const formattedValues = {
        restaurant_id: user.id,
        restaurant_name: values.restaurant_name,
        address: values.address,
        gst_rate: parseFloat(values.gst_rate),
        gst_number: values.gst_number,
      };

      const { data: existingSettings } = await supabase
        .from("gst_settings")
        .select("id")
        .single();

      if (existingSettings) {
        const { error } = await supabase
          .from("gst_settings")
          .update(formattedValues)
          .eq("id", existingSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("gst_settings")
          .insert([formattedValues]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gst-settings"] });
      toast({
        title: "Settings saved successfully",
      });
    },
    onError: (error) => {
      console.error("Error saving GST settings:", error);
      toast({
        title: "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">GST Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="restaurant_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gst_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Rate (%)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gst_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={mutation.isPending}>
            Save Settings
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GSTSettings;