import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlayIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useScreening } from '@/hooks/useScreening';
import { IndexType, ScreeningCriteria, ReversalType, ChartPattern } from '@/types/screening';

const screeningSchema = z.object({
  indexType: z.nativeEnum(IndexType),
  criteria: z.nativeEnum(ScreeningCriteria),
  stockCodes: z.string().optional(),
  backtestDate: z.date().optional(),
  rsiMin: z.number().min(0).max(100).optional(),
  rsiMax: z.number().min(0).max(100).optional(),
  volumeDays: z.number().min(1).max(100).optional(),
  reversalType: z.nativeEnum(ReversalType).optional(),
  maLength: z.number().min(1).max(200).optional(),
  nrRange: z.number().min(1).max(14).optional(),
  chartPattern: z.nativeEnum(ChartPattern).optional(),
  lookbackCandles: z.number().min(1).max(50).optional(),
  confluencePercentage: z.number().min(0.1).max(5.0).optional(),
});

type ScreeningFormData = z.infer<typeof screeningSchema>;

const indexOptions = [
  { value: IndexType.ALL_STOCKS, label: 'All Stocks (Default)' },
  { value: IndexType.BY_STOCK_NAME, label: 'By Stock Names (NSE Stock Code)' },
  { value: IndexType.NIFTY_50, label: 'Nifty 50' },
  { value: IndexType.NIFTY_NEXT_50, label: 'Nifty Next 50' },
  { value: IndexType.NIFTY_100, label: 'Nifty 100' },
  { value: IndexType.NIFTY_200, label: 'Nifty 200' },
  { value: IndexType.NIFTY_500, label: 'Nifty 500' },
  { value: IndexType.NIFTY_SMALLCAP_50, label: 'Nifty Smallcap 50' },
  { value: IndexType.NIFTY_SMALLCAP_100, label: 'Nifty Smallcap 100' },
  { value: IndexType.NIFTY_SMALLCAP_250, label: 'Nifty Smallcap 250' },
  { value: IndexType.NIFTY_MIDCAP_50, label: 'Nifty Midcap 50' },
  { value: IndexType.NIFTY_MIDCAP_100, label: 'Nifty Midcap 100' },
  { value: IndexType.NIFTY_MIDCAP_150, label: 'Nifty Midcap 150' },
  { value: IndexType.NEWLY_LISTED, label: 'Newly Listed (IPOs in last 2 Year)' },
  { value: IndexType.FNO_STOCKS, label: 'F&O Stocks Only' },
  { value: IndexType.US_SP500, label: 'US S&P 500' },
  { value: IndexType.SECTORAL_INDICES, label: 'Sectoral Indices (NSE)' },
];

const criteriaOptions = [
  { value: ScreeningCriteria.FULL_SCREENING, label: 'Full Screening (Shows Technical Parameters without Any Criteria)' },
  { value: ScreeningCriteria.BREAKOUT_CONSOLIDATION, label: 'Screen stocks for Breakout or Consolidation' },
  { value: ScreeningCriteria.BREAKOUT_VOLUME, label: 'Screen for the stocks with recent Breakout & Volume' },
  { value: ScreeningCriteria.CONSOLIDATING, label: 'Screen for the Consolidating stocks' },
  { value: ScreeningCriteria.LOWEST_VOLUME, label: 'Screen for the stocks with Lowest Volume in last N-days' },
  { value: ScreeningCriteria.RSI_SCREENING, label: 'Screen for the stocks with RSI' },
  { value: ScreeningCriteria.REVERSAL_SIGNALS, label: 'Screen for the stocks showing Reversal Signals' },
  { value: ScreeningCriteria.CHART_PATTERNS, label: 'Screen for the stocks making Chart Patterns' },
];

