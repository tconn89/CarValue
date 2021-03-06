## NOTES

This API has a single endpoint called `/value` that returns the percent value  
of the given vehicle by make and model after depreciation.  

A value of `1` would mean the car has not depreciated in value and a value of  
`0.6` would mean the car has depreciated in value by 40%.  


#### Install

```bash
# clone this repo
git clone https://github.com/tconn89/CarValue.git
# install dependencies
npm install
# start the server
npm start
```

#### Validations
The api used to validate make and model does a fuzzy search on Makes.  

We can search for a list of models based on a make from this url:   
https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/{make}  

We can use this as part of our validation workflow for the `/value` endpoint.  

#### Tests
Run tests with mocha, the shortcut is    
```npm test```


#### Examples
See `curl_test.sh` for an example curl request to this api. Other sample requests are below  

```bash
# This request is part of the Happy Path
# Validations all pass and you get a value back
{ make: "Nissan", model: 'Maxima', age: 1, mileage: 10000, owners: 1 }

# Response
{"value":"0.9751","message":"Car price is 0.9751 times it's original market value"}
```

```bash
# This request will return 400 status code and return an error
# There are no results for Spacex from our 3rd party vehicle gov API
{ make: "SpaceX", model: 'Falcon9', age: 0, owners: 1 }

# Response
{"error":"SpaceX is not a valid make"}
```

```bash
# an empty request will trigger a 400 response as well
{ }

# Response
{"error":"Please supply all data, including make, model, age and owners in the body of your json request"}
```

```bash
# keys in the request are case insensitive
{ MAKE: "Tesla", model: 'Model 3', aGe: 5, ownerS: 3 }

# Response
{"value":"0.7312","message":"Car price is 0.7312 times it's original market value"}
```
