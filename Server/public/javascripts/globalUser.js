// DOM READY
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();
	
	// Button Update Data get clicked -> Update Data
    $('#btnRegisterUser').on('click', register);
	
	
	//Button Change UserData
	$('#btnChangeUserData').on('click', changeUserData);
	
	 // Link delete get clicked -> delete User
    $('#list table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	
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
				tableContent += '<td>' + this.eMail + '</td>';
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
function changeUserData(event) {
	// Prevents default HTML functions
    event.preventDefault();

        // Requestbody with macAdress and beacons#range
        var reqBody = {
			'_id' : $('#changeUserData fieldset input#inputID').val(),
			'phoneNumber' : $('#changeUserData fieldset input#inputPhoneNumber').val(),
            'GCMCode' : $('#changeUserData fieldset input#inputGCMCode').val(),
			'digitCode' : $('#changeUserData fieldset input#inputDigitCode').val(),
			'eMail' : $('#changeUserData fieldset input#inputEMail').val()
        }

        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/user/changeUserData'
        }).done(function( response ) {
		
				// Clear the form inputs
				$('#changeUserData fieldset input#inputID').val('');
				$('#changeUserData fieldset input#inputPhoneNumber').val('');
				$('#changeUserData fieldset input#inputGCMCode').val('');
				$('#changeUserDatafieldset input#inputDigitCode').val('');
				$('#changeUserData fieldset input#eMail').val('');
				
                // Update the table
                populateTable();
        });
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
			'eMail' :  $('#registerUser fieldset input#inputEMail').val()
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
				$('#registerUser fieldset input#inputEMail').val('');
				
                // Update the table
                populateTable();
				
				
            }
            else {
                // If something goes wrong, alert the error message that the service returned
                alert('Error: ' + response.msg);
            }
        });
};