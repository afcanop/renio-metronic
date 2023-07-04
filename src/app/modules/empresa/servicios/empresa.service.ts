import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { chackRequiereToken } from '../../../interceptores/token.interceptor';
import { Empresa } from '@interfaces/usuario/empresa';
import { getCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  constructor(private http: HttpClient) {}

  lista(codigoUsuario: string) {
    return this.http.get<Empresa[]>(
      `${environment.URL_API_MUUP}/seguridad/usuario/empresa/${codigoUsuario}/`
    );
  }

  nuevo(data: any, codigoUsuario: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/seguridad/empresa/nuevo/`,
      {
        nombre: data.nombre,
        subdominio: data.subdominio,
        usuario: codigoUsuario,
        imagen:
          'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
      }
      // {
      //   context: chackRequiereToken(),
      // }
    );
  }

  detalle(codigoEmpresa: string){
    return this.http.get(
      `${environment.URL_API_MUUP}/inquilino/empresa/${codigoEmpresa}`
    )
  }

  consultarNombre(subdominio: string) {
    return this.http.post<{ validar: boolean }>(
      `${environment.URL_API_MUUP}/inquilino/empresa/validar/`,
      {
        subdominio,
      }
    );
  }

  obtenerToken() {
    const refreshToken = getCookie('empresa')
    if (!refreshToken) {
      return false;
    }
    return refreshToken;
  }

  validarToken(){
    const token = this.obtenerToken();
    if (!token) {
      return false;
    }
    const tokenDecodificado =  jwt_decode<JwtPayload>(token);
    if(tokenDecodificado && tokenDecodificado?.exp){
      const tokenFecha = new Date(0)
      const fechaActual = new Date()
      tokenFecha.setUTCSeconds(tokenDecodificado.exp)

      return tokenFecha.getTime() > fechaActual.getTime()
    }
    return false
  }
}
