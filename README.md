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
* Download and install an IDE.
* You can download [Visual Studio Code - Mac, Linux, Windows](https://code.visualstudio.com/download) IDE.

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
and then create a new user.

```sh
http://localhost:5000/api-docs/
```

## Data Model
![Relationship between the various database collection](https://github.com/Nathan-E/document-managment-system-api/blob/master/img/dataModelRelations.png)

## Overview
* API endpoints.

|End-Points                       | Functionality|
| :---            |          :--- |
|POST /api/v1/users/login              | Logs a user in.|
|POST /api/v1/users/logout             | Logs a user out.|
|POST /api/v1/users/signup                   | Creates a new user.|
|GET /api/v1/users/                    | Find matching instances of user.|
|GET /api/v1/users/documents                   | Find matching instances of user's unique documents.|
|GET /api/v1/users/<id>                | Find user.|
|PUT /api/v1/users/<id>                | Update user attributes.|
|DELETE /api/v1/users/<id>             | Delete user.|
|POST /api/v1/documents/               | Creates a new document instance.|
|GET /api/v1/documents/                | Find matching instances of document.|
|GET /api/v1/documents/<id>            | Find document.|
|PUT /api/v1/documents/<id>            | Update document attributes.|
|DELETE /api/v1/documents/<id>         | Delete document.|
|GET /api/v1/users/<id>/documents      | Find all documents belonging to the user.|
|POST /api/v1/roles/               | Creates a new role instance.|
|GET /api/v1/roles/                | returns all roles.|
|GET /api/v1/roles/<id>            | Find role.|
|PUT /api/v1/roles/<id>            | Update document attributes.|
|POST /api/v1/types/               | Creates a new role instance.|
|GET /api/v1/types/                | returns all roles.|
|GET /api/v1/types/<id>            | Find role.|
|PUT /api/v1/types/<id>            | Update document attributes.|



