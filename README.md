# **Northcoders News API**

# **Built & Designed by Matthew Johnston**

---

## **BACK-END**

- Back-end Hosted Link (RENDER) : https://matt-nc-news.onrender.com
- Back-end Github Link: https://github.com/mjj677/nc-news

---

## **FRONT-END** 

---

## **GENERAL**

'nc-news' or 'The News API' is built on a PostgreSQL backend, engineered using Node.js and Express.js.

The goal was to replicate the core functionality of Reddit.

---

### ***ENDPOINTS***

All of the available endpoints are able to be viewed by going to https://matt-nc-news.onrender.com/api, or by looking in the `endpoints.json` file.

---

# **SETUP & INSTALLATION**

### **REQUIREMENTS**

- Postgres ^v8.11.5
- Node.js ^v22.1.0
- express ^v4.1.9.2

#### ***NOTE:***

LINUX users: 

- You will need a `user.js` file, containing your postgres username & password, e.g:

```
{ user: 'mjj677', password: 'password123' }
```

- This should sit in the nc-news root directory.

### **DEV-DEPENDENCIES**

Specific dependencies can be located in the `package.json` file or here:

- dotenv ^v16.4.5
- husky ^v8.0.2
- supertest ^v7.0.0

### **CLONING THE REPO**

#### IN THE TERMINAL:

```
$ git clone https://github.com/mjj677/nc-news.git
$ cd nc-news
```

#### SETTING UP THE ENVIRONMENT:

_TWO_ `.env.` files need to be created in order for the app to function as expected.

- `.env.test` containing: `PGDATABASE=nc_news_test`
- `.env.development` containing: `PGDATABASE=nc_news`

## **SCRIPTS**

### **INSTALLING DEPENDENCIES**

You can install the required dependencies by executing the following command in your terminal:

```
$ npm install
```

### **SETTING UP THE DATABASE AND SEEDING IT**

In order to run the tests for this app, you will first need to initialise the database and seed it:

```
$ npm run setup-dbs
$ npm run seed
```

### **TESTING THE APP**

`jest & jest-extended` are the framework(s) that are used in order to test this app.
In order to run the tests, execute the following command in your terminal: 

```
# Test the api:

$ npm test
```
