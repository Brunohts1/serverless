export interface IUserRequest {
    name: string,
    email: string,
    password: string,
}

export type IUserResponse = Omit<IUserRequest, 'password'>