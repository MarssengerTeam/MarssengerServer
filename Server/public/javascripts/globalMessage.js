// DOM READY
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();
	
	// Button Update Data get clicked -> Update Data
    $('#btnSendData').on('click', send);
	
	// Button Update Data get clicked -> Update Data
    $('#btnGetData').on('click', get);
	
	// Button Update Data get clicked -> Update Data
    $('#btnGetDataSended').on('click', getSended);
	
	// Button Update Data get clicked -> Update Data
    $('#btnDeleteAll').on('click', deleteAll);
	
    // Link delete get clicked -> delete User
    $('#listInfo table tbody').on('click', 'td a.linkdeletedata', deleteData);

});

// FUNCTIONS
function deleteAll(){
	console.log('HEy');
        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            url: '/messages/deleteAll'
        }).done(function( response ) {
                // Update the table
                populateTable();
        });	
}

// Fill table with data
function populateTable() {
	
    var tableContent = '';
		
     // Use AJAX for POST
     $.ajax({
      type: 'POST',
      url: '/messages/getAllMessages'
     }).done(function( response ) {
            
			// If no data was found show a alert
			if (response === '') {
              alert('Es konnten keine Daten gefunden werden!');
            }
			
			// If data was found, place it in the table
            else{  
            $.each(response, function(){
				tableContent += '<tr>';
				tableContent += '<td>' + this._id + '</td>';
				tableContent += '<td>' + this.messageID + '</td>';
				tableContent += '<td>' + this.group + '</td>';
				tableContent += '<td>' + this.sender + '</td>';
				tableContent += '<td>' + this.receiver + '</td>';
				tableContent += '<td>' + this.receiverGCM + '</td>';
				tableContent += '<td>' + this.data + '</td>';
				tableContent += '<td>' + this.timestamp + '</td>';
				tableContent += '<td>' + this.read + '</td>';
				tableContent += '<td><a href="#" class="linkdeletedata" rel="' + this._id + '">delete</a></td>';
				tableContent += '</tr>';
            });
			
            // Inject content string into HTML table
            $('#listInfo table tbody').html(tableContent);
           }
     });
};

// Update Data
function send(event) {
	// Prevents default HTML functions
    event.preventDefault();

        // Requestbody with macAdress and beacons#range
        var reqBody = {
			'messageID' : $('#sendData fieldset input#inputMessageID').val(),
			'sender' : $('#sendData fieldset input#inputSender').val(),
            'receiver' : $('#sendData fieldset input#inputreceiver').val(),
			'data' : $('#sendData fieldset input#inputData').val()
        }

        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/messages/addMessage'
        }).done(function( response ) {

				// Clear the form inputs
				$('#sendData fieldset input#inputMessageID').val('');
                $('#sendData fieldset input#inputSender').val('');
				$('#sendData fieldset input#inputreceiver').val('');
				$('#sendData fieldset input#inputData').val('');
				
                // Update the table
                populateTable();

        });
};

// Delete Data
function deleteData(event) {
	// Prevents default HTML functions
	event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Sind sie sicher, dass sie diesen Nutzer unwiederruflich löschen wollen? Sie können Ihn auch einfach auf nicht registrieriert setzen!');

    // Check and make sure the user confirmed
    if (confirmation === true) {
		// Fills the requestbody with the macAdress
		var reqBody = {
            '_id': $(this).attr('rel')
        }
		
        // Call the POST with our newData
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/messages/deleteMessage'
        }).done(function( response ) {
			// Check for successful (blank) response
            if (response.msg === '') {
			//update table
			populateTable();
			}
			else {
                // If something goes wrong, alert the error message that the service returned
                alert('Error: ' + response.msg);
            }
        });

    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};

function get(event){
		// Prevents default HTML functions
    event.preventDefault();
	
	 // Requestbody with macAdress and beacons#range
        var reqBody = {
            'number': $('#getData fieldset input#inputNumber').val()
        }
		
        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/messages/getMessages'
        }).done(function( response ) {
		
            // Check for successful (blank) response
            if (response.msg != '') {
			
				// Clear the form inputs
                $('#getData fieldset input#inputNumber').val('');
				populateTable();
				
            }
            else {
                // If something goes wrong, alert the error message that the service returned
                alert('Error: ' + response.msg);
            }
        });
}

function getSended(event){
		// Prevents default HTML functions
    event.preventDefault();
	
	 // Requestbody with macAdress and beacons#range
        var reqBody = {
            'sender': $('#getDataSended fieldset input#inputNumber').val()
        }
		
        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/messages/getReadMessages'
        }).done(function( response ) {
		
            // Check for successful (blank) response
            if (response.msg != '') {
			
				// Clear the form inputs
                $('#getDataSended fieldset input#inputNumber').val('');
				populateTable();
				
            }
            else {
                // If something goes wrong, alert the error message that the service returned
                alert('Error: ' + response.msg);
            }
        });
}