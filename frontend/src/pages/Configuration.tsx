import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Configuration() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔧 Configuration
        </h1>
        <p className="text-gray-600">
          Customize your screening parameters
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Configuration panel for customizing screening parameters will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}