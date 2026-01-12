import { ChartConfig } from "@/components/ui/chart"

export interface Appliance {
  name: string;
  powerConsumption: number;
  powerLimit: number;
  color: string;
}

export const initialAppliances: Appliance[] = [
  { name: "AC", powerConsumption: 1500, powerLimit: 2000, color: "hsl(221.2 83.2% 53.3%)" },
  { name: "Refrigerator", powerConsumption: 200, powerLimit: 300, color: "hsl(142.1 76.2% 86.3%)" },
  { name: "Washing Machine", powerConsumption: 500, powerLimit: 700, color: "hsl(47.9 95.8% 53.1%)" },
];


export const initialPowerData = [
  { time: "00:00", kwh: 1.2 },
  { time: "02:00", kwh: 1.5 },
  { time: "04:00", kwh: 1.4 },
  { time: "06:00", kwh: 1.8 },
  { time: "08:00", kwh: 2.2 },
  { time: "10:00", kwh: 2.5 },
  { time: "12:00", kwh: 2.3 },
  { time: "14:00", kwh: 2.8 },
  { time: "16:00", kwh: 3.1 },
  { time: "18:00", kwh: 3.5 },
  { time: "20:00", kwh: 3.2 },
  { time: "22:00", kwh: 2.1 },
];

export const weeklyPowerData = [
    { day: "Mon", kwh: 25 },
    { day: "Tue", kwh: 28 },
    { day: "Wed", kwh: 22 },
    { day: "Thu", kwh: 30 },
    { day: "Fri", kwh: 35 },
    { day: "Sat", kwh: 40 },
    { day: "Sun", kwh: 38 },
];

export const monthlyPowerData = [
    { week: "Week 1", kwh: 180 },
    { week: "Week 2", kwh: 200 },
    { week: "Week 3", kwh: 190 },
    { week: "Week 4", kwh: 210 },
];

export const consumptionChartConfig = {
  kwh: {
    label: "kWh",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig


export const efficiencyTips = [
    {
        title: "Optimize Your AC Usage",
        content: "Set your thermostat to 24-26°C. Every degree lower increases electricity consumption by 6-8%. Clean the filters monthly for better efficiency."
    },
    {
        title: "Switch to LED Lighting",
        content: "LED bulbs use up to 80% less energy than incandescent bulbs and last 25 times longer. This is a simple switch with significant long-term savings."
    },
    {
        title: "Unplug Electronics",
        content: "Many electronics continue to draw power even when turned off. Unplug chargers, TVs, and other appliances when not in use, or use a smart power strip."
    },
    {
        title: "Use Appliances Efficiently",
        content: "Run your washing machine and dishwasher with full loads. Use the 'eco' mode if available. Air-dry clothes instead of using a dryer whenever possible."
    }
]
