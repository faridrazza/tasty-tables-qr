import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { IndianRupee } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface GSTSettingsForm {
  restaurant_name: string;
  address: string;
  gst_rate: string;
  gst_number: string;
}

const GSTSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [customRate, setCustomRate] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch } = useForm<GSTSettingsForm>();

  const fetchGSTSettings = async () => {
    try {
      const { data: settings, error } = await supabase
        .from("gst_settings")
        .select("*")
        .single();

      if (error) throw error;

      if (settings) {
        setValue("restaurant_name", settings.restaurant_name);
        setValue("address", settings.address);
        setValue("gst_rate", settings.gst_rate.toString());
        setValue("gst_number", settings.gst_number);
        
        // Check if it's a custom rate
        if (![5, 18].includes(Number(settings.gst_rate))) {
          setCustomRate(true);
        }
      }
    } catch (error: any) {
      console.error("Error fetching GST settings:", error);
    }
  };

  useEffect(() => {
    fetchGSTSettings();
  }, []);

  const onSubmit = async (data: GSTSettingsForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("gst_settings").upsert({
        restaurant_id: (await supabase.auth.getUser()).data.user?.id,
        restaurant_name: data.restaurant_name,
        address: data.address,
        gst_rate: Number(data.gst_rate),
        gst_number: data.gst_number,
      });

      if (error) throw error;

      toast({
        title: "GST Settings saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving GST settings:", error);
      toast({
        title: "Error saving GST settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateChange = (value: string) => {
    if (value === "custom") {
      setCustomRate(true);
      setValue("gst_rate", "");
    } else {
      setCustomRate(false);
      setValue("gst_rate", value);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <IndianRupee className="w-6 h-6" />
        <h1 className="text-2xl font-bold">GST Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="restaurant_name">Restaurant Name</Label>
          <Input
            id="restaurant_name"
            {...register("restaurant_name", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            {...register("address", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gst_rate">GST Rate</Label>
          {!customRate ? (
            <Select onValueChange={handleRateChange} value={watch("gst_rate")}>
              <SelectTrigger>
                <SelectValue placeholder="Select GST rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="custom">Custom Rate</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                {...register("gst_rate", { required: true })}
                placeholder="Enter custom rate"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCustomRate(false);
                  setValue("gst_rate", "5");
                }}
              >
                Use Preset
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gst_number">GST Registration Number</Label>
          <Input
            id="gst_number"
            {...register("gst_number", { required: true })}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
};

export default GSTSettings;