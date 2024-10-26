export interface ExpenseItemI {
  id?: number;
  nombrePartidaGasto?: string;
  idPartidaGasto: number;
  importe?: number;
  mesId: number;
  mes: string;
  clavePresupuestal: string;
  reduccion: boolean;
  ampleacion: boolean;
}
