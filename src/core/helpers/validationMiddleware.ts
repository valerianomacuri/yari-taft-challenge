import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer';

export const validationMiddleware = <T extends object>(
  dtoClass: ClassConstructor<T>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject: T = plainToInstance(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoObject);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error: ValidationError) => Object.values(error.constraints || {}))
        .flat();
      return res.status(400).json({ errors: errorMessages });
    }

    req.body = dtoObject;
    next();
  };
};
