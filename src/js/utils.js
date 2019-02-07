$(function() {    
    $("#btn_logout").click(function(e){
        e.preventDefault();
        logout();
    });
});


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
            break;
        case "new_conference":
            return ws_base_conference + "/addNew";
            break;
        case "update_conference":
            return ws_base_conference + "/update/" + confId;
            break;
    }
}


function genericAjaxFailure(response) {
    $('#loading_image').fadeOut();
    var title = "Error";
    var message = "Unknown error!";
    var callback = null;
    if(response.status == 401 || response.status == 403) {
        title = "";
        message = "Sorry, you are not logged in. You will be redirected to the login page now.";
        callback = logout;
    }
    alertify.alert().setting({
        'title': title,
        'message': message,
        'onok': callback
    }).show();
    setTimeout(callback, 3000);
}


function ajaxCall(type, ws, params, data, successFunction, failureFunction=genericAjaxFailure) {
    var token = window.localStorage.getItem("token") || '';
    ajaxConfig = {
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: getWsUrl(ws, params),
        method: type,
        success: successFunction,
        error: failureFunction
    }
    if(data) {
        $.extend(ajaxConfig, {data: JSON.stringify(data)})
    }
    $.ajax(ajaxConfig);
}


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


function logout() {
    window.localStorage.removeItem("token");
    window.location.href = "./admin_login.html";
}