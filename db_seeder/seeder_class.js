import faker from 'faker';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import {
  Role,
  Document,
  Access,
  Type,
  User
} from "../models/index";

//various roles in the system
const roles = [{
  title: 'admin'
}, {
  title: 'regular'
}];

//various level of accesses to document
const access = [{
  name: 'admin',
  level: 1
}, {
  name: 'regular',
  level: 2
}, {
  name: 'private',
  level: 3
}, {
  name: 'public',
  level: 4
}];

//various types of documents
const types = [{
    title: "thesis"
  },
  {
    title: "manuscript"
  },
  {
    title: "proposal"
  },
  {
    title: "warrant"
  },
  {
    title: "license"
  },
  {
    title: "programming"
  }
];

//Seed Class: populates the database with faked data
class Seed {
  constructor() {};

  //populates the Users Collection
  async seedUsers(nums) {
    const users = [];
    const adminRole = await Role.findOne({
      title: 'admin'
    });
    const regularRole = await Role.findOne({
      title: 'regular'
    });

    for (let i = 0; i < nums; i++) {
      let role = regularRole._id;
      //censures only two admins are created
      if (i < 2) role = adminRole._id;

      //user data
      let firstname = faker.name.firstName();
      let lastname = faker.name.lastName();
      let username = firstname.slice(0, 3) + lastname.slice(0, 3);
      let email = `${firstname}${lastname[0]}@test.com`;
      let password = '123456';
      let deleted = false;
      let isAdmin = false;

      //hashes the password
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      const user = {
        firstname,
        lastname,
        role,
        username,
        email,
        password,
        deleted,
        isAdmin
      }
      users.push(user);
    }
    await User.collection.insertMany(users);
  };

  //populates the Document Collection
  async seedDocuments(nums) {
    const documents = [];

    const users = await User.find();
    const access = await Access.find({
      level: {
        $gt: 1
      }
    });
    const types = await Type.find();

    for (let i = 0; i < nums; i++) {
      //gets a random user
      const user = users[Math.floor(users.length * Math.random())];
      const role = await Role.findById(user.role);

      //generate documents data
      let title = randomstring.generate({
        length: 12,
        charset: 'alphabetic'
      });
      let type_id = types[Math.floor(types.length * Math.random())]._id;
      let owner_id = user._id;
      let ownerRole = role.title;
      let content = randomstring.generate({
        length: 50,
        charset: 'alphabetic'
      });
      let createdAt = Date.now();
      let accessRight = access[Math.floor(access.length * Math.random())].level;

      const document = {
        title,
        type_id,
        owner_id,
        ownerRole,
        content,
        accessRight,
        createdAt
      }
      documents.push(document);
    };
    //inserts the documents into the collection
    await Document.collection.insertMany(documents);
  }
};

//Instance of the Seeder class
const seeder = new Seed();


//populates the database with fresh data
async function populateDatabase() {
  const role = await Role.find();
  const accesses = await Access.find();
  const type = await Type.find();
  if (role.length <= 0) await Role.collection.insertMany(roles);
  if (accesses.length <= 0) await Access.collection.insertMany(access);
  if (type.length <= 0) await Type.collection.insertMany(types);

  //populates the user collection
  await seeder.seedUsers(20); 
  //populates the document collection
  await seeder.seedDocuments(100);
};

//drops the database and repopulates it
async function repopulate() {
  //deletes all the fields i the collection
  await Document.deleteMany({});
  await User.deleteMany({});

  //repopulates the database
  await populateDatabase();
};

export {
  populateDatabase,
  repopulate
};