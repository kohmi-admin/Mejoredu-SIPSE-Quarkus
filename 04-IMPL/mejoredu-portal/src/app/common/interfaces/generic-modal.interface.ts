export interface IGenericmodalInterface {
  title: string;
  text: string;
  listText: string[];
  link: ILinkGenModalInterface;
  labelBtnPrimary: string;
}

export interface ILinkGenModalInterface {
  text: string;
  linkText: string;
  isAlfresco: false,
  sourceFile: string;
  fileName: string;
  uuid: string;
}
