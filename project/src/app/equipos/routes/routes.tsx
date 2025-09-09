import React from 'react';
import { Route } from 'react-router-dom';
import CrearEquipo from '../pages/CrearEquipo';
import GestionarEquipos from '../pages/GestionarEquipos';
import MiEquipo from '../pages/MiEquipo';

const EquiposRoutes = (
  <Route path="equipos">
    <Route index element={<GestionarEquipos />} />
    <Route path="crear" element={<CrearEquipo />} />
    <Route path="mi-equipo" element={<MiEquipo />} />
  </Route>
);

export default EquiposRoutes;
