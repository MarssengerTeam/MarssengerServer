// DOM READY
$(document).ready(function() {
	$('#btnTools').on('click', getTools);
  
    $('#btnLogin').on('click', getLogin);
});
//Functions

function getTools(event){
    event.preventDefault();
    window.location = '/tools';
}

function getLogin(event){
  event.preventDefault();
  window.location='/login';
}

