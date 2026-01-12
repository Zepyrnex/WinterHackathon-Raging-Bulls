
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/voltify/Header';
import { IndianRupee, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark');
  const [peakNotifications, setPeakNotifications] = useState(true);
  const [suggestionNotifications, setSuggestionNotifications] = useState(true);
  const [electricityRate, setElectricityRate] = useState('8');
  const [peakThreshold, setPeakThreshold] = useState('3.0');

  const [isClient, setIsClient] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('voltify-theme') || 'dark';
    const savedPeakNotifications = localStorage.getItem('voltify-peak-notifications') !== 'false';
    const savedSuggestionNotifications = localStorage.getItem('voltify-suggestion-notifications') !== 'false';
    const savedRate = localStorage.getItem('voltify-electricity-rate') || '8';
    const savedThreshold = localStorage.getItem('voltify-peak-threshold') || '3.0';

    setTheme(savedTheme);
    setPeakNotifications(savedPeakNotifications);
    setSuggestionNotifications(savedSuggestionNotifications);
    setElectricityRate(savedRate);
    setPeakThreshold(savedThreshold);

    document.documentElement.className = savedTheme;
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.className = newTheme;
  };

  const handleSaveChanges = () => {
    localStorage.setItem('voltify-theme', theme);
    localStorage.setItem('voltify-peak-notifications', String(peakNotifications));
    localStorage.setItem('voltify-suggestion-notifications', String(suggestionNotifications));
    localStorage.setItem('voltify-electricity-rate', electricityRate);
    localStorage.setItem('voltify-peak-threshold', peakThreshold);
    
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated locally.',
    });
  };
  
  if (!isClient) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                 <div className="flex min-h-screen items-center justify-center">Loading...</div>
            </main>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="max-w-2xl mx-auto w-full">
            <h1 className="text-3xl font-bold font-headline mb-6">Settings</h1>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={theme} onValueChange={handleThemeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="mt-6 glass-card">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage your local notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor="peak-usage-notifications" className="flex flex-col space-y-1">
                    <span>Peak Usage Alerts</span>
                     <span className="font-normal leading-snug text-muted-foreground">
                        Receive alerts when your consumption is high.
                      </span>
                  </Label>
                  <Switch
                    id="peak-usage-notifications"
                    checked={peakNotifications}
                    onCheckedChange={setPeakNotifications}
                  />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                  <Label htmlFor="suggestion-notifications" className="flex flex-col space-y-1">
                    <span>AI Suggestions</span>
                     <span className="font-normal leading-snug text-muted-foreground">
                        Get notifications for new energy-saving tips.
                      </span>
                  </Label>
                  <Switch
                    id="suggestion-notifications"
                    checked={suggestionNotifications}
                    onCheckedChange={setSuggestionNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 glass-card">
              <CardHeader>
                <CardTitle>Advanced</CardTitle>
                <CardDescription>
                  Fine-tune calculations and alerts to match your needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="electricity-rate">Electricity Rate (₹/kWh)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="electricity-rate"
                      type="number"
                      value={electricityRate}
                      onChange={(e) => setElectricityRate(e.target.value)}
                      placeholder="e.g., 8"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peak-threshold">Peak Usage Threshold (kWh)</Label>
                   <div className="relative">
                    <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="peak-threshold"
                      type="number"
                      value={peakThreshold}
                      onChange={(e) => setPeakThreshold(e.target.value)}
                      step="0.1"
                      placeholder="e.g., 3.0"
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
        </div>
      </main>
    </div>
  );
}
