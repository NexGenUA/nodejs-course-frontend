## Фронтенд часть для [Nodejs RSSchool](https://github.com/rolling-scopes-school/nodejs-course-template) курса 

### Демо: [https://nodejs-trello.netlify.app/](https://nodejs-trello.netlify.app/)

Перед началом использования необходимо донастроить `nodejs app` наличием разрешающих  `headers` в респонсах, реализовать можно несколькоми способами, пример:

<details>
    <summary>С использованием `cors` пакета:</summary>

- Установить пакет
 
  ```bash 
  $ npm i cors
  ```
   
- Подключить пакет в `app.js` файле
 
  ```javascript 
  const cors = require('cors');
  ...
  ...
  app.use(cors());
  ```
</details>
    
<details>
    <summary>Без пакета</summary>

  ```javascript
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  ```
</details>

## Запуск приложения:

- Склонировать репозиторий 

```bash
$ git clone {repository URL}
```

- Перейти в дирректорию с проектом

- Установить пакеты

```bash
$ npm i
```

- Для заданий 2-4 команда для старта

```bash
$ npm start
```

- Для 5-го задания команда для старта

```bash
$ npm run start:auth
``` 
