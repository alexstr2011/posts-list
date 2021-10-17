export type TUser = {
    id: number;
    name: string;
};

export type TUsers = Array<TUser>;

export type TPost = {
    userId: number;
    userName?: string;
    id: number;
    title: string;
    body: string;
};

export type TPosts = Array<TPost>;

export enum TableSortColumnEnum {
    USER_NAME = 'userName',
    TITLE = 'title',
    BODY = 'body'
};

export type TTableSort = {
    column: TableSortColumnEnum,
    asc: boolean
};
