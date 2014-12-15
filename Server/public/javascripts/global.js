// DOM READY
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();
	
	// Button Update Data get clicked -> Update Data
    $('#btnSendData').on('click', send);
	
	// Button Update Data get clicked -> Update Data
    $('#btnRegisterUser').on('click', register);
	
	// Button Update Data get clicked -> Update Data
    $('#btnGetData').on('click', get);
	
	// Button Update Data get clicked -> Update Data
    $('#btnGetDataSended').on('click', getSended);
	
	 // Link delete get clicked -> delete User
    $('#list table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	
    // Link delete get clicked -> delete User
    $('#listInfo table tbody').on('click', 'td a.linkdeletedata', deleteData);
	
    $('#list table tbody').on('click', 'td a.linkgetStatistics', populateStatistics);
});

// FUNCTIONS

// Fill table with data
function populateTable() {
	// Empty content string
    var tableContent = '';
    
     
     // Use AJAX for POST
     $.ajax({
      type: 'POST',
      url: '/user/getAllUser'
     }).done(function( response ) {
            
			// If no data was found show a alert
			if (response === '') {
              alert('Es konnten keine Daten gefunden werden!');
            }
			
			// If data was found, place it in the table
            else{  
            $.each(response, function(){
				tableContent += '<tr>';
				tableContent += '<td><a href="#" class="linkgetStatistics" rel="' + this._id + '">' + this._id + '</a></td>';
				tableContent += '<td>' + this.phoneNumber + '</td>';
				tableContent += '<td>' + this.GCMCode + '</td>';
				tableContent += '<td>' + this.DigitCode + '</td>';
				tableContent += '<td>' + this.lastTimeActive + '</td>';
				tableContent += '<td>' + this.status + '</td>';
				tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
				tableContent += '</tr>';
            });
			
            // Inject content string into HTML table
            $('#list table tbody').html(tableContent);
           }
	});
		   
    var tableContentt = '';
		
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
				tableContentt += '<tr>';
				tableContentt += '<td>' + this._id + '</td>';
				tableContentt += '<td>' + this.sender + '</td>';
				tableContentt += '<td>' + this.receiver + '</td>';
				tableContentt += '<td>' + this.receiverGCM + '</td>';
				tableContentt += '<td>' + this.data + '</td>';
				tableContentt += '<td>' + this.timestamp + '</td>';
				tableContentt += '<td>' + this.read + '</td>';
				tableContentt += '<td><a href="#" class="linkdeletedata" rel="' + this._id + '">delete</a></td>';
				tableContentt += '</tr>';
            });
			
            // Inject content string into HTML table
            $('#listInfo table tbody').html(tableContentt);
           }
     });
};

function populateStatistics(event) {
	// Prevents default HTML functions
    event.preventDefault();
		// Empty content string
    var tableContent = '';
    		
	var reqBody = {
         '_id': $(this).attr('rel')
    }
     
     // Use AJAX for POST
     $.ajax({
      type: 'POST',
	  data: reqBody,
      url: '/user/getUserStatistics'
     }).done(function( response ) {
            
			// If no data was found show a alert
			if (response === '') {
              alert('Es konnten keine Daten gefunden werden!');
            }
			
			// If data was found, place it in the table
            else{  
            $.each(response, function(){
				tableContent += '<tr>';
				tableContent += '<td>' + this.idOwner + '</td>';
				tableContent += '<td>' + this._id + '</td>';
				tableContent += '<td>' + this.accountCreated + '</td>';
				tableContent += '<td>' + this.messagesSend + '</td>';
				tableContent += '<td>' + this.messagesRecieved + '</td>';
				tableContent += '</tr>';
            });
			
            // Inject content string into HTML table
            $('#listStatistics table tbody').html(tableContent);
           }
	});
};

// Update Data
function send(event) {
	// Prevents default HTML functions
    event.preventDefault();

        // Requestbody with macAdress and beacons#range
        var reqBody = {
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
		
            // Check for successful (blank) response
            if (response.msg === '') {
			
				// Clear the form inputs
                $('#sendData fieldset input#inputSender').val('');
				$('#sendData fieldset input#inputreceiver').val('');
				$('#sendData fieldset input#inputData').val('');
				
                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that the service returned
                alert('Error: ' + response.msg);
            }
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

// Delete Data
function deleteUser(event) {
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
            url: '/user/deleteUser'
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
	
function register(event){
	// Prevents default HTML functions
    event.preventDefault();
	
	 // Requestbody with macAdress and beacons#range
        var reqBody = {
            'phoneNumber': $('#registerUser fieldset input#inputNumber').val(),
			'GCMCode': $('#registerUser fieldset input#inputGCM').val(),
			'digitCode': $('#registerUser fieldset input#inputDigit').val(),
			'eMail' : ""
        }
		
        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/user/register'
        }).done(function( response ) {
		
            // Check for successful (blank) response
            if (response.msg != '') {
			
				// Clear the form inputs
                $('#registerUser fieldset input#inputNumber').val('');
				$('#registerUser fieldset input#inputGCM').val('');
				$('#registerUser fieldset input#inputDigit').val('');
				
                // Update the table
                populateTable();
				
				
            }
            else {
                // If something goes wrong, alert the error message that the service returned
                alert('Error: ' + response.msg);
            }
        });
};

function createGroup(event){
	// Prevents default HTML functions
    event.preventDefault();
	
	var reqBody = {
		'groupName' : 'HomoGroup',
		'member' : '1&2'
	}
	
	        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/groups/createGroup'
        }).done(function( response ) {
		
		});
}

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
				
            }
            else {
                // If something goes wrong, alert the error message that the service returned
                alert('Error: ' + response.msg);
            }
        });
}