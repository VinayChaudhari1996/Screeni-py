import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Screening } from '@/pages/Screening';
import { Prediction } from '@/pages/Prediction';
import { Similarity } from '@/pages/Similarity';
import { Configuration } from '@/pages/Configuration';
import { Calculator } from '@/pages/Calculator';
import { About } from '@/pages/About';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/screening" element={<Screening />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/similarity" element={<Similarity />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </div>
      </Router>
      
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;