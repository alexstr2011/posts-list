export type TUser = {
    id: number;
    name: string;
};

export type TUsers = Array<TUser>;

export type TPost = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

export type TPosts = Array<TPost>;
