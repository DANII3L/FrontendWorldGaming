import React from 'react';
import { Route } from 'react-router-dom';
import TorneoPage from '../pages/TorneoPage';
import CrearTorneo from '../pages/CrearTorneo';
import MisTorneos from '../pages/MisTorneosPage';
import AdministrarResultados from '../pages/AdministrarResultados';

const TorneosRoutes = (
  <Route path="torneos">
    <Route index element={<TorneoPage />} />
    <Route path="crear" element={<CrearTorneo />} />
    <Route path="mis-torneos" element={<MisTorneos />} />
    <Route path="resultados" element={<AdministrarResultados />} />
  </Route>
);

export default TorneosRoutes;
