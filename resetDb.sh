docker compose -f docker-compose-postgres.yml stop
docker compose -f docker-compose-postgres.yml kill
docker compose -f docker-compose-postgres.yml rm -f
docker volume rm meet--me_postgres-data
docker compose -f docker-compose-postgres.yml up -d
docker compose -f docker-compose-postgres.yml logs -f
