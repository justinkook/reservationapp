// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

const tableList = require('../data/table-list.js');
const waitingList = require('../data/waiting-list.js');

// Sample table is a dummy table for validation purposes
const sampleTable = require('../data/sample-table.json');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {

  // API Requests for /api/tables
  // Below code controls what happens when a request is made to /api/tables

  // GET Request
  // Responds with all the currently reserved tables
  app.get('/api/tables', function(req, res) {
    res.json(tableList);
  });

  // POST Request
  // Adds a new table to our data collection
  // Responds with success: true or false if successful
  app.post('/api/tables', function(req, res) {

    // Checks to make sure every property on the req.body is also on sampleTable
    // If it's not, returns with success: false and exits the function
    for(let key in req.body) {
      if(!sampleTable.hasOwnProperty(key)) {
        return res.json({ success: false });
      }
    }

    // Checks to make sure every property on the sampleTable is also on req.body
    // If it's not, returns with success: false and exits the function
    for(let key in sampleTable) {
      if(!req.body.hasOwnProperty(key)) {
        return res.json({ success: false });
      }
    }
    
    const confirmation = { success: true, waitlist: false }
    // If there are fewer than 5 reserved tables, add it to the tableList
    if(tableList.length < 5) {
      tableList.push(req.body);
    } else {

      // Otherwise, add it to the waitingList
      waitingList.push(req.body);
      confirmation.waitlist = true;
      console.log('waitlist', confirmation);
    }

    // Send back a confirmation the POST was successfully processed to end the response
    res.json(confirmation);
  });

  // API Requests for /api/tables/:index
  // Below code controls what happens when a request is made to /api/tables/:index

  // GET Request
  // Responds with just the requested table at the referenced index
  app.get('/api/tables/:index', function(req, res) {
    res.json(tableList[req.params.index]);
  });

  // PUT Request
  // Replaces the table at the referenced index with the one provided
  // Responds with success: true or false if successful
  app.put('/api/tables/:index', function(req, res) {

    // Using the same validation as our POST route to check if the included data is valid
    // Checks to make sure every property on the req.body is also on sampleTable
    // If it's not, returns with success: false and exits the function
    for(let key in req.body) {
      if(!sampleTable.hasOwnProperty(key)) {
        return res.json({ success: false });
      }
    }
    
    // Checks to make sure every property on the sampleTable is also on req.body
    // If it's not, returns with success: false and exits the function
    for(let key in sampleTable) {
      if(!req.body.hasOwnProperty(key)) {
        return res.json({ success: false });
      }
    }

    // Replace the referenced table with the one provided in the body
    tableList.splice(req.params.index, 1, req.body);
    res.json({ success: true });
  });

  // DELETE Request
  // Removes the table at the referenced index
  // If there are tables on the waiting list, moves them to the reserved tables list
  // Responds with success: true or false if successful
  app.delete('/api/tables/:index', function(req, res) {

    // Remove the referenced table from the tableList
    tableList.splice(req.params.index, 1);

    // Checks to see if there's any tables on the waitingList
    if(waitingList.length){

      // Remove the first table on the waitingList
      // And push it onto the end of the tableList
      const movedTable = waitingList.shift();
      tableList.push(movedTable);
    }
    
    // Respond that this operation was successfully completed
    res.json({ success: true });
  });

  // API Requests for /api/waitinglist/
  // Below code controls what happens when a request is made to /api/waitinglist

  // GET Request
  // Responds with all tables on the waitingList
  app.get('/api/waitinglist', function(req, res) {

    // Respond with the waitingList as JSON
    res.json(waitingList);
  });

  // API Requests for /api/waitingList/:index
  // Below code controls what happens when a request is made to /api/waitingList/:index

  // GET Request
  // Responds with just the requested table at the referenced index
  app.get('/api/waitinglist/:index', function(req, res) {

    // Respond with the waitingList as JSON
    res.json(waitingList[req.params.index]);
  });

  // PUT Request
  // Replaces the table at the referenced index with the one provided
  // Responds with success: true or false if successful
  app.put('/api/waitinglist/:index', function(req, res) {

    // Using the same validation as our POST route to check if the included data is valid
    // Checks to make sure every property on the req.body is also on sampleTable
    // If it's not, returns with success: false and exits the function
    for(let key in req.body) {
      if(!sampleTable.hasOwnProperty(key)) {
        return res.json({ success: false });
      }
    }
    
    // Checks to make sure every property on the sampleTable is also on req.body
    // If it's not, returns with success: false and exits the function
    for(let key in sampleTable) {
      if(!req.body.hasOwnProperty(key)) {
        return res.json({ success: false });
      }
    }

    // Replace the referenced table with the one provided in the body
    waitingList.splice(req.params.index, 1, req.body);
    res.json({ success: true });
  });

  // DELETE Request
  // Removes the table at the referenced index
  // If there are tables on the waiting list, moves them to the reserved tables list
  // Responds with success: true or false if successful
  app.delete('/api/waitinglist/:index', function(req, res) {

    // Remove the referenced table from the waitingList
    waitingList.splice(req.params.index, 1);
    
    // Respond that this operation was successfully completed
    res.json({ success: true });
  });
}
