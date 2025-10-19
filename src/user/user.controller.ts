import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public findAll = async (req: Request, res: Response) => {
    const users = await this.userService.findAll();
    res.json(users);
  };

  public findById = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.findById(req.params.id);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };

  public create = async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      const newUser = await this.userService.create(name, email);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
