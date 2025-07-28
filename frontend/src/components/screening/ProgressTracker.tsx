import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { StopCircle } from 'lucide-react';

interface ProgressTrackerProps {
  status: any;
  onCancel?: () => void;
  isCancelling?: boolean;
}

export function ProgressTracker({ status, onCancel, isCancelling }: ProgressTrackerProps) {
  if (!status) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Screening Progress</CardTitle>
          {status.status === 'running' && onCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onCancel}
              disabled={isCancelling}
            >
              <StopCircle className="h-4 w-4 mr-2" />
              {isCancelling ? 'Cancelling...' : 'Cancel'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Status: {status.status}</span>
            <span>
              {status.screened_stocks || 0} / {status.total_stocks || 0} stocks
            </span>
          </div>
          <Progress value={status.progress} className="w-full" />
          {status.found_stocks !== undefined && (
            <div className="text-sm text-green-600">
              Found {status.found_stocks} matching stocks
            </div>
          )}
          {status.error_message && (
            <div className="text-sm text-red-600">
              Error: {status.error_message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}