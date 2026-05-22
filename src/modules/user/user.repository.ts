import type { Pool } from "pg";
import type {
  ICreateUserDTO,
  IUpdateUserDTO,
  IUser,
  IUserRepository,
} from "./user.interface";

export class UserRepository implements IUserRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async create(data: ICreateUserDTO): Promise<Omit<IUser, "password"> | null> {
    const query = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at, updated_at
    `;
    const values = [
      data.name,
      data.email,
      data.password,
      data.role || "contributor",
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0] as Omit<IUser, "password"> | null;
  }
  public async update(id: string, data: IUpdateUserDTO): Promise<Omit<IUser, "password"> | null> {
    throw new Error("Method not implemented.");
  }
  public async delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public async findById(id: string): Promise<Omit<IUser, "password"> | null> {
    throw new Error("Method not implemented.");
  }
  public async findByEmail(email: string): Promise<IUser | null> {
    const query = `
        SELECT *
        FROM users
        WHERE email = $1
    `;
    const result = await this.pool.query(query, [email]);
    return result.rows[0] as IUser | null;
  }
}
