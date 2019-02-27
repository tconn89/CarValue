const API = require('../lib/API');

/* Constants */
const MONTHLY_DEPRECIATION = 0.005;
const TEN_YEARS = 12 * 10;
const MAX_MILEAGE = 150000;
const PER_1000_MILES = 0.001;
const MILEAGE_DEPRECIATION = 0.002;
const COLLISION_DEPRECIATION = 0.02;

class CarValue {
  constructor(data){
    const { make, model, age, owners } = data;
    if(!make || !model || typeof(age) === 'undefined' || typeof(owners) === 'undefined'){
      this.valid = false;
      this.error =  'Please supply all data, including make, model, age and owners in the body of your json request.  mileage is optional'
      return 
    }
    this.data = data
    this.valid = true;
    this.value = 1; // car starts at 100% value
  }

  async isValid() {
    if(!this.valid) return false;
    const { make, model } = this.data
    const response = await API.checkKnownModels({ make })

    if(response && response.data){
      // console.log(response.data.Results ? response.data.Results[0] : 'No Results from vehicle API')
      if(response.data.Count === 0){
        this.error = `${this.data.make} is not a valid brand`
        return false
      }
      const models = response.data.Results.filter(car => car['Model_Name'] === model);
      if(models.length > 0)
        return true
    }
    this.error = `There are no models called ${this.data.model} for ${this.data.make}`
    return false;
  }
  // TODO combine functions into reduceValueBy(type, value);
  reduceValueByAge(months) {
    const multiplier = Math.min(months, TEN_YEARS)
    this.value = this.value - (multiplier *  MONTHLY_DEPRECIATION * this.value)
  }

  reduceValueByMileage(mileage) {
    const multiplier = Math.min(mileage, MAX_MILEAGE)
    this.value = this.value - (multiplier * PER_1000_MILES * MILEAGE_DEPRECIATION * this.value)
  }

  reduceValueByOwnerCount(ownersCount) {
    if(ownersCount > 2) {
      this.value = 0.75 * this.value;
      return;
    }
    if(ownersCount === 0)
      this.value = 1.1 * this.value;
  }

  reduceValueByCollisions(collisionCount) {
    if(typeof(collisionCount) === 'undefined')
      return this.value;
    const multiplier = Math.min(collisionCount, 5)
    this.value = this.value - (multiplier * COLLISION_DEPRECIATION * this.value)
  }

  getValue() {
    const { age: months, mileage, owners, collisions } = this.data;
    this.reduceValueByAge(months);
    if(mileage)
      this.reduceValueByMileage(mileage)

    if(owners > 0) {
      this.reduceValueByOwnerCount(owners);
      this.reduceValueByCollisions(collisions)
    } else {
      // apply owner calculation last if no owners
      this.reduceValueByCollisions(collisions)
      this.reduceValueByOwnerCount(owners);
    }
    return this.value.toFixed(4)
  }
}

module.exports = CarValue;
