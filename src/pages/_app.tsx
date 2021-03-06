import type { AppProps } from 'next/app';
import { AppProvider } from '../context/AppContext';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default App;
