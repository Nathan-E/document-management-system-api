import { userController } from '../controllers/index';
import express from 'express';
import { validateObjectId, auth, isAdmin } from '../middlewares/index';
import { User, validate } from '../models/users';
import { Role } from '../models/roles';

const router = express.Router();

router.post('/', async(req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send('User already exist');

  const role = await Role.findById(req.body.role_id);
  if (!role) return res.status(400).send('Invalid role.');

  user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: {
      _id: role._id,
      title: role.title
    },
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })

  await user.save();

  res.send(user);
});

export { router as usersRouter };