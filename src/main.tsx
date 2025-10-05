import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoute from './AppRoutes';
import './global.css'
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate';


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
      </Auth0ProviderWithNavigate>
      </QueryClientProvider>
      
    </Router>
  </StrictMode>,
)
