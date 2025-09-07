FROM richarvey/nginx-php-fpm:1.7.2

COPY . .

# Image config
ENV SKIP_COMPOSER=1 \
    RUN_SCRIPTS=1 \
    WEBROOT=/var/www/html/public \
    PHP_ERRORS_STDERR=1 \
    REAL_IP_HEADER=1 \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    COMPOSER_ALLOW_SUPERUSER=1

CMD ["/start.sh"]
