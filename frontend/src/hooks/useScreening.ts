import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '@/services/api';

interface ScreeningRequest {
  index_type: string;
  criteria: string;
  stock_codes?: string[];
  backtest_date?: string;
  rsi_min?: number;
  rsi_max?: number;
  volume_days?: number;
  reversal_type?: string;
  ma_length?: number;
  nr_range?: number;
  chart_pattern?: string;
  lookback_candles?: number;
  confluence_percentage?: number;
}

export function useScreening() {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Start screening mutation
  const startScreeningMutation = useMutation({
    mutationFn: async (request: ScreeningRequest) => {
      const response = await api.post('/screening/run', request);
      return response.data;
    },
    onSuccess: (data) => {
      setCurrentJobId(data.job_id);
      toast.success('Screening started successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to start screening');
    },
  });

  // Get screening status
  const useScreeningStatus = (jobId: string | null) => {
    return useQuery({
      queryKey: ['screening-status', jobId],
      queryFn: async () => {
        if (!jobId) throw new Error('No job ID provided');
        const response = await api.get(`/screening/status/${jobId}`);
        return response.data;
      },
      enabled: !!jobId,
      refetchInterval: (data) => {
        if (data?.status && ['completed', 'failed', 'cancelled'].includes(data.status)) {
          return false;
        }
        return 2000; // Poll every 2 seconds
      },
    });
  };

  // Get screening results
  const useScreeningResults = (jobId: string | null) => {
    return useQuery({
      queryKey: ['screening-results', jobId],
      queryFn: async () => {
        if (!jobId) throw new Error('No job ID provided');
        const response = await api.get(`/screening/results/${jobId}`);
        return response.data;
      },
      enabled: !!jobId,
      retry: false,
    });
  };

  // Export results
  const exportResults = useCallback(async (jobId: string, format: 'csv' | 'json' = 'csv') => {
    try {
      // Mock export functionality
      toast.success('Export functionality will be implemented');
    } catch (error: any) {
      toast.error('Failed to export results');
    }
  }, []);

  return {
    startScreening: startScreeningMutation.mutate,
    exportResults,
    isLoading: startScreeningMutation.isPending,
    currentJobId,
    useScreeningStatus,
    useScreeningResults,
    cleanup: useCallback(() => {
      setCurrentJobId(null);
    }, []),
  };
}