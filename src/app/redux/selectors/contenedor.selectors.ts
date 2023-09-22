import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Contenedor } from '@interfaces/usuario/contenedor';

const Contenedor = createFeatureSelector<Contenedor>('inquilino');

export const obtenerContenedorSeleccion = createSelector(
  Contenedor,
  (Contenedor) => Contenedor.seleccion
);

export const obtenerContenedorNombre = createSelector(
  Contenedor,
  (Contenedor) => `${Contenedor.nombre}`
);

export const obtenerLogoContenedor = createSelector(
  Contenedor,
  (Contenedor) => `${Contenedor.imagen}`
);

export const obtenerContenedorId = createSelector(
  Contenedor,
  (Contenedor) => `${Contenedor.id}`
);


export const obtenerContenedorSubdominio = createSelector(
  Contenedor,
  (Contenedor) => `${Contenedor.subdominio}`
);
