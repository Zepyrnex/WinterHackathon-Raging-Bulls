
"use client"

import { useState, useEffect, useMemo } from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, PowerOff } from 'lucide-react';
import { initialPowerData, weeklyPowerData, monthlyPowerData, consumptionChartConfig } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PEAK_THRESHOLD = 3.0;

interface ConsumptionChartProps {
  isAutoCutoffEnabled: boolean;
}

export default function ConsumptionChart({ isAutoCutoffEnabled }: ConsumptionChartProps) {
  const [data, setData] = useState(initialPowerData);
  const [activeTab, setActiveTab] = useState("daily");
  const { toast } = useToast();
  const [peakAlert, setPeakAlert] = useState<number | null>(null);
  const [autoCutoffActive, setAutoCutoffActive] = useState(false);

  useEffect(() => {
    if (activeTab !== "daily") return;

    const interval = setInterval(() => {
      setData((prevData) => {
        const lastPoint = prevData[prevData.length - 1];
        const newTime = new Date();
        const hours = String(newTime.getHours()).padStart(2, '0');
        const minutes = String(newTime.getMinutes()).padStart(2, '0');
        const randomFluctuation = (Math.random() - 0.45) * 0.5;
        let newKwh = Math.max(0.5, lastPoint.kwh + randomFluctuation);

        if (newKwh > PEAK_THRESHOLD) {
            if (isAutoCutoffEnabled) {
                newKwh = PEAK_THRESHOLD - (Math.random() * 0.5); // Simulate turning off appliance
                if (!autoCutoffActive) {
                    setAutoCutoffActive(true);
                    toast({
                        title: "Auto-Cutoff Activated",
                        description: `Usage exceeded ${PEAK_THRESHOLD} kWh. High-draw appliance turned off.`,
                    });
                }
            } else {
                 if (peakAlert === null || newKwh > peakAlert) {
                    setPeakAlert(newKwh);
                    toast({
                        variant: "destructive",
                        title: "Peak Usage Alert!",
                        description: `Consumption has reached ${newKwh.toFixed(2)} kWh. Consider turning off non-essential appliances.`,
                    });
                }
            }
        } else {
            if (peakAlert !== null) setPeakAlert(null);
            if (autoCutoffActive) setAutoCutoffActive(false);
        }

        const newData = [...prevData.slice(1), { time: `${hours}:${minutes}`, kwh: newKwh }];
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [activeTab, toast, peakAlert, autoCutoffActive, isAutoCutoffEnabled]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case "daily":
        setData(initialPowerData);
        break;
      case "weekly":
        setData(weeklyPowerData.map(d => ({time: d.day, kwh: d.kwh})));
        break;
      case "monthly":
        setData(monthlyPowerData.map(d => ({time: d.week, kwh: d.kwh})));
        break;
    }
  };

  const chartData = useMemo(() => data, [data]);

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1 px-6 py-5">
            <CardTitle className="font-headline">Power Consumption</CardTitle>
            <CardDescription>View your real-time and historical energy usage.</CardDescription>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full sm:w-auto">
            <TabsList className="h-full w-full rounded-none border-l bg-transparent p-0 sm:w-auto sm:rounded-bl-none sm:rounded-tr-md">
                <TabsTrigger value="daily" className="flex-1 rounded-none data-[state=active]:bg-accent/50 data-[state=active]:shadow-none sm:flex-initial">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="flex-1 rounded-none data-[state=active]:bg-accent/50 data-[state=active]:shadow-none sm:flex-initial">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="flex-1 rounded-none data-[state=active]:bg-accent/50 data-[state=active]:shadow-none sm:flex-initial">Monthly</TabsTrigger>
            </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        {peakAlert && !autoCutoffActive && (
          <Alert variant="destructive" className="mb-4 animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Peak Usage Warning</AlertTitle>
            <AlertDescription>
              Current consumption is high at {peakAlert.toFixed(2)} kWh. Try reducing load.
            </AlertDescription>
          </Alert>
        )}
        {autoCutoffActive && (
           <Alert className="mb-4 border-primary/50 text-primary">
             <PowerOff className="h-4 w-4" />
             <AlertTitle>Auto-Cutoff Active</AlertTitle>
             <AlertDescription>
               High-usage appliance automatically turned off to reduce consumption.
             </AlertDescription>
           </Alert>
        )}
        <ChartContainer config={consumptionChartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart data={chartData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} unit=" kWh" />
            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent indicator="dot" />} />
            <Line dataKey="kwh" type="monotone" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
