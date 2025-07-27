import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

interface PredictionResult {
  prediction: string;
  confidence: number;
  probability: number;
  data_used: any;
  model_version: string;
}

export function Prediction() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/prediction/nifty');
      setPrediction(response.data);
      toast.success('Prediction generated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate prediction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧠 AI-based Nifty-50 Gap Prediction
        </h1>
        <p className="text-gray-600">
          Predict next day gap up/down for Nifty-50 using AI
        </p>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handlePredict} 
          disabled={isLoading}
          size="lg"
          className="min-w-[200px]"
        >
          <Brain className="h-5 w-5 mr-2" />
          {isLoading ? 'Predicting...' : 'Generate Prediction'}
        </Button>
      </div>

      {prediction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {prediction.prediction === 'BULLISH' ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                Prediction Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    prediction.prediction === 'BULLISH' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction.prediction}
                  </div>
                  <div className="text-lg text-gray-600">
                    Market may open {prediction.prediction.toLowerCase()} tomorrow
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Confidence Level</div>
                  <div className="text-2xl font-bold">
                    {prediction.confidence}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Used for Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nifty Close:</span>
                  <span className="font-medium">
                    ₹{prediction.data_used.nifty_close?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nifty Open:</span>
                  <span className="font-medium">
                    ₹{prediction.data_used.nifty_open?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Change:</span>
                  <span className={`font-medium ${
                    prediction.data_used.price_change_pct > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction.data_used.price_change_pct}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model Version:</span>
                  <span className="font-medium">{prediction.model_version}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>⚠️ Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • The AI prediction should be executed after 3 PM or around closing hours 
              as the prediction accuracy is based on the closing price.
            </p>
            <p>
              • This is just a statistical prediction and there are chances of 
              <strong> false predictions</strong>.
            </p>
            <p>
              • Do NOT use this prediction solely for trading decisions. 
              Always do your own research and risk management.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}