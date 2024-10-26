import { CardI } from "./card.interface";

export interface ListI {
    id?: number;
    name?: string;
    idNodo?: number;
    description?: string;
    cards: CardI[];
}
