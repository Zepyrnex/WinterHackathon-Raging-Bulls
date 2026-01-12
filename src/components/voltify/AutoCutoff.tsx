
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { PowerOff } from "lucide-react";

interface AutoCutoffProps {
  isAutoCutoffEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function AutoCutoff({ isAutoCutoffEnabled, onToggle }: AutoCutoffProps) {
  const { toast } = useToast();

  const handleToggle = (checked: boolean) => {
    onToggle(checked);
    toast({
      title: `Auto-cutoff ${checked ? "Enabled" : "Disabled"}`,
      description: checked
        ? "High-usage appliances will be turned off during peak consumption."
        : "Manual control resumed.",
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="font-headline">Auto Cutoff</CardTitle>
        <CardDescription>
          Automatically manage high-usage appliances during peak hours to save energy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <PowerOff className="h-6 w-6" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Enable Automatic Cutoff
            </p>
            <p className="text-sm text-muted-foreground">
              When enabled, we'll help you reduce consumption automatically.
            </p>
          </div>
          <Switch
            id="auto-cutoff-switch"
            checked={isAutoCutoffEnabled}
            onCheckedChange={handleToggle}
            aria-label="Toggle automatic cutoff"
          />
        </div>
      </CardContent>
    </Card>
  );
}
