## Описание

Для просмотра документации по Api сервера, переходите по [ссылке](http://localhost:3000/api/), там же можно будет и проверить работу с api.

## Инсталляция

```bash
$ npm install
```

## Запуск приложения

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Запуск через Docker

```bash
# Сборка образа
$ docker-compose build

# Создайте ".env" файл в корне проекта. Пример заполнения файла находится в файле .env.example

# Запуск контейнеров
$ docker-compose up
```