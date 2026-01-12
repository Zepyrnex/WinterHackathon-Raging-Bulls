
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Trash2, PlusCircle, Pipette } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Appliance } from "@/lib/data";

const applianceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  powerConsumption: z.coerce.number().positive("Must be a positive number."),
  powerLimit: z.coerce.number().positive("Must be a positive number."),
  color: z.string().regex(/^hsl\(\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%\)$/, { message: "Invalid HSL color format. Expected format: hsl(H S% L%)" }),
});

type ApplianceFormValues = z.infer<typeof applianceSchema>;

const namedColorPalette = [
    { name: 'Light Gray', value: 'hsl(210 40% 96.1%)' },
    { name: 'Mint Green', value: 'hsl(142.1 76.2% 86.3%)' },
    { name: 'Sunny Yellow', value: 'hsl(47.9 95.8% 53.1%)' },
    { name: 'Fiery Red', value: 'hsl(346.8 77.2% 49.8%)' },
    { name: 'Royal Purple', value: 'hsl(262.1 83.3% 57.8%)' },
    { name: 'Sky Blue', value: 'hsl(221.2 83.2% 53.3%)' },
    { name: 'Tangerine', value: 'hsl(22 96% 54%)' },
    { name: 'Emerald', value: 'hsl(160 84% 39%)' },
    { name: 'Magenta', value: 'hsl(320 76% 59%)' },
    { name: 'Gold', value: 'hsl(52 98% 50%)' },
    { name: 'Teal', value: 'hsl(180 82% 38%)' },
    { name: 'Orchid', value: 'hsl(291 64% 42%)' }
];

interface ApplianceManagerProps {
  appliances: Appliance[];
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
}

export default function ApplianceManager({ appliances, setAppliances }: ApplianceManagerProps) {
  const [customColor, setCustomColor] = useState("#ffffff");

  const form = useForm<ApplianceFormValues>({
    resolver: zodResolver(applianceSchema),
    defaultValues: {
      name: "",
      powerConsumption: 0,
      powerLimit: 0,
      color: namedColorPalette[0].value,
    },
  });
  
  function hexToHsl(hex: string): string {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `hsl(${h} ${s}% ${l}%)`;
  }

  function onSubmit(data: ApplianceFormValues) {
    setAppliances([...appliances, data]);
    form.reset();
  }

  function deleteAppliance(index: number) {
    setAppliances(appliances.filter((_, i) => i !== index));
  }
  
  const getColorName = (hslValue: string) => {
    const namedColor = namedColorPalette.find(c => c.value === hslValue);
    return namedColor ? namedColor.name : 'Custom';
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 mt-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-headline">Add New Appliance</CardTitle>
          <CardDescription>
            Fill out the details to add a new appliance to your list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appliance Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Living Room AC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="powerConsumption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Power (Watts)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} placeholder="e.g., 1500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="powerLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Power Limit (W)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} placeholder="e.g., 2000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <div className="flex items-center gap-2">
                               <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: field.value }} />
                               {getColorName(field.value)}
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <div className="grid grid-cols-6 gap-2 mb-2">
                            {namedColorPalette.map((color) => (
                              <Button
                                key={color.value}
                                variant="outline"
                                size="icon"
                                className="w-8 h-8"
                                title={color.name}
                                onClick={(e) => {
                                  e.preventDefault();
                                  form.setValue("color", color.value)
                                }}
                              >
                                <div
                                  className="w-6 h-6 rounded-full border"
                                  style={{ backgroundColor: color.value }}
                                />
                              </Button>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <Pipette className="h-4 w-4" />
                            <label htmlFor="custom-color" className="text-sm font-medium">Custom Color</label>
                          </div>
                           <div className="flex items-center gap-2 mt-2">
                            <Input 
                                type="color" 
                                id="custom-color"
                                value={customColor}
                                onChange={(e) => setCustomColor(e.target.value)}
                                className="w-10 h-10 p-1"
                            />
                            <Button 
                                variant="outline" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    form.setValue("color", hexToHsl(customColor));
                                }}
                            >
                                Set
                            </Button>
                           </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Appliance
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-headline">Your Appliances</CardTitle>
          <CardDescription>
            A list of your tracked home appliances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {appliances.map((appliance, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: appliance.color }}
                  />
                  <div>
                    <p className="font-semibold">{appliance.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {appliance.powerConsumption}W / {appliance.powerLimit}W
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteAppliance(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
             {appliances.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No appliances added yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
