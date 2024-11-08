import { EditableParameterType } from "@/types/EditableParameter";
import { Tower } from "@/typings";

export enum ChangeState {
    New = "new",
    Approved = "approved",
    Rejected = "rejected",
}

export type Change = {
    id: string;
    tower_id: string;
    user_id: string;
    state: ChangeState;
    note?: string;
    field: keyof Tower;
    type: EditableParameterType;
    old_value: any;
    new_value: any;
    created: number | Date;
};
