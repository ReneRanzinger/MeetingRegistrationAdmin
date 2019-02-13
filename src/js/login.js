$(function() {

    $('#frm_login').validator();

    $('#loading_image').hide();

    $('#frm_login').on('submit', function (e) {
        if(!e.isDefaultPrevented()){
            e.preventDefault();
            $('#loading_image').fadeIn();

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
                error: loginFailure
            });

        }

    });

});


function loginSuccess(response, textStatus, jqXHR) {
    $('#loading_image').fadeOut();
    var token = jqXHR.getResponseHeader('Authorization');
    window.localStorage.setItem("token", token);
    window.location.href = './home.html';
}


function loginFailure(response, textStatus, jqXHR) {
    $('#loading_image').fadeOut();
    if(response.status == 401){
        var messageAlert = 'alert-danger';
        var messageText = 'Please check your login credentials';

        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
        $('#frm_login').find('.messages').html(alertBox);
        var messagebox = document.getElementById("error-messages-box");
        messagebox.scrollIntoView();
    }else{
        alertify.alert().setting({
            'title': 'Server Error',
            'label':'OK',
            'message': 'Oops!! Something went wrong! Please try again later.'
        }).show();
    }
    $('#txt_password').val("");
}