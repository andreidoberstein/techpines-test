#!/usr/bin/env sh
set -e

cd /var/www/html

# Só ativa se habilitar por env
if [ "$SEED_ON_START" = "true" ]; then
  echo "[entrypoint] Running migrations..."
  php artisan migrate --force || true

  if [ ! -f storage/.seeded ]; then
    echo "[entrypoint] Running seed..."
    php artisan db:seed --force || true
    touch storage/.seeded
    chown application:application storage/.seeded || true
    echo "[entrypoint] Seed done."
  else
    echo "[entrypoint] Seed already done (storage/.seeded exists)."
  fi
else
  echo "[entrypoint] SEED_ON_START is not true — skipping seed."
fi

# Encaminha para o entrypoint original da imagem
if [ -x /entrypoint ]; then
  exec /entrypoint "$@"
elif [ -x /opt/docker/bin/entrypoint ]; then
  exec /opt/docker/bin/entrypoint "$@"
else
  exec "$@"
fi
