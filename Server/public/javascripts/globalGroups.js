// DOM READY
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();
	
	$('#btnCreateGroup').on('click', createGroup);
	
	$('#btnAddMember').on('click', addMember);
	
	$('#btnDeleteMember').on('click', deleteMember);
	
	// Link delete get clicked -> delete User
    $('#listGroups table tbody').on('click', 'td a.linkdeletegroup', deleteGroup);

	
});

// FUNCTIONS


function populateTable() {
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
						members += this.member[i]._id;
						if(i<this.member.length-1){
						members += ", ";
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
				tableContent += '<td><a href="#" class="linkdeletegroup" rel="' + this._id + '">delete</a></td>';
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
			{"phoneNumber": $('#createGroup fieldset input#inputMemberOne').val()}, 
			{"phoneNumber": $('#createGroup fieldset input#inputMemberTwo').val()}, 
			{"phoneNumber": $('#createGroup fieldset input#inputMemberThree').val()}
		];
		
		myMember = JSON.stringify(myMember);
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
				$('#createGroup fieldset input#inputMemberOne').val('');
				$('#createGroup fieldset input#inputMemberTwo').val('');
				$('#createGroup fieldset input#inputMemberThree').val('');
				
                // Update the table
                populateTable();

        });
};

function addMember(event){
	// Prevents default HTML functions
    event.preventDefault();
	
		var myMember = [];
		myMember = [
			{"phoneNumber": $('#addMember fieldset input#inputMember').val()}
		];
		
		myMember = JSON.stringify(myMember);
		console.log(myMember);
	 // Requestbody with macAdress and beacons#range
        var reqBody = {
			'groupID': $('#addMember fieldset input#inputGroupID').val(),
			'member': myMember
        }
		
        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/groups/addMember'
        }).done(function( response ) {
			
				// Clear the form inputs
				$('#addMember fieldset input#inputMember').val('');
				$('#addMember fieldset input#inputGroupID').val('');
				
                // Update the table
                populateTable();

        });
};

function deleteMember(event){
	// Prevents default HTML functions
    event.preventDefault();
	
		var myMember = [];
		myMember = [
			{"phoneNumber": $('#addMember fieldset input#inputMember').val()}
		];
		
		myMember = JSON.stringify(myMember);
		console.log(myMember);
	 // Requestbody with macAdress and beacons#range
        var reqBody = {
			'groupID': $('#addMember fieldset input#inputGroupID').val(),
			'member': myMember
        }
		
        // Use AJAX to post the object to our add service
        $.ajax({
            type: 'POST',
            data: reqBody,
            url: '/groups/deleteMember'
        }).done(function( response ) {
			
				// Clear the form inputs
				$('#addMember fieldset input#inputMember').val('');
				$('#addMember fieldset input#inputGroupID').val('');
				
                // Update the table
                populateTable();

        });
};

// Delete Data
function deleteGroup(event) {
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
            url: '/groups/deleteGroup'
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
