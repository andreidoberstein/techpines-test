# Usar uma imagem base com PHP-FPM e Nginx
FROM php:8.3-fpm

# Instalar dependências e Nginx
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev nginx \
 && docker-php-ext-install pdo pdo_pgsql zip \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos do projeto
COPY . .

# Configurar permissões básicas
RUN chown -R www-data:www-data storage bootstrap/cache

# Copiar configuração do Nginx (ajustado para o caminho correto)
COPY ./docker/nginx/default.conf /etc/nginx/sites-available/default

# Configurar variáveis de ambiente
ENV PORT 80
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Expor a porta 80
EXPOSE 80

# Copiar e dar permissão ao script de inicialização
COPY ./docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Iniciar Nginx e PHP-FPM
CMD ["/entrypoint.sh"]
