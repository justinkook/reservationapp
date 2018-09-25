// In this code below we create the Front-end JavaScript which 'POSTS' our form data to our express server.
// In essence, when the user hits submit, jQuery grabs all of the fields then sends a post request to our api
// Our api recognizes the route (/api/tables)... and then runs the associated code (found in api-routes.js).
// In this case the associated code 'saves' the data to the table-data.js file or waitinglist-data.js file

// jQuery handler that runs the encapsulated code when the page is ready.
$( function(){

  // Click listener for the submit button
  $('.submit').on('click', function(event) {
    event.preventDefault();

    // Here we grab the form elements
    const newReservation = {
      customerName: $('#reserve-name').val().trim(),
      phoneNumber: $('#reserve-phone').val().trim(),
      customerEmail: $('#reserve-email').val().trim(),
      customerID: $('#reserve-unique-id').val().trim()
    };

    for(let key in newReservation){
      if(newReservation[key] === ''){
        alert('Please fill out all fields');
        return;
      }
    }

    console.log(newReservation);

    // This line is the magic. It's very similar to the standard ajax function we used.
    // Essentially we give it a URL, we give it the object we want to send, then we have a 'callback'.
    // The callback is the response of the server. In our case, we set up code in api-routes that 'returns' true or false
    // depending on if a tables is available or not.

    $.ajax({ url: '/api/tables', method: 'POST', data: newReservation }).then(
      function(data) {

        // If our POST request was successfully processed, proceed on
        if (data.success) {

          console.log('data', data)
          // If a table is available... tell user they are booked.
          if (!data.waitlist) {
            alert('Yay! You are officially booked!');
          }

          // If a table is available... tell user they on the waiting list.
          else {
            alert('Sorry you are on the wait list');
          }

          // Clear the form when submitting
          $('#reserve-name').val('');
          $('#reserve-phone').val('');
          $('#reserve-email').val('');
          $('#reserve-unique-id').val('');
          
          $('#reserve-name').focus();
        } else {

          alert('There was a problem with your submission. Please check your entry and try again.');
        }
        

      });
  });
});
