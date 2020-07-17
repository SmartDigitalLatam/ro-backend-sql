// Import the "express" module for more powerful web server capabilities.
//const axios = require('axios');
const express = require('express');
const CosmosClientInterface = require("@azure/cosmos").CosmosClient;



// Initialize the express module and make it accessible via the app variable.
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

app.get('/headspace_dev1', async (req, res) => {
    // Import database node module
  
    // Database and container IDs
    //const databaseId = "ToDoList";
    //const containerId = "Items";
    const databaseId = "DeviceData";
    const containerId = "Telemetry";
    
    // Configure database access URI and primary key
    //const endpoint = "https://osmosesql.documents.azure.com:443/";
    //const authKey = "FCldEsKJ3sFWNkWT5qG2MwMRyp4eSAUFm3WpoQsv3qbByyLnvlcS140fUG6NYzpaPPQ2nH6BuDb0tlqsOupFcQ==";
    const endpoint = "https://digital-cosmos-db.documents.azure.com:443/";
    const authKey = "9vJaHL9tsBWiNE4yahqdK1VfCS6ZbLHj5DrQSr2rUKfAKFwhwSakyp6JxwtzpBjXUqeAirDFFl7AbPbtcj1KHQ==";


    // Instantiate the cosmos client, based on the endpoint and authorization key
    const cosmosClient = new CosmosClientInterface({
      endpoint: endpoint,
      auth: {
        masterKey: authKey
      },
      consistencyLevel: "Session"
    });
    
    try {
        // Open a reference to the database
        const dbResponse = await cosmosClient.databases.createIfNotExists({
          id: databaseId
        });
        var database = dbResponse.database;
        
        const { container } = await database.containers.createIfNotExists({id: containerId});
       

        const queryResponse = await container.items.query(
            "SELECT * FROM c WHERE c.customer = 'Headspace_Dev1'  ",
            { enableCrossPartitionQuery: true }
            ).toArray();
        //console.log(queryResponse.result);
        
        res.send(queryResponse);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error with database query: " + error.body);
      }
  });
 

// Start the server, listen at port 3000 (-> http://127.0.0.1:3000/)
// Also print a short info message to the console (visible in
// the terminal window where you started the node server).

//app.listen(3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;