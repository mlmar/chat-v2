const express = require('express');
const app = module.exports = express();
const router = express.Router();

 /* reroutes all urls that start with /test
  *   ex: localhost:3300/test/someurl
  */
app.use('/test', router);

/* intercept all urls that start with /test
 */
router.get('/', (req, res, next) => {
  // we can add some authentication to endpoints using this
  next();
});


router.get('/', (req, res) => {
  res.send(resultResponse(0, null, "TEST ROOT"));
})

router.get('/ping', (req, res) => {
  res.send(resultResponse(0, null, "PINGED"));
})