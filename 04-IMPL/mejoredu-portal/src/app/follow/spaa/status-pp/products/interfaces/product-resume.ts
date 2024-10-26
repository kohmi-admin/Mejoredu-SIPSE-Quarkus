export interface ProductResumeI {
    productId: number;
    product: string;
    categoria: string;
    tipo: string;
    noDeEntregablesProgramados: number;
    noDeEntregablesAlcanzados: number;
    estatusDelProducto: string;
    revisadoPorLa3de: string;
    fechaDeSesion: string;
    aprobadoPorLa3de: string;
    fechaDeAprobacion: string;
    publicacion: string;
    tipoDePublicacion: string;
    difusion: string;
}