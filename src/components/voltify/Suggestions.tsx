
"use client"

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEnergySuggestions } from "@/lib/actions";
import { WandSparkles, Loader2, Lightbulb } from "lucide-react";
import type { Appliance } from '@/lib/data';

const initialState = {
  suggestions: [],
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <WandSparkles className="mr-2 h-4 w-4" />
          Get Smart Suggestions
        </>
      )}
    </Button>
  );
}

interface SuggestionsProps {
    appliances: Appliance[];
}

export default function Suggestions({ appliances }: SuggestionsProps) {
  const [state, formAction] = useActionState(getEnergySuggestions, initialState);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="font-headline">AI-Powered Suggestions</CardTitle>
        <CardDescription>Get personalized tips to reduce your energy consumption and save money.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col items-start gap-4">
          <input type="hidden" name="appliances" value={JSON.stringify(appliances)} />
          <SubmitButton />
        </form>
        
        {state.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
        
        {state.suggestions && state.suggestions.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Here are your personalized recommendations:</h3>
            <ul className="space-y-3">
              {state.suggestions.map((suggestion, index) => (
                <li key={index} className="flex gap-3 items-start p-3 rounded-md bg-accent/10">
                    <Lightbulb className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
