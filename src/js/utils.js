$(function() {    
    $("#btn_logout").click(function(e){
        e.preventDefault();
        logout();
    });

    var token = window.localStorage.getItem("token");
    if(!token && !window.location.pathname.endsWith('login.html')) {
        genericAjaxFailure({status: 401})
    }
});


/**
 * get URL for the web service of the requested type
 * @param request type of the resource requested
 * @returns URL for the requested type
 */
function getWsUrl(request, {confId, feeId, promoId, participantId}={}) {
    var ws_base = "http://glycomics.ccrc.uga.edu/meetings/api/";
	// var ws_base = "http://localhost:8080/";
    
    var ws_base_conference = ws_base + "conference/";
    var ws_base_fee = ws_base + "fee/";
    var ws_base_promo = ws_base + "promo/";
    var ws_base_participant = ws_base + "participant/";
    
    switch (request.toLowerCase()) {
		case "admin_login":
	        return ws_base + "login";
			break;
		case "all_conferences":
			return ws_base_conference + "allConferences";
			break;
		case "conference_details":
            return ws_base_conference + "details/" + confId;
            break;
        case "new_conference":
            return ws_base_conference + "addNew";
            break;
        case "update_conference":
            return ws_base_conference + "update/" + confId;
            break;
        case "add_fee":
            return ws_base_fee + "addNew/" + confId;
            break;
        case "update_fee":
            return ws_base_fee + "update/" + feeId;
            break;
        case "delete_fee":
            return ws_base_fee + "delete/" + feeId;
            break;
        case "add_promo":
            return ws_base_promo + "addNew/" + confId;
            break;
        case "update_promo":
            return ws_base_promo + "update/" + promoId;
            break;
        case "delete_promo":
            return ws_base_promo + "delete/" + promoId;
            break;
        case "all_participants":
            return ws_base_participant + "allParticipants/" + confId;
            break;
        case "download_participants":
            return ws_base_participant + "download/" + confId;
            break;
        case "delete_participant":
            return ws_base_participant + "delete/" + participantId;
            break;
        case "update_participant":
            return ws_base_participant + "update/" + participantId;
            break;        
        case "download_abstract":
            return ws_base_participant + "downloadAbstract/" + participantId;
            break;
    }
}


function genericAjaxFailure(response) {
    $('#loading_image').fadeOut();
    var title = "Error";
    var message = "Server error";
    var callback = logout;
    if(response.status == 401) {
        title = "Forbidden";
        message = "Sorry, you are not logged in. You will be redirected to the login page now.";
        callback = logout;
    }
    else if(response.status !== 0){
        message = response.responseJSON? response.responseJSON.message || response.responseJSON.errors.toString() : 'Some error occurred';
        callback = null;
    }
    alertify.alert().setting({
        'title': title,
        'message': message,
        'onok': callback
    }).show();
    if(callback) {
        setTimeout(callback, 3000);
    }
}


function ajaxCall(type, ws, wsParams, data, successFunction, failureFunction=genericAjaxFailure) {
    var token = window.localStorage.getItem("token") || '';
    ajaxConfig = {
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        url: getWsUrl(ws, wsParams),
        method: type,
        success: successFunction,
        error: failureFunction
    }
    if(data) {
        if(typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        else {
            ajaxConfig.headers['Content-Type'] = '';
        }
        $.extend(ajaxConfig, {data: data})
    }
    $.ajax(ajaxConfig);
}


function ajaxFileDownload(ws, wsParams, dataType, successFunction, failureFunction=genericAjaxFailure) {
    var token = window.localStorage.getItem("token") || '';
    ajaxConfig = {
        headers: {
            'Accept': dataType,
            'Authorization': token
        },
        url: getWsUrl(ws, wsParams),
        method: 'GET',
        success: successFunction,
        error: failureFunction
    }
    $.ajax(ajaxConfig);
}


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}


function logout() {
    window.localStorage.removeItem("token");
    window.location.href = "./login.html";
}