import logger from '../startup/logger'
export default (err, req, res, next) => {
  if (err) res.status(500).send('Something went wrong!!!')
};