import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Calculator() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💸 Position Size Calculator
        </h1>
        <p className="text-gray-600">
          Calculate optimal position size for risk management
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Position size calculator for risk management will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}