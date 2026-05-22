
export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "contributor" | "maintainer";
    createdAt: Date;
    updatedAt: Date;
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