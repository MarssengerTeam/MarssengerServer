// DOM READY
$(document).ready(function() {
	$('#btnUser').on('click', getUser);
	
	$('#btnMessage').on('click', getMessage);
	
	$('#btnGroups').on('click', getGroups);
  
    $('#btnLogin').on('click', getLogin);
	
	$('#btnFiles').on('click', getFiles);
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

function getLogin(event){
  event.preventDefault();
  window.location='/login';
};

function getFiles(event){
  event.preventDefault();
  window.location='/files';
};


