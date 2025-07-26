import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '@/services/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { 
  ScreeningRequest, 
  ScreeningResponse, 
  ScreeningJob, 
  ScreeningJobStatus 
} from '@/types/screening';

export function useScreening() {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // WebSocket connection for real-time progress updates
  const { connect, disconnect, isConnected } = useWebSocket({
    onMessage: (data) => {
      if (data.job_id === currentJobId) {
        // Update job status in cache
        queryClient.setQueryData(['screening-status', currentJobId], data);
        
        // Show progress updates
        if (data.status === 'running') {
          toast.loading(`Screening progress: ${data.progress}%`, {
            id: `progress-${currentJobId}`,
          });
        } else if (data.status === 'completed') {
          toast.success('Screening completed!', {
            id: `progress-${currentJobId}`,
          });
          // Invalidate results query to fetch fresh data
          queryClient.invalidateQueries(['screening-results', currentJobId]);
        } else if (data.status === 'failed') {
          toast.error(`Screening failed: ${data.error_message}`, {
            id: `progress-${currentJobId}`,
          });
        }
      }
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection lost. Progress updates may be delayed.');
    },
  });

  // Start screening mutation
  const startScreeningMutation = useMutation({
    mutationFn: async (request: ScreeningRequest): Promise<ScreeningResponse> => {
      const response = await api.post('/screening/run', request);
      return response.data;
    },
    onSuccess: (data) => {
      setCurrentJobId(data.job_id);
      toast.success('Screening started successfully!');
      
      // Connect to WebSocket for progress updates
      if (data.job_id) {
        connect(`/screening/ws/${data.job_id}`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to start screening');
    },
  });

  // Get screening status
  const useScreeningStatus = (jobId: string | null) => {
    return useQuery({
      queryKey: ['screening-status', jobId],
      queryFn: async (): Promise<ScreeningJob> => {
        if (!jobId) throw new Error('No job ID provided');
        const response = await api.get(`/screening/status/${jobId}`);
        return response.data;
      },
      enabled: !!jobId,
      refetchInterval: (data) => {
        // Stop polling when job is completed, failed, or cancelled
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
      queryFn: async (): Promise<ScreeningResponse> => {
        if (!jobId) throw new Error('No job ID provided');
        const response = await api.get(`/screening/results/${jobId}`);
        return response.data;
      },
      enabled: !!jobId,
      retry: false,
    });
  };

  // Cancel screening mutation
  const cancelScreeningMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await api.delete(`/screening/cancel/${jobId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Screening cancelled successfully');
      disconnect();
      setCurrentJobId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to cancel screening');
    },
  });

  // Get screening history
  const useScreeningHistory = (limit = 10, offset = 0) => {
    return useQuery({
      queryKey: ['screening-history', limit, offset],
      queryFn: async (): Promise<ScreeningJob[]> => {
        const response = await api.get(`/screening/history?limit=${limit}&offset=${offset}`);
        return response.data;
      },
    });
  };

  // Export results
  const exportResults = useCallback(async (jobId: string, format: 'csv' | 'json' = 'csv') => {
    try {
      const response = await api.get(`/screening/export/${jobId}?format=${format}`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `screening_results_${jobId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Results exported successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to export results');
    }
  }, []);

  return {
    // Actions
    startScreening: startScreeningMutation.mutate,
    cancelScreening: cancelScreeningMutation.mutate,
    exportResults,
    
    // State
    isLoading: startScreeningMutation.isPending,
    isCancelling: cancelScreeningMutation.isPending,
    currentJobId,
    isConnected,
    
    // Hooks
    useScreeningStatus,
    useScreeningResults,
    useScreeningHistory,
    
    // Cleanup
    cleanup: useCallback(() => {
      disconnect();
      setCurrentJobId(null);
    }, [disconnect]),
  };
}