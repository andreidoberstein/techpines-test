# ---- Stage 1: dependências PHP (Composer) ----
FROM composer:2 AS vendor
WORKDIR /app

# Copia tudo (usa .dockerignore pra não mandar node_modules/vendor locais)
COPY . .

# Agora o artisan já existe, então os scripts do Composer podem rodar
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress \
    --optimize-autoloader --classmap-authoritative


# ---- Stage 2: runtime nginx+php-fpm ----
FROM richarvey/nginx-php-fpm:1.7.2
ENV WEBROOT=/var/www/html/public \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr

# Copia tudo (já com vendor) do stage 1
COPY --from=vendor /app /var/www/html

# (Opcional) use seu Nginx conf:
# COPY conf/nginx/nginx-site.conf /etc/nginx/conf.d/default.conf

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

CMD ["/start.sh"]
