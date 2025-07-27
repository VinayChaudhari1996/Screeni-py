export enum IndexType {
  ALL_STOCKS = "12",
  BY_STOCK_NAME = "0",
  NIFTY_50 = "1",
  NIFTY_NEXT_50 = "2",
  NIFTY_100 = "3",
  NIFTY_200 = "4",
  NIFTY_500 = "5",
  NIFTY_SMALLCAP_50 = "6",
  NIFTY_SMALLCAP_100 = "7",
  NIFTY_SMALLCAP_250 = "8",
  NIFTY_MIDCAP_50 = "9",
  NIFTY_MIDCAP_100 = "10",
  NIFTY_MIDCAP_150 = "11",
  NEWLY_LISTED = "13",
  FNO_STOCKS = "14",
  US_SP500 = "15",
  SECTORAL_INDICES = "16",
}

export enum ScreeningCriteria {
  FULL_SCREENING = "0",
  BREAKOUT_CONSOLIDATION = "1",
  BREAKOUT_VOLUME = "2",
  CONSOLIDATING = "3",
  LOWEST_VOLUME = "4",
  RSI_SCREENING = "5",
  REVERSAL_SIGNALS = "6",
  CHART_PATTERNS = "7",
}

export enum ReversalType {
  BUY_SIGNAL = "1",
  SELL_SIGNAL = "2",
  MOMENTUM_GAINERS = "3",
  MA_REVERSAL = "4",
  VSA_REVERSAL = "5",
  NARROW_RANGE = "6",
  LORENTZIAN = "7",
  RSI_MA_CROSSING = "8",
}

export enum ChartPattern {
  BULLISH_INSIDE_BAR = "1",
  BEARISH_INSIDE_BAR = "2",
  CONFLUENCE = "3",
  VCP = "4",
  TRENDLINE_SUPPORT = "5",
}

export interface ScreeningRequest {
  index_type: IndexType;
  criteria: ScreeningCriteria;
  stock_codes?: string[];
  backtest_date?: string;
  rsi_min?: number;
  rsi_max?: number;
  volume_days?: number;
  reversal_type?: ReversalType;
  ma_length?: number;
  nr_range?: number;
  chart_pattern?: ChartPattern;
  lookback_candles?: number;
  confluence_percentage?: number;
}

export interface StockResult {
  stock: string;
  consolidating: string;
  breaking_out: string;
  ltp: string;
  volume: string;
  ma_signal: string;
  rsi: number;
  trend: string;
  pattern: string;
}

export enum ScreeningJobStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface ScreeningJob {
  job_id: string;
  status: ScreeningJobStatus;
  progress: number;
  total_stocks?: number;
  screened_stocks?: number;
  found_stocks?: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface ScreeningResponse {
  job_id: string;
  status: ScreeningJobStatus;
  results?: StockResult[];
  total_found?: number;
  execution_time?: number;
}