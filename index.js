// Import the "express" module for more powerful web server capabilities.
//const axios = require('axios');
const express = require('express');
const CosmosClientInterface = require("@azure/cosmos").CosmosClient;



// Initialize the express module and make it accessible via the app variable.
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://ro-portal-dashboard-sql.azurewebsites.net");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

app.get('/data', async (req, res) => {
    // Import database node module
  
    // Database and container IDs
    //const databaseId = "ToDoList";
    //const containerId = "Items";
    const databaseId = "sql_osmose";
    const containerId = "sql_or_collection";
    
    // Configure database access URI and primary key
    //const endpoint = "https://osmosesql.documents.azure.com:443/";
    //const authKey = "FCldEsKJ3sFWNkWT5qG2MwMRyp4eSAUFm3WpoQsv3qbByyLnvlcS140fUG6NYzpaPPQ2nH6BuDb0tlqsOupFcQ==";
    const endpoint = "https://osmosesql.documents.azure.com:443/";
    const authKey = "FCldEsKJ3sFWNkWT5qG2MwMRyp4eSAUFm3WpoQsv3qbByyLnvlcS140fUG6NYzpaPPQ2nH6BuDb0tlqsOupFcQ==";


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
            "SELECT * FROM c",
          //"SELECT * FROM c WHERE c.customer = 'Headspace_Dev1'  ",
            { enableCrossPartitionQuery: true }
            ).toArray();
        //console.log(queryResponse.result);
        
        res.send(queryResponse);
      } catch (error) {
        console.log(error);
        res.status(500).send("Error with database query: " + error.body);
      }
  });
 


module.exports = app;