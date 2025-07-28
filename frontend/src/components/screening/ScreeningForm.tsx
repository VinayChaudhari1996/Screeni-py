import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayIcon } from 'lucide-react';
import { useScreening } from '@/hooks/useScreening';

const indexOptions = [
  { value: "12", label: 'All Stocks (Default)' },
  { value: "0", label: 'By Stock Names (NSE Stock Code)' },
  { value: "1", label: 'Nifty 50' },
  { value: "2", label: 'Nifty Next 50' },
  { value: "3", label: 'Nifty 100' },
  { value: "4", label: 'Nifty 200' },
  { value: "5", label: 'Nifty 500' },
];

const criteriaOptions = [
  { value: "0", label: 'Full Screening (Shows Technical Parameters without Any Criteria)' },
  { value: "1", label: 'Screen stocks for Breakout or Consolidation' },
  { value: "2", label: 'Screen for the stocks with recent Breakout & Volume' },
  { value: "3", label: 'Screen for the Consolidating stocks' },
  { value: "4", label: 'Screen for the stocks with Lowest Volume in last N-days' },
  { value: "5", label: 'Screen for the stocks with RSI' },
];

export function ScreeningForm() {
  const { startScreening, isLoading } = useScreening();
  const [indexType, setIndexType] = useState("1");
  const [criteria, setCriteria] = useState("0");

  const onSubmit = async () => {
    try {
      await startScreening({
        index_type: indexType,
        criteria: criteria,
      });
    } catch (error) {
      console.error('Screening failed:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayIcon className="h-5 w-5" />
          Stock Screening Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Index</label>
              <Select value={indexType} onValueChange={setIndexType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select index" />
                </SelectTrigger>
                <SelectContent>
                  {indexOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Screening Criteria</label>
              <Select value={criteria} onValueChange={setCriteria}>
                <SelectTrigger>
                  <SelectValue placeholder="Select criteria" />
                </SelectTrigger>
                <SelectContent>
                  {criteriaOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onSubmit} disabled={isLoading} className="min-w-[120px]">
              {isLoading ? 'Screening...' : 'Start Screening'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}