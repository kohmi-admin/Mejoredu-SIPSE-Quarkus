export enum MODIFICATION_TYPE {
  alta = 2209,
  modificacion = 2210,
  cancelacion = 2211,
  ampliacion = 2212,
  reduccion = 2213,
  reintegro = 2214,
  traspaso = 2215,
}

export const MODIFICATION_TYPE_ABBREVIATION = {
  alta: {
    status: 2209,
    abreviation: 'Al',
  },
  modificacion: {
    status: 2210,
    abreviation: 'Mo',
  },
  cancelacion: {
    status: 2211,
    abreviation: 'Ca',
  },
  ampliacion: {
    status: 2212,
    abreviation: 'Am',
  },
  reduccion: {
    status: 2213,
    abreviation: 'Re',
  },
  reintegro: {
    status: 2214,
    abreviation: 'Rei',
  },
  traspaso: {
    status: 2215,
    abreviation: 'tr',
  },
};
