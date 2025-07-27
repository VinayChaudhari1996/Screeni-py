import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Similarity() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🕵🏻 Similar Stock Search
        </h1>
        <p className="text-gray-600">
          Find stocks forming similar chart patterns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This feature will allow you to find stocks with similar chart patterns 
            using vector similarity search.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}