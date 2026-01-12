
"use client";

import { useState } from 'react';
import Header from '@/components/voltify/Header';
import ConsumptionChart from '@/components/voltify/ConsumptionChart';
import ApplianceChart from '@/components/voltify/ApplianceChart';
import EfficiencyGrade from '@/components/voltify/EfficiencyGrade';
import Suggestions from '@/components/voltify/Suggestions';
import Stats from '@/components/voltify/Stats';
import AutoCutoff from '@/components/voltify/AutoCutoff';
import ApplianceManager from '@/components/voltify/ApplianceManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialAppliances } from '@/lib/data';
import type { Appliance } from '@/lib/data';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutDashboard, ListChecks } from 'lucide-react';


export default function Home() {
  const [isAutoCutoffEnabled, setIsAutoCutoffEnabled] = useState(false);
  const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="dashboard">
            <TooltipProvider>
              <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <TabsTrigger value="dashboard">
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              Dashboard
                          </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>View your main energy dashboard.</p>
                      </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <TabsTrigger value="appliances">
                              <ListChecks className="mr-2 h-4 w-4" />
                              Manage Appliances
                          </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>Add, remove, and manage your appliances.</p>
                      </TooltipContent>
                  </Tooltip>
              </TabsList>
            </TooltipProvider>
          <TabsContent value="dashboard">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-4">
              <Stats />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4">
              <div className="xl:col-span-2">
                <ConsumptionChart isAutoCutoffEnabled={isAutoCutoffEnabled} />
              </div>
              <div className="grid gap-4">
                <ApplianceChart appliances={appliances} />
                <AutoCutoff isAutoCutoffEnabled={isAutoCutoffEnabled} onToggle={setIsAutoCutoffEnabled} />
                <EfficiencyGrade />
              </div>
            </div>
            <div className="mt-4">
              <Suggestions appliances={appliances}/>
            </div>
          </TabsContent>
          <TabsContent value="appliances">
            <ApplianceManager appliances={appliances} setAppliances={setAppliances} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
