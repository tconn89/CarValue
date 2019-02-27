curl -H "Content-Type: application/json" \
     -X POST \
     -d '{ "make": "Tesla", "model": "Model 3", "age": 2, "owners": 1, "mileage": 10000 }' \
     http://localhost:3000/value
