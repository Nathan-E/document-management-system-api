import {
  typeController
} from './types';
import {
  roleController
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

export {
  typeController,
  roleController,
  userController,
  documentController,
  searchDocument
};