import React, { useState } from 'react';
import { ScreeningForm } from '@/components/screening/ScreeningForm';
import { ResultsTable } from '@/components/screening/ResultsTable';
import { useScreening } from '@/hooks/useScreening';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { StopCircle } from 'lucide-react';

export function Screening() {
  const { 
    currentJobId, 
    useScreeningStatus, 
    useScreeningResults,
    cancelScreening,
    exportResults,
    isCancelling 
  } = useScreening();

  const { data: status } = useScreeningStatus(currentJobId);
  const { data: results } = useScreeningResults(currentJobId);

  const handleExport = (format: 'csv' | 'json') => {
    if (currentJobId) {
      exportResults(currentJobId, format);
    }
  };

  const handleCancel = () => {
    if (currentJobId) {
      cancelScreening(currentJobId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Stock Screening
        </h1>
        <p className="text-gray-600">
          Screen stocks based on technical analysis criteria
        </p>
      </div>

      <ScreeningForm />

      {status && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Screening Progress</CardTitle>
              {status.status === 'running' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancel}
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
      )}

      {results?.results && (
        <ResultsTable 
          data={results.results} 
          onExport={handleExport}
        />
      )}
    </div>
  );
}