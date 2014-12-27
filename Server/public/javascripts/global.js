// DOM READY
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();
	//FIGURE OUT, HOW TO LOAD ONLY ONE TABLE WHEN ON SPECIFIC WEBSITE
	populateGroups();
	
	// Button Update Data get clicked -> Update Data
    $('#btnSendData').on('click', send);
	
	// Button Update Data get clicked -> Update Data
    $('#btnRegisterUser').on('click', register);
	
	// Button Update Data get clicked -> Update Data
    $('#btnGetData').on('click', get);
	
	// Button Update Data get clicked -> Update Data
    $('#btnGetDataSended').on('click', getSended);
	
	//Button Change UserData
	$('#btnChangeUserData').on('click', changeUserData);
	
	$('#btnCreateGroup').on('click', createGroup);
	
	
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
				tableContentt += '<td>' + this.messageID + '</td>';
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

function populateGroups() {
		// Empty content string
    var tableContent = '';
     
     // Use AJAX for POST
     $.ajax({
      type: 'POST',
      url: '/groups/getAllGroups'
     }).done(function( response ) {
            
			// If no data was found show a alert
			if (response === '') {
              alert('Es konnten keine Daten gefunden werden!');
            }
			
			// If data was found, place it in the table
            else{  
            $.each(response, function(){
				if(this.member != null){
					var members = "";
					for(var i=0; i< this.member.length; i++){
						members += this.member[i].phoneNumber;
						if(i<this.member.length-1){
						members += ",";
						}
					}
				}
				tableContent += '<tr>';
				tableContent += '<td>' + this._id + '</td>';
				tableContent += '<td>' + this.groupName + '</td>';
				tableContent += '<td>' + members + '</td>';
				tableContent += '<td>' + this.a + '</td>';
				tableContent += '<td>' + this.b + '</td>';
				tableContent += '<td>' + this.c + '</td>';
				tableContent += '<td>' + this.d + '</td>';
				tableContent += '<td><a href="#" class="linkdeletedata" rel="' + this._id + '">delete</a></td>';
				tableContent += '</tr>';
            });
			
            // Inject content string into HTML table
            $('#listGroups table tbody').html(tableContent);
           }
	});
};

function createGroup(event){
	// Prevents default HTML functions
    event.preventDefault();
	
		var myMember = [];
		myMember = [
			{"phoneNumber":"John", "GCMCode":"Doe"}, 
			{"phoneNumber":"Anna", "GCMCode":"Smith"}, 
			{"phoneNumber":"Peter", "GCMCode": "Jones"}
		];
		console.log(myMember);
	 // Requestbody with macAdress and beacons#range
        var reqBody = {
            'groupName': $('#createGroup fieldset input#inputName').val(),
			'member': myMember
        }
		
        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/groups/createGroup'
        }).done(function( response ) {
			
				// Clear the form inputs
                $('#createGroup fieldset input#inputName').val('');
				
                // Update the table
                populateGroups();

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

// Update Data
function send(event) {
	// Prevents default HTML functions
    event.preventDefault();

        // Requestbody with macAdress and beacons#range
        var reqBody = {
			'messageID' : $('#sendData fieldset input#inputMessageID').val(),
			'sender' : $('#sendData fieldset input#inputSender').val(),
            'receiver' : $('#sendData fieldset input#inputreceiver').val(),
			'data' : $('#sendData fieldset input#inputData').val(),
			'eMail' : $('#sendData fieldset input#eMail').val()
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
				$('#sendData fieldset input#inputMessageID').val('');
                $('#sendData fieldset input#inputSender').val('');
				$('#sendData fieldset input#inputreceiver').val('');
				$('#sendData fieldset input#inputData').val('');
				
                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that the service returned
                alert('Error: ' + response);
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