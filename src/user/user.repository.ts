import { User } from './user.entity';

const users: User[] = [];

export class UserRepository {
  public async findAll(): Promise<User[]> {
    return users;
  }

  public async findById(id: string): Promise<User | null> {
    const user = users.find((u) => u.id === id);
    return user || null;
  }

  public async create(name: string, email: string): Promise<User> {
    const id = (users.length + 1).toString();
    const newUser = new User(id, name, email);
    users.push(newUser);
    return newUser;
  }
}
