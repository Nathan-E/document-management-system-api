import {
  TypeController
} from './types';
import {
  RoleController
} from './roles';
import {
  UserController
} from './users';
import {
  DocumentController
} from './documents';
import {
  SearchController
} from './search';

const documentController = new DocumentController;
const roleController = new RoleController;
const typeController = new TypeController;
const userController = new UserController;
const searchDocument = new SearchController;

export {
  typeController,
  roleController,
  userController,
  documentController,
  searchDocument
};