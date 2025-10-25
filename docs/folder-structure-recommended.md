Aquí te propongo una estructura mejorada y más escalable:

## **Estructura Mejorada:**

```
proyecto/
├── src/
│   ├── modules/                      # Módulos por dominio
│   │   ├── user/
│   │   │   ├── application/          # Casos de uso
│   │   │   │   ├── create-user.use-case.ts
│   │   │   │   ├── get-user.use-case.ts
│   │   │   │   └── update-user.use-case.ts
│   │   │   ├── domain/               # Entidades y lógica de negocio
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   └── user.types.ts
│   │   │   ├── infrastructure/       # Implementaciones técnicas
│   │   │   │   ├── user.repository.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   └── user.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   └── pokemon/                  # Otro módulo (ejemplo futuro)
│   │       ├── application/
│   │       ├── domain/
│   │       └── infrastructure/
│   │
│   ├── shared/                       # Código compartido
│   │   ├── config/                   # Configuraciones
│   │   │   ├── env.config.ts
│   │   │   └── app.config.ts
│   │   ├── database/                 # Base de datos
│   │   │   ├── postgres.datasource.ts
│   │   │   └── database.module.ts
│   │   ├── clients/                  # Clientes externos
│   │   │   └── pokemon.client.ts
│   │   ├── middleware/               # Middlewares
│   │   │   ├── error-handler.ts
│   │   │   ├── logger.ts
│   │   │   └── validation.ts
│   │   ├── utils/                    # Utilidades
│   │   │   ├── response.util.ts
│   │   │   └── crypto.util.ts
│   │   ├── interfaces/               # Interfaces globales
│   │   │   └── api-response.interface.ts
│   │   └── constants/                # Constantes
│   │       └── http-status.ts
│   │
│   ├── core/                         # Core de la aplicación
│   │   ├── server.ts                 # Configuración del servidor
│   │   └── app.ts                    # Bootstrap de la app
│   │
│   └── index.ts                      # Entry point
│
├── migrations/                       # Migraciones de BD
│   └── 1761412042713-CreateUsersTable.ts
│
├── tests/                            # Tests
│   ├── integration/
│   │   └── user/
│   │       └── user.routes.test.ts
│   ├── unit/
│   │   └── user/
│   │       ├── user.service.test.ts
│   │       └── user.repository.test.ts
│   └── helpers/
│       ├── api-client.ts
│       └── test-database.ts
│
├── docs/                             # Documentación
│   ├── api/
│   └── architecture.md
│
├── scripts/                          # Scripts útiles
│   ├── wait-for-db.js
│   └── seed-database.ts
│
├── .env.example
├── .env
├── .env.test
├── .gitignore
├── docker-compose.yml
├── docker-compose.test.yml
├── Dockerfile
├── Dockerfile.dev
├── tsconfig.json
├── jest.config.ts
├── eslint.config.js
└── package.json
```

## **Estructura Alternativa (Clean Architecture):**

```
proyecto/
├── src/
│   ├── modules/
│   │   └── user/
│   │       ├── dto/                  # Data Transfer Objects
│   │       │   ├── create-user.dto.ts
│   │       │   ├── update-user.dto.ts
│   │       │   └── user-response.dto.ts
│   │       ├── entities/
│   │       │   └── user.entity.ts
│   │       ├── repositories/
│   │       │   ├── user.repository.interface.ts
│   │       │   └── user.repository.ts
│   │       ├── services/
│   │       │   └── user.service.ts
│   │       ├── controllers/
│   │       │   └── user.controller.ts
│   │       ├── routes/
│   │       │   └── user.routes.ts
│   │       └── validators/
│   │           └── user.validator.ts
│   │
│   ├── common/                       # Código común
│   │   ├── config/
│   │   ├── database/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   ├── pipes/
│   │   └── utils/
│   │
│   ├── core/
│   │   ├── server.ts
│   │   └── app.ts
│   │
│   └── main.ts
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── factories/
│
├── test/
│   ├── e2e/
│   ├── integration/
│   ├── unit/
│   └── fixtures/
│
└── ...config files
```

