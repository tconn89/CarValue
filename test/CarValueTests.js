const expect = require('chai').expect;
const CarValue = require('../lib/CarValue');

describe('CarValue', function() {

    describe('constructor', function() {
        it('Member data reflects invalid state and error for missing data', function() {
            const car = new CarValue({});
            expect(car.valid).to.equal(false);
            expect(car.error).to.equal('Please supply all data, including make, model, age and owners in the body of your json request.  mileage is optional');
        });

        it('Copies data into member variable data when valid arguments are present', function() {
            const car = new CarValue({ make: 'Honda', model: 'Accord', age: 1, owners: 1 });
            expect(car.valid).to.equal(true);
            console.log(car.data)
            expect(car.data).to.deep.equal({ make: 'Honda', model: 'Accord', age: 1, owners: 1 });
            expect(car.value).to.equal(1);
        });
    });
});

    describe('#isValid', function() {
        it('returns true when make and model are valid', async function () {
            const car = new CarValue({ make: 'Honda', model: 'Accord', age: 1, owners: 1 });
            const valid = await car.isValid();
            console.log(valid)
            return expect(valid).to.equal(true);
        });
        it('returns false when make and model are not valid', async function () {
            const car = new CarValue({ make: 'Chevrolet', model: 'Accord', age: 1, owners: 1 });
            const valid = await car.isValid();
            console.log(valid)
            return expect(valid).to.equal(false);
        });
    });


    describe('#reduceValueByAge', function() {
        it('reduces value', function (done) {
            const car = new CarValue({ make: 'Nissan', model: 'Maxima', age: 5, owners: 1 });
            car.reduceValueByAge(car.data.age)
            expect(car.value).to.equal(0.975);
            done()
        });
    });

    describe('#reduceValueByMileage', function() {
        it('reduces value', function (done) {
            const car = new CarValue({ make: 'Nissan', model: 'Maxima', age: 5, owners: 1, mileage: 1000 });
            car.reduceValueByMileage(car.data.mileage)
            expect(car.value).to.equal(0.998);
            done()
        });
    });

    describe('#reduceValueByOwnerCount', function() {
        it('haveing more than 2 previous owners reduces value by a lot', function (done) {
            const car = new CarValue({ make: 'Nissan', model: 'Maxima', age: 5, owners: 3, mileage: 1000 });
            car.reduceValueByOwnerCount(car.data.owners)
            expect(car.value).to.equal(0.75);
            done()
        });
        it('havining now previous owners increases value', function (done) {
            const car = new CarValue({ make: 'Nissan', model: 'Maxima', age: 5, owners: 0, mileage: 1000 });
            car.reduceValueByOwnerCount(car.data.owners)
            expect(car.value).to.equal(1.1);
            done()
        });
    });

    describe('#reduceValueByCollisionCount', function() {
        it('reduces value from collisions', function (done) {
            const car = new CarValue({ make: 'Nissan', model: 'Maxima', age: 5, owners: 3, mileage: 1000, collisions: 5 });
            car.reduceValueByCollisions(car.data.collisions)
            expect(car.value).to.equal(0.9);
            done()
        });
    });

    describe('#getValue', function() {
        it('reduces value from all dimensions', function (done) {
            const car = new CarValue({ make: 'Nissan', model: 'Maxima', age: 5, owners: 3, mileage: 1000, collisions: 5 });
            const value = car.getValue()
            expect(value).to.equal('0.6568');
            done()
        });
    });
