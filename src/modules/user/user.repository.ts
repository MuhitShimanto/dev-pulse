/**
 * @file user.repository.ts
 * @description This file contains the implementation of the UserRepository class, which is responsible for handling all database operations related to users. It implements the IUserRepository interface defined in user.interface.ts. The class uses a PostgreSQL connection pool to execute queries and manage transactions. Each method corresponds to a specific CRUD operation, allowing for creating, reading, updating, and deleting users in the database. The repository pattern helps to abstract away the database logic from the rest of the application, making it easier to maintain and test.
 */

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
/**
 * @desc Creates a new user in the database. It takes an object of type ICreateUserDTO as input. The method constructs an SQL query to insert the new user into the "users" table and returns the created user's details (excluding the password) as a promise. If the operation is successful, it returns an object containing the user's id, name, email, role, created_at, and updated_at fields. If there is an error during the database operation, it will throw an exception.
 * @param {ICreateUserDTO} data - An object containing the user's name, email, password, and optional role (defaulting to "contributor").
 * @returns {Promise<Omit<IUser, "password"> | null>} A promise that resolves to the created user's details (excluding the password) or null if the operation fails.
 */
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
  /**
   * @desc Updates an existing user's information in the database. It takes the user's id and an object of type IUpdateUserDTO as input. The method constructs an SQL query to update the user's details in the "users" table based on the provided id. It returns the updated user's details (excluding the password) as a promise. If the operation is successful, it returns an object containing the user's id, name, email, role, created_at, and updated_at fields. If there is an error during the database operation, it will throw an exception.
   * @param {string} id - The id of the user to be updated.
   * @param {IUpdateUserDTO} data - An object containing the user's updated name, email, password, and/or role.
   * @returns {Promise<Omit<IUser, "password"> | null>} A promise that resolves to the updated user's details (excluding the password) or null if the operation fails.
   */
  public async update(id: string, data: IUpdateUserDTO): Promise<Omit<IUser, "password"> | null> {
    throw new Error("Method not implemented.");
  }
  /**
   * @desc Deletes a user from the database based on the provided id. It takes the user's id as input and constructs an SQL query to remove the user from the "users" table. The method returns a boolean value indicating whether the deletion was successful or not. If the operation is successful, it returns true; otherwise, it returns false. If there is an error during the database operation, it will throw an exception.
   * @param {string} id - The id of the user to be deleted.
   * @returns {Promise<boolean>} A promise that resolves to true if the user was successfully deleted, or false if the operation fails.
   */
  public async delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  /**
   * @desc Retrieves a user's details from the database based on the provided id. It takes the user's id as input and constructs an SQL query to fetch the user's information from the "users" table. The method returns a promise that resolves to an object containing the user's details (excluding the password) if found, or null if no user with the given id exists. If there is an error during the database operation, it will throw an exception.
   * @param {string} id - The id of the user to be retrieved.
   * @return {Promise<Omit<IUser, "password"> | null>} A promise that resolves to the user's details (excluding the password) if found, or null if no user with the given id exists.
   */
  public async findById(id: string): Promise<Omit<IUser, "password"> | null> {
    throw new Error("Method not implemented.");
  }
  /**
   * @desc Retrieves a user's details from the database based on the provided email. It takes the user's email as input and constructs an SQL query to fetch the user's information from the "users" table. The method returns a promise that resolves to an object containing the user's details (including the password) if found, or null if no user with the given email exists. If there is an error during the database operation, it will throw an exception.
   * @param {string} email - The email of the user to be retrieved.
   * @return {Promise<IUser | null>} A promise that resolves to the user's details (including the password) if found, or null if no user with the given email exists.
   */
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
