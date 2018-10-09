$(function () {

    $('#frm_login').validator();
    $(document).ready( function () {       
        $('#loading_image').fadeOut();
    })
    $('#frm_login').on('submit', function (e) {
        $('#loading_image').fadeIn();
        if(!e.isDefaultPrevented()){
            e.preventDefault();            

            var login_info = {
                username: $('#txt_username').val(),
                password: $('#txt_password').val()
            };

            $.ajax({
                type: 'post',
                url: getWsUrl("admin_login"),
                data: JSON.stringify(login_info),
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json' 
                },
                success: loginSuccess,
                // error: loginFailure

                //for testing without webservice backend only!!
                error: loginSuccess
            });

        }

    });

});

function loginSuccess(response) {
    $('#loading_image').fadeOut();
    window.location.href = './index.html'
}

function loginFailure(response) {
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
