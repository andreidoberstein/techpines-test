#!/usr/bin/env bash
echo "Running composer"
composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

echo "Generating application key..."
php artisan key:generate --show

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Running seeds..."
php artisan db:seed --force
