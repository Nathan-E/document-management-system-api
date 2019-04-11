import 'babel-polyfill';
import request from 'supertest';
import mongoose from 'mongoose';
import {
  User
} from '../../models/users';
import { Role } from '../../models/roles';
import {
  adminToken,
  regularToken
} from './util'
import app from '../../index';

let server

describe('/api/v1/types', () => {
  
});