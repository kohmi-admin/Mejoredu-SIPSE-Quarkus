export interface IRolesResponse {
  idTipoUsuario: number;
  cdtipoUsuario: string;
  csEstatus:     string;
  idBitacora:    number;
}

export interface IRolePayload {
  cdtipoUsuario: string;
  csEstatus:     string;
  idBitacora:    number;
}
