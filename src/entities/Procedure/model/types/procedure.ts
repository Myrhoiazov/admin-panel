import { ProcedureBlockType } from "../consts/procedureConsts";

export interface ProcedureBlockBase {
    id?: string;
    type: ProcedureBlockType;
    items?: string[];
}

export interface ProcedurePrice {
    zone: string;
    price: string;
}

export interface ProcedureBlockPrice extends ProcedureBlockBase {
    type: ProcedureBlockType.PRICE;
    blocks: ProcedurePrice[];
}

export interface ProcedureBlockResult extends ProcedureBlockBase {
    type: ProcedureBlockType.RESULT;
    blocks: string[];
}
export interface ProcedureBlockInjection extends ProcedureBlockBase {
    type: ProcedureBlockType.INJECTION;
    blocks: string[];
}
export interface ProcedureBlockPreparation extends ProcedureBlockBase {
    type: ProcedureBlockType.PREPARATION;
    blocks: string[];
}
export interface ProcedureBlockContraindication extends ProcedureBlockBase {
    type: ProcedureBlockType.CONTRAINDICATION;
    blocks: string[];
}
export interface ProcedureBlockRehabilitation extends ProcedureBlockBase {
    type: ProcedureBlockType.REHABILITATION;
    blocks: string[];
}

export type ProcedureBlock =
    | ProcedureBlockPrice
    | ProcedureBlockResult
    | ProcedureBlockInjection
    | ProcedureBlockPreparation
    | ProcedureBlockContraindication
    | ProcedureBlockRehabilitation

export interface Procedure {
    id?: string;
    name?: string;
    description?: string;
    image?: File | File[] | string;
    createdAt?: string;
    blocks?: Record<string, ProcedureBlock>;
}