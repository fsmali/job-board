import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/auth.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // This gives React Query to the whole app.
  // BrowserRouter enable client-side routing/navigation.
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>,
);
