export interface Empresa {
  empresa_id: number;
  id: number;
  imagen: string | null;
  nombre: string | null;
  subdominio: string;
  usuario_id: number;
  seleccion?: boolean
  rol: string
}


export interface EmpresaLista {
  empresas: Empresa[];
}

export interface EmpresaInvitacion {
  empresa_id: string;
  usuario_id: string;
  invitado: string;
}

export interface EmpresaUsuariosInvicionAceptada extends Omit<Empresa, 'subdominio' | 'imagen' | 'seleccion'>{
  username: string
}
