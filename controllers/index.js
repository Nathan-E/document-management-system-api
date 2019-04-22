import {
  typeController
} from './types';
import {
  RoleController
} from './roles';
import {
  userController
} from './users';
import {
  DocumentController
} from './documents';
import {
  searchDocument
} from './search';

const documentController = new DocumentController;
const roleController = new RoleController;

export {
  typeController,
  roleController,
  userController,
  documentController,
  searchDocument
};