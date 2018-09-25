
// jQuery handler that runs the encapsulated code when the page is ready.
$(function() {
  // In this code, jQuery is used to 'download' the data from our server
  // We then dynamically display this content in our table. This is very similar to the group projects you just completed.

  const render = function () {

    // Empty our output divs
    $('#tableList').empty();
    $('#waitList').empty();

    // Turn off any click listeners from our update items
    $('.submit').off('click');
    $('.cancel').off('click');

    // Run Queries!
    // ==========================================
    runTableQuery();
    runWaitListQuery();
  }

  const renderTables = function (outputElement, dataList) {
    // Loop through and display each of the customers
      for (let i = 0; i < dataList.length; i++) {

        // Get a reference to the tableList element and populate it with tables
        const output = $(outputElement);

        // Removes the leading '#' from the outputElement
        const outputType = outputElement.slice(1);

        // Then display the fields in the HTML (Section Name, Date, URL)
        // Adds an id for editing and deleting
        const listItem = 
          $('<li>')
            .addClass('list-group-item mt-4')
            .attr('id', `${outputType}-${i}`);

        listItem.append(
          $('<h2>').text('Table #' + (i + 1)),
          $('<hr>'),
          $('<h2>').text('ID: ' + dataList[i].customerID),
          $('<h2>').text('Name: ' + dataList[i].customerName),
          $('<h2>').text('Email: ' + dataList[i].customerEmail),
          $('<h2>').text('Phone: ' + dataList[i].phoneNumber)
        );

        const buttonsDiv = $('<div>').addClass('float-right');

        buttonsDiv.append(
          $('<button>')
            .text('Edit')
            .addClass('btn btn-primary edit')
            .attr('data-index', `${outputType}-${i}`),
          $('<button>')
            .text('Delete')
            .addClass('btn btn-danger delete')
            .attr('data-index', `${outputType}-${i}`)
        );

        output.append(listItem, buttonsDiv);
      }
  }

  const renderUpdateFields = function () {

    const entry = $(this).attr('data-index');

    // Grab the index from the end of the entry
    const i = parseInt(entry.split('-')[1]);

    listItem = [
      $('<h2>').text('Table #' + (i + 1)),
      $('<hr>'),
      $('<h2>').text('ID: '),
      $('<input>')
        .addClass('form-control')
        .attr('type', 'text')
        .attr('id', `reserve-unique-id-${entry}`),
      $('<h2>').text('Name: '),
      $('<input>')
        .addClass('form-control')
        .attr('type', 'text')
        .attr('id', `reserve-name-${entry}`),
      $('<h2>').text('Email: '),
      $('<input>')
        .addClass('form-control')
        .attr('type', 'text')
        .attr('id', `reserve-email-${entry}`),
      $('<h2>').text('Phone: '),
      $('<input>')
        .addClass('form-control')
        .attr('type', 'text')
        .attr('id', `reserve-phone-${entry}`),
      $('<button>')
        .text('Submit')
        .addClass('btn btn-primary submit float-right')
        .attr('id', `submit-${entry}`),
      $('<button>')
        .text('Cancel')
        .addClass('btn cancel float-right')
        .attr('id', `edit-${entry}`)
    ];

    const old = $(`#${entry}`).html();

    $(`#${entry}`).empty().append(listItem);

    $(`#edit-${entry}`).on('click', function() {
      $(`#${entry}`).empty().append(old);
      $(`#edit-${entry}`).off('click');
    });

    $(`#submit-${entry}`).on('click', function() {
      if( entry.split('-')[0] === 'tableList'){
        sendTableUpdates(entry, 'tables');
      } else {
        sendTableUpdates(entry, 'waitinglist');
      }
    });
  }

  function sendTableUpdates(entry, route) {
    console.log('udating', entry);
    // Here we grab the form elements
    const newReservation = {
      customerName: $(`#reserve-name-${entry}`).val().trim(),
      phoneNumber: $(`#reserve-phone-${entry}`).val().trim(),
      customerEmail: $(`#reserve-email-${entry}`).val().trim(),
      customerID: $(`#reserve-unique-id-${entry}`).val().trim()
    };

    // Grab the index from the end of the entry
    const index = entry.split('-')[1];
    // Make the PUT request
    $.ajax(
      {
        url: `/api/${route}/${index}`,
        method: 'PUT' ,
        data: newReservation
      })
      .then(function(data) {

        // If our PUT request was successfully processed, proceed on
        if (data.success) {
          render();
        } else {

          alert('There was a problem with your submission. Please check your entry and try again.');
        }
        

      });
  }

  const deleteSelected = function () {

    const entry = $(this).attr('data-index');
    
    let route;

    if( entry.split('-')[0] === 'tableList'){
      route = 'tables';
    } else {
      route = 'waitinglist';
    }

    // Grab the index from the end of the entry
    const index = entry.split('-')[1];
    // Make the PUT request
    $.ajax({url: `/api/${route}/${index}`, method: 'DELETE'})
      .then(function(data) {

        // If our DELETE request was successfully processed, proceed on
        if (data.success) {
          render();
        } else {

          alert('There was a problem with your submission. Please check your entry and try again.');
        }
        

      });
  }

  const runTableQuery = function () {

    // The AJAX function uses the URL of our API to GET the data associated with it (initially set to localhost)
    $.ajax({ url: '/api/tables', method: 'GET' })
      .then(function(tableList) {
        renderTables('#tableList', tableList);
      });
  }

  const runWaitListQuery = function () {

    // The AJAX function uses the URL of our API to GET the data associated with it (initially set to localhost)
    $.ajax({ url: '/api/waitinglist', method: 'GET' })
      .then(function(waitList) {
        renderTables('#waitList', waitList);
      });
  }

  // This function resets all of the data in our tables. This is intended to let you restart a demo.
  const clearTable = function () {
    alert('Clearing...');

    // Clear the tables on the server and then empty the elements on the client
    $.ajax({ url: '/api/clear', method: 'POST' }).then(function() {
      $('#waitList').empty();
      $('#tableList').empty();
    });
  }

  $('#clear').on('click', clearTable);

  $(document).on('click', '.edit', renderUpdateFields);

  $(document).on('click', '.delete', deleteSelected);

  // Render our data to the page
  render();
});
