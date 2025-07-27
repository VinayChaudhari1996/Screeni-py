import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function About() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          About Screenipy
        </h1>
        <p className="text-gray-600">
          Advanced stock screening and analysis platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🔍 Screenipy v2.0.0</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              👨🏻‍💻 <strong>Developed and Maintained by:</strong> Pranjal Joshi
            </p>
            <p>
              🏠 <strong>Home Page:</strong>{' '}
              <a 
                href="https://github.com/pranjal-joshi/Screeni-py" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://github.com/pranjal-joshi/Screeni-py
              </a>
            </p>
            <p>
              ⚠️ <strong>Issues:</strong>{' '}
              <a 
                href="https://github.com/pranjal-joshi/Screeni-py/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Report issues here
              </a>
            </p>
            <p>
              📣 <strong>Discussions:</strong>{' '}
              <a 
                href="https://github.com/pranjal-joshi/Screeni-py/discussions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Join community discussions
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>⚠️ Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • DO NOT use the results provided by the software solely to make your trading decisions.
            </p>
            <p>
              • Always backtest and analyze the stocks manually before you trade.
            </p>
            <p>
              • The authors of this tool will not be held liable for any losses.
            </p>
            <p>
              • Understand the risks associated with markets before investing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}