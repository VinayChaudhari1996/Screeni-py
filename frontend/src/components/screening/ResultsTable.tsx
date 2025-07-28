import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StockResult {
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

interface ResultsTableProps {
  data: StockResult[];
  isLoading?: boolean;
  onExport?: (format: 'csv' | 'json') => void;
}

export function ResultsTable({ data, isLoading, onExport }: ResultsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No results found. Try running a screening first.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Found {data.length} Results
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Stock</th>
                <th className="border border-gray-300 px-4 py-2 text-left">LTP</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Consolidating</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Breaking Out</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Volume</th>
                <th className="border border-gray-300 px-4 py-2 text-left">MA Signal</th>
                <th className="border border-gray-300 px-4 py-2 text-left">RSI</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Trend</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Pattern</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    <a 
                      href={`https://in.tradingview.com/chart?symbol=NSE%3A${row.stock}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {row.stock}
                    </a>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{row.ltp}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.consolidating}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.breaking_out}</td>
                  <td className="border border-gray-300 px-4 py-2">{row.volume}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      row.ma_signal === 'Bullish' ? 'bg-green-100 text-green-800' :
                      row.ma_signal === 'Bearish' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {row.ma_signal}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{row.rsi}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      row.trend.includes('Up') ? 'bg-green-100 text-green-800' :
                      row.trend.includes('Down') ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {row.trend}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{row.pattern || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}