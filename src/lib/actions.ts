
"use server";

import { generateEnergySavingSuggestions } from "@/ai/flows/generate-energy-saving-suggestions";
import { initialPowerData, type Appliance } from "./data";
import { z } from "zod";

const ActionState = z.object({
    suggestions: z.array(z.string()).optional(),
    error: z.string().optional(),
});
  
type ActionState = z.infer<typeof ActionState>;

export async function getEnergySuggestions(
    previousState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const appliancesString = formData.get('appliances') as string;
    let appliances: Appliance[] = [];
    try {
        if (appliancesString) {
            appliances = JSON.parse(appliancesString);
        }
    } catch (e) {
        console.error("Failed to parse appliances JSON", e);
        return { suggestions: [], error: "Invalid appliance data format." };
    }

    const totalConsumption = appliances.reduce((acc, app) => acc + app.powerConsumption, 0);

    const householdData = {
        avgDailyConsumption: initialPowerData.reduce((acc, curr) => acc + curr.kwh, 0) / initialPowerData.length,
        peakUsage: {
            time: "18:00",
            kwh: Math.max(...initialPowerData.map(d => d.kwh)),
        },
        applianceBreakdown: appliances.map(d => ({ 
            appliance: d.name, 
            percentage: totalConsumption > 0 ? Math.round((d.powerConsumption / totalConsumption) * 100) : 0
        })),
        userPreferences: {
            coolingTemperature: "22°C",
            laundryTime: "Weekends",
        },
    };

    try {
        const result = await generateEnergySavingSuggestions({ householdData: JSON.stringify(householdData, null, 2) });
        if (result && result.suggestions) {
            return { suggestions: result.suggestions };
        }
        return { suggestions: [], error: "Failed to get suggestions. The AI model did not return a valid response." };

    } catch (e) {
        console.error(e);
        return { suggestions: [], error: "An unexpected error occurred. Please try again later." };
    }
}
