#!/bin/bash
# Iniciar PHP-FPM em segundo plano
php-fpm -D

# Executar script de deploy
echo "Executing deploy script..."
/var/www/html/scripts/00-laravel-deploy.sh

# Testar configuração do Nginx
nginx -t

# Iniciar Nginx em primeiro plano
nginx -g "daemon off;"
