import 'babel-polyfill';
import request from 'supertest';
import mongoose from 'mongoose';
import { Type } from '../../models/types';
import app from '../../index';

let server