// DOM READY
$(document).ready(function() {
	$('#btnUser').on('click', getUser);
	
	$('#btnMessage').on('click', getMessage);
	
	$('#btnGroups').on('click', getGroups);
});
//Functions

function getUser(event) {
	//prevent default
	event.preventDefault();
	window.location = '/user';

};

function getMessage(event) {
	//prevent default
	event.preventDefault();
	window.location = '/message';
};

function getGroups(event) {
	//prevent default
	event.preventDefault();
	window.location = '/groups';
};


