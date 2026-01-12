"use client"

import { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import { IndianRupee, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { initialPowerData } from "@/lib/data";

const KWH_RATE = 8; // ₹8/kWh

export default function Stats() {
  const [currentKwh, setCurrentKwh] = useState(0);

  useEffect(() => {
    // In a real app, you'd get this from a live data source.
    // Here we just cycle through some mock data.
    const lastDataPoint = initialPowerData[initialPowerData.length - 1];
    setCurrentKwh(lastDataPoint.kwh);

    const interval = setInterval(() => {
      const randomFluctuation = (Math.random() - 0.5) * 0.5; // Fluctuate by +/- 0.25
      setCurrentKwh(prev => Math.max(0, prev + randomFluctuation));
    }, 10000); // Same interval as consumption chart

    return () => clearInterval(interval);
  }, []);

  const dailyConsumption = initialPowerData.reduce((acc, curr) => acc + curr.kwh, 0);
  const dailyCost = dailyConsumption * KWH_RATE;
  const monthlyCost = dailyCost * 30; // Approximation

  return (
    <>
      <StatsCard
        title="Current Usage"
        value={`${currentKwh.toFixed(2)} kWh`}
        icon={<Zap className="h-5 w-5 text-muted-foreground" />}
        description="Real-time power consumption"
        tooltipText="The current amount of electricity your home is using right now."
      />
      <StatsCard
        title="Daily Cost"
        value={`₹${dailyCost.toFixed(2)}`}
        icon={<IndianRupee className="h-5 w-5 text-muted-foreground" />}
        description="Based on your daily usage"
        tooltipText={`Calculated based on a rate of ₹${KWH_RATE} per kWh for today's consumption.`}
      />
      <StatsCard
        title="Est. Monthly Cost"
        value={`₹${monthlyCost.toFixed(2)}`}
        icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
        description="Projected from daily average"
        tooltipText="An estimate of your total electricity bill for the current month based on your usage so far."
      />
      <StatsCard
        title="Peak Usage Today"
        value={`${Math.max(...initialPowerData.map(d => d.kwh)).toFixed(2)} kWh`}
        icon={<AlertCircle className="h-5 w-5 text-muted-foreground" />}
        description="Highest consumption point"
        tooltipText="The highest point of electricity consumption recorded in your home today."
      />
    </>
  );
}
