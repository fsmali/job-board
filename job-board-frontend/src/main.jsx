import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/auth.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  /*
  QueryClientProvider for
    fetching API data
    caching data
    mutations like create/update/delete
  */
  // BrowserRouter enable client-side routing/navigation.

  /* 
  AuthProvider for
  logged-in user
  JWT token
  role checking
  */
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>,
);
