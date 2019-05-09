# document-managment-system-api

## Documentation

The system manages documents, users and user roles. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published.
Users are categorized by roles. Each user must have a role defined for them.

## Installation
Install the following if you do not have them on your local system

* install [node.js](http://nodejs.org/).
* Install [mongodb](https://www.mongodb.org/downloads).
* Install [git](https://www.atlassian.com/git/tutorials/install-git).

## Database Setup

Either [MongoDB Compass](https://docs.mongodb.com/compass/master/install/) or [Mongo Atlas](https://www.mongodb.com/cloud/atlas) can be used to store data. Follow the link to set them up.

## Setup
* Clone the repository by running the command in your terminal

```sh
$ git clone https://github.com/Nathan-E/document-managment-system-api.git
```
* Open up the terminal in the root directory of the cloned repository. Then run

```sh
$ npm install
```
* create a .env file in the root directory. Copy and paste the contents in .env_example file. Define the variables

```sh
PORT= 'the port on which to run the app eg. 5000'
NODE_ENV=development
LOCAL_DATABASE=mongodb://localhost/document_management_system
TEST_DATABASE=mongodb://localhost/document_management_system_tests
REMOTE_DATABASE=mongodb+srv://<username>:<password>@<name of remote database, atlas>db-ua8ev.mongodb.net/test?retryWrites=true
JWT_PRIVATE_KEY=<define a secret key eg. HELLO>
```
* Run the command below in another terminal

```sh
$ mongod
```

* To populate your database, run the command

```sh
$ npm seed
```

* Then start the app with the command

```sh
$ npm start
```
* Visit the app on your browser by visiting the url below

```sh
http://localhost:5000/api-docs/
```

## Overview

EndPoint                        Functionality
POST /users/login               Logs a user in.
POST /users/logout              Logs a user out.
POST /users/                    Creates a new user.
GET /users/                     Find matching instances of user.
GET /users/<id>                 Find user.
PUT /users/<id>                 Update user attributes.
DELETE /users/<id>              Delete user.
POST /documents/                Creates a new document instance.
GET /documents/                 Find matching instances of document.
GET /documents/<id>             Find document.
PUT /documents/<id>             Update document attributes.
DELETE /documents/<id>          Delete document.
GET /users/<id>/documents       Find all documents belonging to the user .
