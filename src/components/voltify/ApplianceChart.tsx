"use client"

import { useMemo } from "react";
import { Pie, PieChart, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { Appliance } from "@/lib/data";

interface ApplianceChartProps {
  appliances: Appliance[];
}

export default function ApplianceChart({ appliances }: ApplianceChartProps) {
  const totalConsumption = useMemo(() => {
    return appliances.reduce((acc, app) => acc + app.powerConsumption, 0);
  }, [appliances]);

  const chartData = useMemo(() => {
    if (totalConsumption === 0) return [];
    return appliances.map(appliance => ({
      name: appliance.name,
      value: Math.round((appliance.powerConsumption / totalConsumption) * 100),
      fill: appliance.color,
    }));
  }, [appliances, totalConsumption]);

  const applianceChartConfig = useMemo(() => {
    const config: ChartConfig = {
      value: {
        label: "Consumption",
      },
    };
    appliances.forEach(appliance => {
      config[appliance.name] = {
        label: appliance.name,
        color: appliance.color,
      };
    });
    return config;
  }, [appliances]);

  return (
    <Card className="glass-card flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Appliance Breakdown</CardTitle>
        <CardDescription>Consumption percentage by appliance</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
      {chartData.length > 0 ? (
        <ChartContainer config={applianceChartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel formatter={(value, name) => `${value}%`} />} />
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={2} />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      ) : (
        <div className="flex items-center justify-center h-[250px] text-muted-foreground">
          <p>No appliances added yet.</p>
        </div>
      )}
      </CardContent>
    </Card>
  );
}
