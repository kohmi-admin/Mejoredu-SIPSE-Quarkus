import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalFunctionsService {
  blobToB64(blob: any) {
    return new Promise<string>((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        let base64String: any = reader.result ?? '';
        resolve(base64String.substring(base64String.indexOf(', ') + 1));
      };
      reader.onerror = (error: any) => reject(error);
    });
  }

  downloadBlob(blob: any, fileName: string) {
    const link = window.document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  fileToBlob(file: File) {
    return new Blob([file], { type: file.type });
  }

  downloadInputFile(file: File) {
    const newBlob = this.fileToBlob(file);
    this.downloadBlob(newBlob, file.name);
  }
}
