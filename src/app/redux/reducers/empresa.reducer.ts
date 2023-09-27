import { environment } from '@env/environment';
import { Empresa } from '@interfaces/contenedor/empresa';
import { createReducer, on } from '@ngrx/store';
import {
  empresaActionInit,
  empresaActualizacionAction,
  empresaLimpiarAction
} from '@redux/actions/empresa.actions';
import { getCookie } from 'typescript-cookie';

let ContenedorDatos: any;

if (environment.production) {
  let dominioActual = window.location.host;
  ContenedorDatos = getCookie(`empresa-${dominioActual.split('.')[0]}`);
} else {
  ContenedorDatos = getCookie(`empresa-${environment.EMPRESA_LOCALHOST}`);
}

let estadoInicializado: Empresa = {
  id: 0,
  numero_identificacion: '',
  digito_verificacion: '',
  nombre_corto: '',
  direccion: '',
  telefono: '',
  correo: '',
  imagen: '',
  ciudad: 0,
  identificacion: 0
};

const initialState: Empresa = ContenedorDatos
  ? JSON.parse(ContenedorDatos)
  : estadoInicializado;

export const empresaReducer = createReducer(
  initialState,
  on(empresaActionInit, (state, { empresa }) => ({
    ...state,
    ...empresa,
  })),
  on(empresaActualizacionAction, (state, { empresa }) => {
    console.log(empresa);

    return ({
      ...state,
      ...{
        numero_identificacion: empresa.numero_identificacion,
        digito_verificacion: empresa.digito_verificacion,
        nombre_corto: empresa.nombre_corto,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        correo: empresa.correo,
        imagen: empresa.imagen,
        ciudad: empresa.ciudad,
        identificacion: empresa.identificacion
      },
    })
  }),
  on(empresaLimpiarAction, (state) => ({
    ...state,
    ...estadoInicializado
  }))
);
