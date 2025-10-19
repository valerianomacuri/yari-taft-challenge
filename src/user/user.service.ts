import { User } from './user.entity';
import { UserRepository } from './user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public async create(name: string, email: string): Promise<User> {
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    return this.userRepository.create(name, email);
  }
}
