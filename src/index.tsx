import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline } from '@mui/material';
import App from './App';
import { PRODUCTION } from 'config.keys';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CssBaseline>
          {!PRODUCTION && <ReactQueryDevtools />}
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </CssBaseline>
      </BrowserRouter>
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById('root')!,
);
