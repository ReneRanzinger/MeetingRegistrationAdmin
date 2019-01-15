$(function() {
    
    $("#btn_logout").click(function(e){
        e.preventDefault();
        alert('Logging out');
        window.location.href = "./admin_login.html";
        return false; 
    });

});
