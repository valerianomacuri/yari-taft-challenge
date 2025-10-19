// src/user/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  private userService = new UserService();

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.create(req.body);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error creating user',
      });
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.findAll();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
      });
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.findOne(req.params.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.update(req.params.id, req.body);
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error updating user',
      });
    }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.remove(req.params.id);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error deleting user',
      });
    }
  };
}
