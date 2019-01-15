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
                // error: loginFailure

                //for testing without webservice backend only!!
                error: loginSuccess
            });

        }

    });

});

function loginSuccess(response, textStatus, jqXHR) {
    $('#loading_image').fadeOut();
    var token = "";// jqXHR.getResponseHeader('Authorization');
    window.localStorage.setItem("token", token);
    window.location.href = './index.html';
}