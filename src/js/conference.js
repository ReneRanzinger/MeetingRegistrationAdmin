$(function() {
    $('.headerlink').removeClass('active');
    $('#li_conf_mgmt').addClass('active');

    var confId = getUrlParameter('id');
    if(confId) {
        // console.log('View/edit mode');
        ajaxCall('GET', 'conference_details', {confId:confId}, confDetailsAjaxSuccess);
    }
    else{
        // console.log('Create mode');
    }
    
});


function confDetailsAjaxSuccess(response) {
    console.log(response);

    $('#lbl_confId_val').text(response.conferenceId);
    $('#lbl_confName_val').text(response.conferenceName);
    $('#lbl_confCode_val').text(response.conferenceCode);
    $('#lbl_postRegCode_val').text(response.postRegistrationCode);

    //Registration start/end + date/time
    $('#div_regStart .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    }).datepicker('setDate', new Date(response.registrationStart));

    $('#div_regEnd .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    }).datepicker('setDate', new Date(response.registrationEnd));

    $('#div_regStart .time').timepicker({
        timeFormat: 'g:ia',
        step: 30,
    }).timepicker('setTime', new Date(response.registrationStart));

    $('#div_regEnd .time').timepicker({
        timeFormat: 'g:ia',
        step: 30,
    }).timepicker('setTime', new Date(response.registrationEnd));

    //Abstract start/end + date/time
    $('#div_absStart .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    }).datepicker('setDate', new Date(response.abstractStart));

    $('#div_absEnd .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    }).datepicker('setDate', new Date(response.abstractEnd));

    $('#div_absStart .time').timepicker({
        timeFormat: 'g:ia',
        step: 30,
    }).timepicker('setTime', new Date(response.abstractStart));

    $('#div_absEnd .time').timepicker({
        timeFormat: 'g:ia',
        step: 30,
    }).timepicker('setTime', new Date(response.abstractEnd));

    $('#ta_confirmationEmail').text(response.confirmationEmail);
    $('#txt_EmailList').val(response.emailList);

    $('#tbl_fee').bootstrapTable({
        columns: [
            {
                field: 'feeId',
                title: 'ID',
                sortable: true
            },
            {
                field: 'name',
                title: 'Description',
                sortable: true
            },
            {
                field: 'amount',
                title: 'Amount',
                sortable: true
            },
        ],
        data: response.feeEntities
    });

    //Testing
    // response.promoCodes = ['PromoCode1', 'PromoCode2'];
    // response.shortTalks = true;

    $('#txt_Promo').val(response.promoCodes.join(', '));
    $('#cb_talks').bootstrapToggle(response.shortTalks? 'on': 'off')

    disableEditableFields(true);

    $('.edit-btn').on('click', editConference);
}


function disableEditableFields(status) {
    $('.editable').prop('disabled', status);
}


function editConference(e) {
    if($('.edit-btn').val() == 'Edit Conference') {
        disableEditableFields(false);
        $('.edit-btn').prop('value', 'Save Changes');
    }
    else {      //save changes



        disableEditableFields(true);
        $('.edit-btn').prop('value', 'Edit Conference');
    }    
}