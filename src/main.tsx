import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoute from './AppRoutes';
import './global.css'
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate';
import { Toaster } from './components/ui/sonner';


const queryClient = new QueryClient({
  defaultOptions :{
    queries : {
      refetchOnWindowFocus : false,
    },
  },
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
          <Auth0ProviderWithNavigate>
          <AppRoute/>
          <Toaster />
      </Auth0ProviderWithNavigate>
      </QueryClientProvider>
      
    </Router>
  </StrictMode>,
)
