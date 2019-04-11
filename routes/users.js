import { userController } from '../controllers/index';
import express from 'express';
import { validateObjectId, auth, isAdmin } from '../middlewares/index';

const router = express.Router();



export { router as usersRouter };