import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import Placeholder from '@/components/Placeholder';

const App: React.FC = () => {
  const navigate = useNavigate();

  // Navigate to the route that matches the requested fluxo.
  const setFluxo = (fluxo: string) => {
    // Ensure the path starts with a slash.
    const path = fluxo.startsWith('/') ? fluxo : `/${fluxo}`;
    navigate(path);
  };

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Home / landing page */}
        <Route path="/" element={<Landing setFluxo={setFluxo} />} />
        {/* Placeholder routes for the flows referenced in Landing */}
        <Route path="/cadastro-empresa" element={<Placeholder title="Cadastro Empresa" />} />
        <Route path="/empresa" element={<Placeholder title="Empresa" />} />
        <Route path="/cadastro-candidato" element={<Placeholder title="Cadastro Candidato" />} />
        <Route path="/candidato" element={<Placeholder title="Candidato" />} />
      </Routes>
    </div>
  );
};

export default App;
