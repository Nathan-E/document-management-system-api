import {
  searchDocument
} from '../controllers/index';
import {
  auth,
  isAdmin
} from '../middlewares/index';
import express from 'express';

const router = express.Router();

//search for specific role
router.get('/', [auth, isAdmin], searchDocument.get);

export {
  router as searchDocument
};