/**
 * get URL for the web service of the requested type
 * @param request type of the resource requested
 * @returns URL for the requested type
 */
function getWsUrl(request, {confCode, postRegCode, confId}={}) {
    // var ws_base = "http://glycomics.ccrc.uga.edu/meetings/api/";
	var ws_base = "http://localhost:8080/";
    
    var ws_base_conference = ws_base + "conference";
	var ws_base_registration = ws_base +"registration";
	var ws_base_admin= ws_base + "admin"
    
    switch (request.toLowerCase()) {
	    case "info":
	        return ws_base_conference + "/info/" + confCode;
	        break;
	    case "post_reg":
	    	return ws_base_conference + "/info/" + confCode + "/" + postRegCode;
	    	break;
	    case "register":
	        return ws_base_registration + "/register";
			break;
		case "participant_list":
	        return ws_base_admin + "/participantExcel/" + confCode;
			break;
		case "admin_login":
	        return ws_base + "login";
			break;
		case "all_conferences":
			return ws_base_conference + "/allConferences";
			break;
		case "conference_details":
			return ws_base_conference + "/details/" + confId;
    }
}

function genericAjaxFailure(response) {
    console.log(response);
    $('#loading_image').fadeOut();
    if(response.status < 500){
        var messageAlert = 'alert-danger';

        if(response.responseJSON)
            var messageText = response.responseJSON.errors.toString();
        else
            var messageText = 'Unexpected error!';

        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
        $('#frm_login').find('.messages').html(alertBox);
        var messagebox = document.getElementById("error-messages-box");
        messagebox.scrollIntoView();
    }else{
        alertify.alert()
        .setting({
            'title': 'Server Error',
            'label':'OK',
            'message': 'Oops!! Something went wrong! Please try again later.'
        }).show();
    }
}

function ajaxCall(type, ws, params, successFunction, failureFunction=genericAjaxFailure) {
    var token = window.localStorage.getItem("token") || '';
    $.ajax({
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        },
        url: getWsUrl(ws, params),
        method: type,
        success: successFunction,
        failure: failureFunction
    });
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};