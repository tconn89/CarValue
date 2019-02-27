const Express = require('express');
const CarValue = require('../lib/CarValue');
const router = Express.Router();


/*------------- ROUTER ------------*/
router.post('/', async (req, res) => {
  let car = new CarValue(normalize(req.body))
  const valid = await car.isValid()
  if(!valid)
    return res.status(400).send({ error: car.error })
  const value = car.getValue();
  res.send({value, message: `Car price is ${value} times it's original market value` }) 
})

module.exports = { router };


function normalize(data) {
  const keys = Object.keys(data)
  let result = {};
  keys.map(key => {
    normalizedKey = key.toLowerCase()
    result[normalizedKey] = data[key]
  })
  return result
}