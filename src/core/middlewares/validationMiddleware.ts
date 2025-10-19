import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer';

export interface ValidationOptions {
  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
}

export const validationMiddleware = <T extends object>(
  dtoClass: ClassConstructor<T>,
  source: 'body' | 'query' | 'params' = 'body',
  options: ValidationOptions = {},
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[source];

      const dtoObject: T = plainToInstance(dtoClass, dataToValidate, {
        excludeExtraneousValues: options.whitelist,
      });

      const errors: ValidationError[] = await validate(dtoObject, {
        skipMissingProperties: options.skipMissingProperties ?? false,
        whitelist: options.whitelist ?? true,
        forbidNonWhitelisted: options.forbidNonWhitelisted ?? false,
      });

      if (errors.length > 0) {
        const errorMessages = errors.map((error: ValidationError) => ({
          property: error.property,
          constraints: Object.values(error.constraints || {}),
          value: error.value,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages,
        });
      }

      req[source] = dtoObject;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Validation error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
};
