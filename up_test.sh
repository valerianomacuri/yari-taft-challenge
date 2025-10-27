docker-compose -f docker-compose.test.yml down -v && docker-compose --env-file .env.test -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from node-app-test
