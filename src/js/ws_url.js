/**
 * get URL for the web service of the requested type
 * @param request type of the resource requested
 * @returns URL for the requested type
 */
function getWsUrl(request,conf_code,post_reg_code) {
    var ws_base = "http://glycomics.ccrc.uga.edu/meetings/api/";
	//var ws_base = "http://localhost:8080/";
	//var ws_base = "http://192.168.99.100:8081/";
    
    var ws_base_conference = ws_base+"conference";
	var ws_base_registration = ws_base +"registration";
	var ws_base_admin= ws_base +"admin"
    
    switch (request.toLowerCase()) {
	    case "info":
	        return ws_base_conference + "/info/" + conf_code;
	        break;
	    case "post_reg":
	    	return ws_base_conference + "/info/" + conf_code + "/" + post_reg_code;
	    	break;
	    case "register":
	        return ws_base_registration + "/register";
			break;
		case "participant_list":
	        return ws_base_admin + "/participantExcel/"+conf_code;
			break;
    }
}
