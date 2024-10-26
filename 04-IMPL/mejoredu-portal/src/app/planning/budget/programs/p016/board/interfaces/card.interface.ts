import { TypeCardEnum } from "../enums/type.enum";

export interface CardI {
    title: string;
    idNodo?: number;
    description: string;
    type: TypeCardEnum;
    isChild: boolean;
    cards: CardI[];
}
