import type { IUserRepository } from "../user/user.interface";
import bcrypt from "bcrypt";

export class AuthService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async registerUser(name: string, email: string, password: string, role: "contributor" | "maintainer" = "contributor") {
        // Already Exists Check
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            return null;
        }
        // Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        return newUser;
    }

    public async loginUser(email: string, password: string) {
        // Find User
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            return null;
        }
        // remove password before returning
        const {password: _, ...userWithoutPassword} = user;
        return userWithoutPassword;
    }
}