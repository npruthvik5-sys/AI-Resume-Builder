import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Home from './Home';
import './index.css';

const RootApp: React.FC = () => {
  const [route, setRoute] = useState<string>(window.location.hash || '#/home');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/home');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === '#/builder' || route === '#/app') return <App />;
  return <Home />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
