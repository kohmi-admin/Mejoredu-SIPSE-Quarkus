export interface SwitchI {
  id: number;
  key: string;
  type: string;
  alta: {
    id: number;
    enable: boolean;
    value: boolean;
  };
  modificacion: {
    id: number;
    enable: boolean;
    value: boolean;
  };
  cancelacion: {
    id: number;
    enable: boolean;
    value: boolean;
  };
  ampliacion: {
    id: number;
    enable: boolean;
    value: boolean;
  };
  reduccion: {
    id: number;
    enable: boolean;
    value: boolean;
  };
  reintegro: {
    id: number;
    enable: boolean;
    value: boolean;
  };
  traspaso: {
    id: number;
    enable: boolean;
    value: boolean;
  };
}
