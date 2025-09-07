# Stage 1: dependências PHP
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-plugins --no-scripts
COPY . .
RUN composer dump-autoload --optimize

# Stage 2: runtime nginx+php-fpm
FROM richarvey/nginx-php-fpm:1.7.2
ENV WEBROOT=/var/www/html/public \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr
# Copia tudo (inclusive vendor já pronto)
COPY --from=vendor /app /var/www/html
# (Opcional) seu nginx-site.conf custom
# COPY conf/nginx/nginx-site.conf /etc/nginx/sites-available/default
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --classmap-authoritative
CMD ["/start.sh"]
