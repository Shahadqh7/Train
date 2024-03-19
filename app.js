// Importing the express module
const express = require('express')

// Creating an instance of the express application
const app = express()

// Importing the file system module
const fs = require('fs')

// Importing the UUID module for generating unique identifiers
const uuid = require('uuid')

// Middleware to parse incoming JSON data
app.use(express.json())

// Function to read JSON data from a file
function readFile() {
    // Reading and parsing the JSON data from University.json file
    return JSON.parse(fs.readFileSync('./University.json', 'utf8'))
}

// Function to write data to a JSON file
function writeFile(data) {
    // Writing the data to University.json file
    fs.writeFileSync('./University.json', JSON.stringify(data), 'utf8')
}

// Endpoint for handling GET request to retrieve all universities
app.get('/university/', (req, res) => {
    try {
        // Sending a JSON response containing all universities
        res.status(200).json({uni: readFile()})
    } catch(e) {
        // Handling errors and sending a 500 status code with error message
        res.status(500).json({ error: e })
    }
})

// Endpoint for handling GET request to retrieve a specific university by ID
app.get('/university/:id', (req, res) => {
    try {
        // Extracting university ID from request parameters
        const id = req.params.id
        // Retrieving the specific university with the given ID
        const university = readFile()[id]
        // If university not found, sending a 404 status code with error message
        if (!university) return res.status(404).json({'message':`University id ${id} not found`});
        // Sending a JSON response containing the requested university
        res.status(200).json({uni:university})
    } catch(e) {
        // Handling errors and sending a 500 status code with error message
        res.status(500).json({ error: e })
    }
})

// Endpoint for handling POST request to create a new university
app.post('/university', (req, res) => {
    // Extracting data from request body
    const data = req.body
    // Reading existing data from the file
    let university = readFile()
    // Generating a unique ID for the new university
    const id = uuid.v4()
    // Checking if the generated ID already exists
    if (university[id]) {
        // If ID already exists, sending a JSON response with error message
        return res.json({'message':`University id ${id} is already exists`});
    }
    // Assigning the generated ID to the new university data
    data['university_id'] = id
    // Adding the new university data to the existing data
    university[id] = data
    // Writing the updated data to the file
    writeFile(university)
    // Sending a JSON response containing the newly created university
    res.status(201).json({'university':university[id]})
})

// Endpoint for handling PUT request to update a university by ID
app.put('/university/:id', (req, res) => {
    // Extracting data from request body and university ID from request parameters
    const data = req.body
    const id = req.params.id
    // Reading existing data from the file
    let university = readFile()
    // Checking if the university with the given ID exists
    if (!university[id]) return res.status(404).json({'message':'not found'});
    // Assigning the university ID to the updated data
    data['university_id'] = id
    // Updating the university data with the new information
    university[id] = data
    // Writing the updated data to the file
    writeFile(university)
    // Sending a JSON response containing the updated university data
    res.status(200).json({'university':university[id]})
})

// Endpoint for handling POST request to add a program to a university
app.post('/:university_id/program', (req, res) => {
    // Extracting data from request body and university ID from request parameters
    const data = req.body
    const university_id = req.params.university_id
    // Reading existing data from the file
    let university = readFile()
    // Checking if the university with the given ID exists
    if (!university[university_id]) {
        // If university doesn't exist, sending a JSON response with error message
        return res.json({'message':`University id ${id} is already exists`});
    }
    // Generating a unique ID for the new program
    const program_id = uuid.v4()
    // Assigning the generated ID to the new program data
    data['program_id'] = program_id
    // Adding the new program data to the specified university
    university[university_id].programs[program_id] = data
    // Writing the updated data to the file
    writeFile(university)
    // Sending a JSON response containing the newly added program
    res.status(201).json({'program':university[university_id].programs[program_id]})
})

app.delete('/university/:id',  (req, res) => {
    //const data = req.body
    const university_id = req.params.id;
    let university = readFile()
    if (!university[id]) {
        return res.json({'message':`University id ${id} is not exists`});
    }
    delete university[university_id];
    writeFile(university)
    return res.status(200).json({'message':`University id ${id} deleted Successfully`});;
})

// Starting the server and listening for incoming requests on port 3000
app.listen(3000, console.log('listening on port 3000'))
