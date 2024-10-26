export interface IResponseDownloadAlf {
  entry: IEntry;
}

export interface IEntry {
  filesAdded: number;
  bytesAdded: number;
  totalBytes: number;
  id: string;
  totalFiles: number;
  status: string;
}

export interface ISeguridadAlfResponse {
  codigo: string;
  mensaje: string;
  accessToken: string;
  uuidPlaneacion: string;
  uuidSeguimiento: string;
  uuidEvaluacion: string;
  uuidReporte: string;
  uuidConfiguracion: string;
  urlAlfresco: string;
  uuidDocApoyo: string;
  uuidAyuda: string;
  uuidNormatividad: string;
}

export interface IUploadDocAlfResponse {
  entry: IEntry;
}

export interface IEntry {
  isFile: boolean;
  createdByUser: IEdByUserUploadDocAlf;
  modifiedAt: string;
  nodeType: string;
  content: IContentUploadDocAlf;
  parentId: string;
  aspectNames: string[];
  createdAt: string;
  isFolder: boolean;
  modifiedByUser: IEdByUserUploadDocAlf;
  name: string;
  id: string;
  properties: IPropertiesUploadDocAlf;
}

export interface IContentUploadDocAlf {
  mimeType: string;
  mimeTypeName: string;
  sizeInBytes: number;
  encoding: string;
}

export interface IEdByUserUploadDocAlf {
  id: string;
  displayName: string;
}

export interface IPropertiesUploadDocAlf {
  'cm:versionLabel': string;
  'cm:versionType': string;
}