## **Estructura Simple y Práctica (Recomendada para tu proyecto):**

```
proyecto/
├── src/
│   ├── modules/
│   │   └── user/
│   │       ├── user.entity.ts
│   │       ├── user.dto.ts
│   │       ├── user.service.ts
│   │       ├── user.repository.ts
│   │       ├── user.controller.ts
│   │       ├── user.routes.ts
│   │       ├── user.validator.ts
│   │       └── index.ts
│   │
│   ├── config/
│   │   ├── env.config.ts
│   │   ├── database.config.ts
│   │   └── swagger.config.ts
│   │
│   ├── database/
│   │   ├── datasource.ts
│   │   └── migrations/
│   │       └── 1761412042713-CreateUsersTable.ts
│   │
│   ├── clients/
│   │   └── pokemon.client.ts
│   │
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── utils/
│   │   ├── response.util.ts
│   │   ├── crypto.util.ts
│   │   └── logger.util.ts
│   │
│   ├── types/
│   │   ├── express.d.ts
│   │   └── global.d.ts
│   │
│   ├── server.ts
│   └── index.ts
│
├── tests/
│   ├── integration/
│   │   └── user.test.ts
│   ├── unit/
│   │   └── user.service.test.ts
│   └── helpers/
│       ├── api-client.ts
│       └── setup.ts
│
├── scripts/
│   └── wait-for-db.js
│
├── docs/
│
├── .env
├── .env.example
├── .env.test
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── tsconfig.json
├── jest.config.ts
└── package.json
```

## **Cambios específicos que debes hacer:**

### **1. Mover archivos:**

```bash
# Crear nueva estructura
mkdir -p src/modules/user
mkdir -p src/config
mkdir -p src/database/migrations
mkdir -p src/clients
mkdir -p src/middleware
mkdir -p src/utils
mkdir -p src/types
mkdir -p tests/integration
mkdir -p tests/unit
mkdir -p tests/helpers

# Mover archivos de user
mv src/user/*.ts src/modules/user/

# Mover configuraciones
mv src/core/envs/ src/config/

# Mover migraciones
mv migrations/* src/database/migrations/

# Mover clientes
mv src/clients/*.ts src/clients/

# Mover tests
mv src/tests/ tests/
```

### **2. Actualizar imports:**

**`src/modules/user/user.routes.ts`:**
```typescript
import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

// Antes: import { PostgresDataSource } from '../core/db/postgres';
// Ahora:
import { PostgresDataSource } from '../../database/datasource';
```

### **3. Crear barrels (index.ts):**

**`src/modules/user/index.ts`:**
```typescript
export * from './user.entity';
export * from './user.dto';
export * from './user.service';
export * from './user.repository';
export * from './user.controller';
export * from './user.routes';
```

**`src/config/index.ts`:**
```typescript
export * from './env.config';
export * from './database.config';
```

### **4. Actualizar tsconfig.json:**

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@modules/*": ["src/modules/*"],
      "@config/*": ["src/config/*"],
      "@database/*": ["src/database/*"],
      "@clients/*": ["src/clients/*"],
      "@middleware/*": ["src/middleware/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

Ahora puedes importar así:
```typescript
import { UserService } from '@modules/user';
import { envConfig } from '@config/env.config';
import { PostgresDataSource } from '@database/datasource';
```

### **5. Actualizar package.json scripts:**

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/index.ts",
    "build": "tsc",
    "start": "node -r tsconfig-paths/register dist/index.js"
  }
}
```

**Instalar:**
```bash
npm install --save-dev tsconfig-paths
```

Esta estructura es más escalable, mantenible y sigue las mejores prácticas de arquitectura! 🚀
