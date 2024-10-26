import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IResponseDownloadAlf,
  ISeguridadAlfResponse,
  IUploadDocAlfResponse,
} from '@common/interfaces/alfresco.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalFunctionsService } from './global-functions.service';
import * as SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root',
})
export class AlfrescoService {
  ls = new SecureLS({ encodingType: 'aes' });

  constructor(
    private http: HttpClient,
    private globalFuntions: GlobalFunctionsService
  ) { }

  getHostAlf() {
    const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
    return dataAlf.urlAlfresco;
  }

  getHeaders() {
    const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
    return new HttpHeaders({
      authorization: `Basic ${dataAlf.accessToken}`,
    });
  }

  loginAlfService() {
    const baseUrl = `${environment.endpoints.auth.host}${environment.endpoints.auth.authAlfresco}`;
    return this.http.get<any>(baseUrl);
  }

  /**
   * @param uidContenedor: dea8c685-9b49-427b-a459-fba02c26a153
   * @param skipCount: 0
   * @param maxItems: 100
   */
  getFilesAlfService({
    maxItems,
    skipCount,
    uidContenedor,
  }: {
    uidContenedor: string;
    skipCount: string;
    maxItems: string;
  }): Observable<any> {
    const headers = this.getHeaders().set('accept', 'application/json');
    const path = environment.endpoints.alfresco.getAllDocuments
      .replace(':uidContenedor', uidContenedor)
      .replace(':skipCount', skipCount)
      .replace(':maxItems', maxItems);
    const baseUrl = `${this.getHostAlf()}${path}`;
    return this.http.get<any>(baseUrl, { headers });
  }

  deleteFileAlfService(uid: string): Observable<any> {
    const headers = this.getHeaders().set('accept', 'application/json');
    const path = environment.endpoints.alfresco.deleteFile.replace(':uid', uid);
    const baseUrl = `${this.getHostAlf()}${path}`;
    return this.http.delete<any>(baseUrl, { headers });
  }

  viewOrDownloadFileAlfService({
    action,
    uid,
    fileName,
    withB64,
    withBlob,
  }: {
    uid: string;
    action: 'download' | 'viewer';
    fileName?: string;
    withBlob?: boolean;
    withB64?: boolean;
  }): Promise<{ status: string; urlFile?: string; b64?: string; blob?: any }> {
    return new Promise<{
      status: string;
      urlFile?: string;
      b64?: string;
      blob?: any;
    }>((resolve, reject) => {
      const dataAlf: ISeguridadAlfResponse = this.ls.get('dataAlf');
      const path = environment.endpoints.alfresco.viewOrDownloadFile.replace(
        ':uid',
        uid
      );
      const baseUrl = `${this.getHostAlf()}${path}`;
      fetch(baseUrl, {
        method: 'GET',
        headers: {
          authorization: `Basic ${dataAlf.accessToken}`,
          accept: 'application/octet-stream',
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            throw response;
          }
        })
        .then(async (blob: Blob) => {
          const adicionalData: { b64?: string; blob?: any } = {};
          if (withB64)
            adicionalData.b64 = await this.globalFuntions.blobToB64(blob);
          if (withBlob) adicionalData.blob = blob;
          if (action === 'download') {
            this.globalFuntions.downloadBlob(
              blob,
              fileName ?? `File-${new Date()}`
            );
            resolve({ status: 'ok', ...adicionalData });
          } else {
            const urlFile = URL.createObjectURL(blob);
            resolve({ status: 'ok', urlFile, ...adicionalData });
          }
        })
        .catch((err) => reject(err));
    });
  }

  /**
   * @param uidContenedor: dea8c685-9b49-427b-a459-fba02c26a153
   * @param file
   */
  uploadFileAlfService(
    uidContenedor: string,
    file: any,
    overwrite: boolean = false
  ) {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('filedata', file);
    formData.append('autoRename', `${!overwrite}`);
    formData.append('overwrite', `${overwrite}`);
    const path = environment.endpoints.alfresco.uploadFile.replace(
      ':uidContenedor',
      uidContenedor
    );
    const baseUrl = `${this.getHostAlf()}${path}`;
    return this.http.post<IUploadDocAlfResponse>(baseUrl, formData, {
      headers,
    });
  }

  uploadFileToAlfrescoPromise(
    uuidToSave: string,
    file: any,
    overwrite: boolean = false
  ) {
    return new Promise<string>((resolve, reject) => {
      this.uploadFileAlfService(uuidToSave, file, overwrite).subscribe({
        next: (value) => {
          resolve(value.entry.id);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  downloadMultipleFilesAlfService(uids: string[], fileName?: string) {
    return new Promise<any>((resolve, reject) => {
      this.requestDownloadFilesAlfService(uids).subscribe({
        next: async (value: IResponseDownloadAlf) => {
          const respStatus = await this.askUntilStatusSuccessAlfService(
            value.entry.id
          );
          if (respStatus.entry.status === 'DONE') {
            this.viewOrDownloadFileAlfService({
              action: 'download',
              // action: "viewer",
              uid: value.entry.id,
              fileName: `${fileName ?? 'Archivos-' + new Date()}.zip`,
            })
              .then((response) => {
                resolve(response);
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            reject(value);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  askUntilStatusSuccessAlfService(uid: string) {
    return new Promise<IResponseDownloadAlf>((resolve, reject) => {
      this.statusDownloadFilesAlfService(uid).subscribe({
        next: (value: IResponseDownloadAlf) => {
          if (
            value.entry.status === 'PENDING' ||
            value.entry.status === 'IN_PROGRESS'
          ) {
            setTimeout(async () => {
              const respawa = await this.askUntilStatusSuccessAlfService(uid);
              resolve(respawa);
            }, environment?.timeReRequestDownloadStatus || 2000);
          } else if (value.entry.status === 'DONE') {
            resolve(value);
          } else {
            reject(value);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  requestDownloadFilesAlfService(nodeIds: string[]) {
    const headers = this.getHeaders();
    const path = environment.endpoints.alfresco.requestDownloadFiles;
    const baseUrl = `${this.getHostAlf()}${path}`;
    return this.http.post<any>(
      baseUrl,
      {
        nodeIds,
      },
      { headers }
    );
  }

  statusDownloadFilesAlfService(uid: string) {
    const headers = this.getHeaders();
    const path = environment.endpoints.alfresco.statusDownloadFiles.replace(
      ':uid',
      uid
    );
    const baseUrl = `${this.getHostAlf()}${path}`;
    return this.http.get<any>(baseUrl, { headers });
  }
}
