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

  // ==================== POKEMON ENDPOINTS ====================

  setFavoritePokemon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { pokemonNameOrId } = req.body;
      const result = await this.userService.setFavoritePokemon(
        req.params.id,
        pokemonNameOrId,
      );

      res.status(200).json({
        success: true,
        message: 'Favorite pokemon set successfully',
        data: {
          user: result.user,
          pokemon: result.pokemon,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Error setting favorite pokemon',
      });
    }
  };

  getFavoritePokemon = async (req: Request, res: Response): Promise<void> => {
    try {
      const pokemon = await this.userService.getFavoritePokemon(req.params.id);

      if (!pokemon) {
        res.status(404).json({
          success: false,
          message: 'User has no favorite pokemon',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: pokemon,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching favorite pokemon',
      });
    }
  };

  addPokemonToTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { pokemonNameOrId } = req.body;
      const result = await this.userService.addPokemonToTeam(
        req.params.id,
        pokemonNameOrId,
      );

      res.status(200).json({
        success: true,
        message: 'Pokemon added to team',
        data: {
          user: result.user,
          pokemon: result.pokemon,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Error adding pokemon to team',
      });
    }
  };

  removePokemonFromTeam = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { pokemonNameOrId } = req.params;
      const user = await this.userService.removePokemonFromTeam(
        req.params.id,
        pokemonNameOrId,
      );

      res.status(200).json({
        success: true,
        message: 'Pokemon removed from team',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Error removing pokemon from team',
      });
    }
  };

  getPokemonTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const team = await this.userService.getPokemonTeam(req.params.id);

      res.status(200).json({
        success: true,
        data: team,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching pokemon team',
      });
    }
  };

  setPokemonTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { pokemonIds } = req.body;
      const user = await this.userService.setPokemonTeam(
        req.params.id,
        pokemonIds,
      );

      res.status(200).json({
        success: true,
        message: 'Pokemon team set successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Error setting pokemon team',
      });
    }
  };

  assignRandomPokemon = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.userService.assignRandomPokemon(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Random pokemon assigned',
        data: {
          user: result.user,
          pokemon: result.pokemon,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Error assigning random pokemon',
      });
    }
  };

  /**
   * GET /users/stats
   */
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.userService.getStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching stats',
      });
    }
  };

  /**
   * GET /users/search?query=ash
   */
  searchByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.query as string;
      if (!query) {
        res.status(400).json({
          success: false,
          message: 'Query parameter is required',
        });
        return;
      }

      const users = await this.userService.searchByName(query);
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching users',
      });
    }
  };

  /**
   * POST /users/{id}/deactivate
   */
  deactivate = async (req: Request, res: Response): Promise<void> => {
    try {
      const success = await this.userService.deactivate(req.params.id);
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deactivating user',
      });
    }
  };

  /**
   * POST /users/{id}/activate
   */
  activate = async (req: Request, res: Response): Promise<void> => {
    try {
      const success = await this.userService.activate(req.params.id);
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User activated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error activating user',
      });
    }
  };
}
