import { Empresa } from '@interfaces/contenedor/empresa';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const Empresa = createFeatureSelector<Empresa>('empresa');

export const obtenerEmpresaImagen = createSelector(
  Empresa,
  (Empresa) => `${Empresa.imagen}`
);

export const obtenerEmpresaNombre = createSelector(
  Empresa,
  (Empresa) => `${Empresa.nombre_corto}`
);

export const obtenerEmpresaId = createSelector(
  Empresa,
  (Empresa) => `${Empresa.id}`
);

export const obtenerEmpresaNumeroIdenticionDigitoVerificacion = createSelector(
  Empresa,
  (Empresa) => `${Empresa.numero_identificacion}-${Empresa.digito_verificacion}`
);

export const obtenerEmpresaTelefono = createSelector(
  Empresa,
  (Empresa) => `${Empresa.telefono}`
);

export const obtenerEmpresaDireccion = createSelector(
  Empresa,
  (Empresa) => `${Empresa.direccion}`
);
