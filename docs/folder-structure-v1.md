# Estructura de directorios v1

Te presento varias estructuras de directorios populares para aplicaciones backend con Node.js y TypeScript:

## 1. **Estructura por Capas (Layered Architecture)**

```
src/
├── controllers/
│   ├── user.controller.ts
│   └── auth.controller.ts
├── services/
│   ├── user.service.ts
│   └── auth.service.ts
├── repositories/
│   ├── user.repository.ts
│   └── auth.repository.ts
├── models/
│   ├── user.model.ts
│   └── auth.model.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── validation.middleware.ts
├── routes/
│   ├── user.routes.ts
│   └── auth.routes.ts
├── config/
│   ├── database.ts
│   └── env.ts
├── utils/
│   └── helpers.ts
└── app.ts
```

## 2. **Estructura por Módulos/Features (Domain-Driven)**

```
src/
├── modules/
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.model.ts
│   │   ├── user.routes.ts
│   │   ├── user.dto.ts
│   │   └── user.types.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.types.ts
│   └── products/
│       └── ...
├── shared/
│   ├── middlewares/
│   ├── utils/
│   ├── types/
│   └── config/
├── database/
│   ├── migrations/
│   └── seeders/
└── app.ts
```

## 3. **Arquitectura Hexagonal (Ports & Adapters)**

```
src/
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── repositories/
│   │   └── user.repository.interface.ts
│   └── services/
│       └── user.service.ts
├── application/
│   ├── use-cases/
│   │   ├── create-user.use-case.ts
│   │   └── get-user.use-case.ts
│   └── dto/
│       └── user.dto.ts
├── infrastructure/
│   ├── database/
│   │   ├── repositories/
│   │   │   └── user.repository.impl.ts
│   │   └── models/
│   │       └── user.model.ts
│   ├── http/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middlewares/
│   └── config/
├── shared/
│   ├── types/
│   └── utils/
└── app.ts
```

## 4. **Estructura Clean Architecture**

```
src/
├── core/
│   ├── entities/
│   ├── use-cases/
│   └── interfaces/
├── adapters/
│   ├── controllers/
│   ├── presenters/
│   └── gateways/
├── infrastructure/
│   ├── database/
│   ├── http/
│   └── external-services/
├── frameworks/
│   ├── web/
│   │   ├── express/
│   │   └── routes/
│   └── database/
│       └── typeorm/
└── config/
```

## 5. **Estructura MVC Clásica**

```
src/
├── models/
│   └── user.model.ts
├── views/
│   └── templates/
├── controllers/
│   └── user.controller.ts
├── routes/
│   └── index.ts
├── middlewares/
├── public/
│   ├── css/
│   └── js/
├── config/
└── app.ts
```

## 6. **Estructura Minimalista/Simple**

```
src/
├── api/
│   ├── users/
│   │   ├── index.ts
│   │   ├── handler.ts
│   │   └── schema.ts
│   └── auth/
│       └── ...
├── db/
│   ├── index.ts
│   └── models/
├── lib/
│   └── utils.ts
├── types/
│   └── index.ts
└── index.ts
```

## Recomendaciones:

- **Proyectos pequeños**: Opción 1 (Layered) o 6 (Minimalista)
- **Proyectos medianos**: Opción 2 (Por Módulos)
- **Proyectos grandes/enterprise**: Opción 3 (Hexagonal) o 4 (Clean Architecture)
- **APIs REST tradicionales**: Opción 1 o 5 (MVC)
- **Microservicios**: Opción 2 o 3
