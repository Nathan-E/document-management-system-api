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

const roles = [{
  title: 'admin'
}, {
  title: 'regular'
}];

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

class seed {
  constructor() {};

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
      if (i < 2) role = adminRole._id;

      let firstname = faker.name.firstName();
      let lastname = faker.name.lastName();
      // let role = userRole._id;
      let username = firstname.slice(0, 3) + lastname.slice(0, 3);
      let email = firstname + lastname[0] + '@test.com';
      let password = '123456';
      let deleted = false;
      let isAdmin = false;

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
      const user = users[Math.floor(users.length * Math.random())];
      const role = await Role.findById(user.role);

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
    await Document.collection.insertMany(documents);
  }
};


export {seed, roles, access, types};