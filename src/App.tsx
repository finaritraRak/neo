import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Sites = lazy(() => import('./pages/Sites'));
const Alertes = lazy(() => import('./pages/Alertes'));
const Analyse = lazy(() => import('./pages/Analyse'));
const Rapports = lazy(() => import('./pages/Rapports'));
const GenererRapport = lazy(() => import('./pages/GenererRapport'));
const Utilisateurs = lazy(() => import('./pages/Utilisateurs'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/alertes" element={<Alertes />} />
          <Route path="/analyse" element={<Analyse />} />
          <Route path="/rapports" element={<Rapports />} />
          <Route path="/rapports/generer" element={<GenererRapport />} />
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