export function ScreeningForm() {
  const { startScreening, isLoading } = useScreening();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<ScreeningFormData>({
    resolver: zodResolver(screeningSchema),
    defaultValues: {
      indexType: IndexType.ALL_STOCKS,
      criteria: ScreeningCriteria.FULL_SCREENING,
      backtestDate: new Date(),
    },
  });

  const watchedCriteria = form.watch('criteria');
  const watchedIndexType = form.watch('indexType');

  const onSubmit = async (data: ScreeningFormData) => {
    try {
      await startScreening({
        index_type: data.indexType,
        criteria: data.criteria,
        stock_codes: data.stockCodes ? data.stockCodes.split(',').map(s => s.trim()) : undefined,
        backtest_date: data.backtestDate?.toISOString().split('T')[0],
        rsi_min: data.rsiMin,
        rsi_max: data.rsiMax,
        volume_days: data.volumeDays,
        reversal_type: data.reversalType,
        ma_length: data.maLength,
        nr_range: data.nrRange,
        chart_pattern: data.chartPattern,
        lookback_candles: data.lookbackCandles,
        confluence_percentage: data.confluencePercentage,
      });
    } catch (error) {
      console.error('Screening failed:', error);
    }
  };

  const renderCriteriaSpecificFields = () => {
    switch (watchedCriteria) {
      case ScreeningCriteria.RSI_SCREENING:
        return (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="rsiMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min RSI</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rsiMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max RSI</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case ScreeningCriteria.LOWEST_VOLUME:
        return (
          <FormField
            control={form.control}
            name="volumeDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume should be lowest since last how many candles?</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="20"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case ScreeningCriteria.REVERSAL_SIGNALS:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="reversalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Type of Reversal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reversal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ReversalType.BUY_SIGNAL}>Buy Signal (Bullish Reversal)</SelectItem>
                      <SelectItem value={ReversalType.SELL_SIGNAL}>Sell Signal (Bearish Reversal)</SelectItem>
                      <SelectItem value={ReversalType.MOMENTUM_GAINERS}>Momentum Gainers</SelectItem>
                      <SelectItem value={ReversalType.MA_REVERSAL}>Reversal at Moving Average</SelectItem>
                      <SelectItem value={ReversalType.VSA_REVERSAL}>Volume Spread Analysis</SelectItem>
                      <SelectItem value={ReversalType.NARROW_RANGE}>Narrow Range (NRx) Reversal</SelectItem>
                      <SelectItem value={ReversalType.LORENTZIAN}>Lorentzian Classifier</SelectItem>
                      <SelectItem value={ReversalType.RSI_MA_CROSSING}>RSI MA Crossing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch('reversalType') === ReversalType.MA_REVERSAL && (
              <FormField
                control={form.control}
                name="maLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MA Length</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={200}
                        placeholder="44"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {form.watch('reversalType') === ReversalType.NARROW_RANGE && (
              <FormField
                control={form.control}
                name="nrRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NR(x) Range</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={14}
                        placeholder="4"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      case ScreeningCriteria.CHART_PATTERNS:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="chartPattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Chart Pattern</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chart pattern" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ChartPattern.BULLISH_INSIDE_BAR}>Bullish Inside Bar (Flag) Pattern</SelectItem>
                      <SelectItem value={ChartPattern.BEARISH_INSIDE_BAR}>Bearish Inside Bar (Flag) Pattern</SelectItem>
                      <SelectItem value={ChartPattern.CONFLUENCE}>Confluence (50 & 200 MA/EMA)</SelectItem>
                      <SelectItem value={ChartPattern.VCP}>VCP (Experimental)</SelectItem>
                      <SelectItem value={ChartPattern.TRENDLINE_SUPPORT}>Buying at Trendline</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(form.watch('chartPattern') === ChartPattern.BULLISH_INSIDE_BAR || 
              form.watch('chartPattern') === ChartPattern.BEARISH_INSIDE_BAR) && (
              <FormField
                control={form.control}
                name="lookbackCandles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lookback Candles</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        placeholder="12"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {form.watch('chartPattern') === ChartPattern.CONFLUENCE && (
              <FormField
                control={form.control}
                name="confluencePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MA Confluence %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0.1}
                        max={5.0}
                        step={0.1}
                        placeholder="1.0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      default:
        return null;
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="indexType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Index</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select index" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {indexOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backtestDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screen/Backtest For</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="criteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Screening Criteria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select criteria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {criteriaOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchedIndexType === IndexType.BY_STOCK_NAME && (
              <FormField
                control={form.control}
                name="stockCodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Stock Code(s)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SBIN, INFY, ITC (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {renderCriteriaSpecificFields()}

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </Button>
              
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? 'Screening...' : 'Start Screening'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}