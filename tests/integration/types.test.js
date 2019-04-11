import 'babel-polyfill';
import request from 'supertest';
import mongoose from 'mongoose';
import {
  Type
} from '../../models/types';
import app from '../../index';

let server

describe('/api/v1/types', () => {
  beforeAll(() => {
    server = app;
  });
  beforeEach(() => {

  });
  afterEach(() => {

  });
  afterAll(async () => {
    await Type.deleteMany();
    server.close();
  });
  describe('GET /', () => {
    it('should return all the roles', async () => {
      await Type.collection.bulkWrite([{
        insertOne: {
          title: 'journal'
        }
      }, {
        insertOne: {
          title: 'fashion'
        },
      }]);

      const response = await request(server).get('/api/v1/types');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some(g => g.title === 'journal')).toBeTruthy();
      expect(response.body.some(g => g.title === 'fashion')).toBeTruthy();
    });
  });
});