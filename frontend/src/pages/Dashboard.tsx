import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  Brain, 
  Calculator, 
  Settings,
  BarChart3
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Stock Screening',
      description: 'Screen stocks based on various technical criteria',
      icon: <TrendingUp className="h-8 w-8" />,
      path: '/screening',
      color: 'text-blue-600'
    },
    {
      title: 'Similar Stocks',
      description: 'Find stocks with similar chart patterns',
      icon: <Search className="h-8 w-8" />,
      path: '/similarity',
      color: 'text-green-600'
    },
    {
      title: 'Nifty Prediction',
      description: 'AI-based prediction for next day gap up/down',
      icon: <Brain className="h-8 w-8" />,
      path: '/prediction',
      color: 'text-purple-600'
    },
    {
      title: 'Position Calculator',
      description: 'Calculate optimal position size for risk management',
      icon: <Calculator className="h-8 w-8" />,
      path: '/calculator',
      color: 'text-orange-600'
    },
    {
      title: 'Configuration',
      description: 'Customize screening parameters',
      icon: <Settings className="h-8 w-8" />,
      path: '/configuration',
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          📈 Screenipy
        </h1>
        <p className="text-xl text-gray-600">
          Find Breakouts, Just in Time!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(feature.path)}
          >
            <CardHeader className="text-center">
              <div className={`mx-auto ${feature.color}`}>
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-600">Screening Criteria</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5000+</div>
              <div className="text-sm text-gray-600">NSE Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">AI</div>
              <div className="text-sm text-gray-600">Powered Predictions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">Real-time</div>
              <div className="text-sm text-gray-600">Data Updates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}