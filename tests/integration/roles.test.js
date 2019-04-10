import 'babel-polyfill';
import request from 'supertest';
import mongoose from 'mongoose';
import { Role } from '../../models/roles';
import app from '../../index';

let server;

describe('/api/v1/roles', () => {
  beforeAll(() => {
    server = app;
  });
  beforeEach(() => {

  });
  afterEach(() => {

  });
  afterAll(async () => {
    await Role.remove();
    server.close();
  });
  describe('GET /', () => {
    it('should return all the roles', () => {
      
    });
  });
});