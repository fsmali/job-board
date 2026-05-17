import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
console.log(queryClient);

createRoot(document.getElementById('root')).render(
  // This gives React Query to the whole app.
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
