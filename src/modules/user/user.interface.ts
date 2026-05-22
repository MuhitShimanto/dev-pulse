/**
 * @file user.interface.ts
 * @description This file defines the IUser interface and related DTOs for user management in the application. It also includes the IUserRepository interface for data access operations related to users.
 */


export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "contributor" | "maintainer";
    created_at: Date;
    updated_at: Date;
}

export interface ICreateUserDTO {
    name: string;
    email: string;
    password: string;
    role?: "contributor" | "maintainer";
}

export interface IUpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
    role?: "contributor" | "maintainer";
}

export interface IUserRepository {
  findById(id: string): Promise<Omit<IUser, "password"> | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: ICreateUserDTO): Promise<Omit<IUser, "password"> | null>;
  update(id: string, data: IUpdateUserDTO): Promise<Omit<IUser, "password"> | null>;
  delete(id: string): Promise<boolean>;
}