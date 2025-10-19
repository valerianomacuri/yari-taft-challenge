import { Router } from 'express';

interface Routes {
  path: string;
  router: Router;
}

export const registerRoutes = (...routes: Routes[]) => {
  if (routes.length === 0)
    throw new Error(
      'No routes were provided to registerRoutes. At least one route must be passed.',
    );

  const mainRouter = Router();

  routes.forEach(({ path, router }) => {
    mainRouter.use(path, router);
  });

  return mainRouter;
};
