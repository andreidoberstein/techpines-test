#!/usr/bin/env sh
set -e
cd /var/www/html

# usa envs atuais
php artisan config:clear || true
php artisan config:cache

# espera DB
MAX_RETRIES="${DB_WAIT_RETRIES:-30}"
SLEEP_BETWEEN="${DB_WAIT_SLEEP:-2}"
i=1
until php artisan migrate:status >/dev/null 2>&1; do
  echo "[entrypoint] waiting for database... ($i/$MAX_RETRIES)"
  [ "$i" -ge "$MAX_RETRIES" ] && echo "[entrypoint] DB not ready, aborting." && exit 1
  i=$((i+1))
  sleep "$SLEEP_BETWEEN"
done
echo "[entrypoint] DB is reachable."

# migra sempre
php artisan migrate --force

# seed opcional (só 1x)
if [ "$SEED_ON_START" = "true" ] && [ ! -f storage/.seeded ]; then
  echo "[entrypoint] Running seed..."
  php artisan migrate:fresh --force
  php artisan db:seed --force
  touch storage/.seeded
  chown application:application storage/.seeded || true
  echo "[entrypoint] Seed done."
else
  echo "[entrypoint] Skipping seed (SEED_ON_START!=true or already seeded)."
fi

# delega pro entrypoint original da imagem, sempre com argumento padrão
if [ -x /opt/docker/bin/entrypoint ]; then
  [ $# -eq 0 ] && set -- supervisord
  exec /opt/docker/bin/entrypoint "$@"
elif [ -x /entrypoint ]; then
  [ $# -eq 0 ] && set -- supervisord
  exec /entrypoint "$@"
fi

# fallback
[ $# -eq 0 ] && set -- supervisord
exec "$@"
