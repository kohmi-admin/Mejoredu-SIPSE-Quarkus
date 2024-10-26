export interface ExpensiveResumeI {
    partidaId: number;
    partida?: string;
    claveReduccion: string;
    importeReduccion?: number;
    mesReduccion: string;
    mesIdReduccion: number;
    claveAmpleacion: string;
    importeAmpleacion?: number;
    mesAmpleacion: string;
    mesIdAmpleacion: number;
    importeNeto?: number;
}
