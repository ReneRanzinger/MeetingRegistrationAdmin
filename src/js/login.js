$(function () {

    $('#frm_login').validator();

    $('#frm_login').on('submit', function (e) {
        if(!e.isDefaultPrevented()){

            e.preventDefault();
            var userName = $('#txt_username').val()
            var password = $('#txt_password').val()

            var login_info = {
                username: userName,
                password: password
            };

            $.ajax({
                type: 'post',
                url: getWsUrl("admin_login"),
                data: JSON.stringify(login_info),
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json' 
                },
                success: function(response) {
                    window.location.href = './participant_list.html';
                },
                error: function(response) {
                    console.log(response);
                    if(response.status < 500){
                        var messageAlert = 'alert-danger';
                        
                        if(response.responseJSON)
                            var messageText = response.responseJSON.errors.toString();
                        else
                            var messageText = 'Server down!';

                        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                        $('#frm_login').find('.messages').html(alertBox);
                        var messagebox = document.getElementById("error-messages-box");
                        messagebox.scrollIntoView();
                    }else{
                        alertify.alert()
                        .setting({
                            'title': 'Registration Failed',
                            'label':'OK',
                            'message': 'OOPS!! Something went wrong! Please try again later.'
                        }).show();
                    }
                    
                }
            });
        }


    });

});