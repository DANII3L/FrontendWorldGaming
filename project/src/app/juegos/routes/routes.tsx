import React from 'react';
import { Route } from 'react-router-dom';
import GestionarJuegos from '../pages/GestionarJuegos';
import CrearJuego from '../pages/CrearJuego';

const JuegosRoutes = (
  <Route path="juegos">
    <Route index element={<GestionarJuegos />} />
    <Route path="crear" element={<CrearJuego />} />
    <Route path="editar/:id" element={<CrearJuego />} />
  </Route>
);

export default JuegosRoutes;
