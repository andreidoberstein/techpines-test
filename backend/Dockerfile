# ---- Stage 1: dependências (Composer) ----
FROM composer:2 AS vendor
WORKDIR /app

# opção mais cacheável: instala deps sem scripts primeiro
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress \
    --optimize-autoloader --classmap-authoritative --no-scripts

# agora copia o projeto todo (inclui artisan)
COPY . .

# roda autoload + scripts (ex.: package:discover)
RUN composer dump-autoload --optimize

# ---- Stage 2: runtime (Nginx + PHP 8.x) ----
FROM webdevops/php-nginx:8.3-alpine   # >> runtime PHP 8.3 com nginx
ENV WEB_DOCUMENT_ROOT=/var/www/html/public \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr

WORKDIR /var/www/html
COPY --from=vendor /app /var/www/html

# permissões para cache/storage
RUN chown -R application:application storage bootstrap/cache

# healthcheck direto no Nginx (não passa pelo PHP)
RUN printf 'location = /health { access_log off; add_header Content-Type text/plain; return 200 "OK"; }\n' \
    > /opt/docker/etc/nginx/vhost.common.d/zz-health.conf

# prontos! a imagem já inicia com nginx+php-fpm
