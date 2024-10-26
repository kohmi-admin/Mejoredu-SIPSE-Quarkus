import { IItemCatalogoResponse } from "@common/interfaces/catalog.interface";

export interface FromModalI {
    id?: string;
    value?: string;
    onlyView?: boolean;
    catalogPadre: IItemCatalogoResponse;
    catalogHijo?: IItemCatalogoResponse;
}
