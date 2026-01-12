import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { efficiencyTips } from "@/lib/data";
import { Lightbulb } from "lucide-react";

export default function EfficiencyGrade() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="font-headline">Efficiency Grade</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-center gap-4 rounded-lg bg-accent/20 p-4">
          <div className="font-headline text-7xl font-bold text-primary">B+</div>
          <div className="text-sm">
            <p>Good job! Your home is more efficient than the average Indian household.</p>
          </div>
        </div>
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold">Improvement Tips</h3>
            </div>
            <Accordion type="single" collapsible className="w-full">
                {efficiencyTips.map((tip, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{tip.title}</AccordionTrigger>
                    <AccordionContent>{tip.content}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
