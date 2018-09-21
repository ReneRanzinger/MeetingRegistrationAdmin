function getParticipantList(){

    $.ajax({
        type: "GET",
        url: getWsUrl("participant_list","XABKSHRKZU"),
        dataType: "json",
        success: function(data) {
            
        },
        error: function(response) {
            console.log(response);
            if(response.status == 404){
                alertify.alert()
                    .setting({
                        'title': 'Conference Not Found',
                        'label':'OK',
                        'message': 'Could not find the conference. Please use the correct conference code.'
                    }).show();
            }else {
                alertify.alert()
                    .setting({
                        'title': 'Server Down',
                        'label':'OK',
                        'message': 'OOPS!! Something went wrong! Please try again later.'
                    }).show();
            }
        }
    });


}