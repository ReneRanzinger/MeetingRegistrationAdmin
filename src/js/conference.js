$(function() {
    $('.headerlink').removeClass('active');
    $('#li_conf_mgmt').addClass('active');

    $('#div_regStart .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    });

    $('#div_regEnd .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    });

    $('#div_regStart .time').timepicker({
        timeFormat: 'H:i:s',
        step: 30,
    });

    $('#div_regEnd .time').timepicker({
        timeFormat: 'H:i:s',
        step: 30,
    });

    //Abstract start/end + date/time
    $('#div_absStart .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    });

    $('#div_absEnd .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    });

    $('#div_absStart .time').timepicker({
        timeFormat: 'H:i:s',
        step: 30,
    });

    $('#div_absEnd .time').timepicker({
        timeFormat: 'H:i:s',
        step: 30,
    });

    $('.edit-btn').on('click', editConference);

    var confId = getUrlParameter('id');
    if(confId) {
        // View/edit mode
        ajaxCall('GET', 'conference_details', {confId:confId}, null, confDetailsAjaxSuccess);
    }
    else{
        // Create mode
        newConferenceSetup();        
    }
    
});


function newConferenceSetup() {
    editConference();
    hideExistingConferenceFields(true);        
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
        saveConference();
        disableEditableFields(true);
        $('.edit-btn').prop('value', 'Edit Conference');
    }    
}


function hideExistingConferenceFields(status) {
    if(status) {
        $('.existing_conf_only').hide();
    }        
    else {
        $('.existing_conf_only').show();
    }
}


function saveConference() {
    var confId = $('#lbl_confId_val').text();

    var conf_json = {
        conferenceName: $('#txt_confName').val(),
        registrationStartDate: getDateTimeString('#div_regStart'),
        registrationEndDate: getDateTimeString('#div_regEnd'),
        abstractStartDate: getDateTimeString('#div_absStart'),
        abstractEndDate: getDateTimeString('#div_absEnd'),
        confirmationEmail: $('#ta_confirmationEmail').val(),
        emailList: $('#txt_EmailList').val(),
        shortTalks: $('#cb_talks').prop('checked')
    }

    if(confId == "") {      //new conference
        ajaxCall('POST', 'new_conference', {}, conf_json, newConfAjaxSuccess);
    }
    else {      //modify existing conference
        
    }
}


function getDateTimeString(datetime_div) {
    var date = $(datetime_div + ' .date').val().replace("/", "-");
    date = (date.substring(6) + "-" + date.substring(0, 5));
    var time = $(datetime_div + ' .time').val();
    return date + " " + time;
}


function confDetailsAjaxSuccess(response) {
    console.log(response);

    $('#lbl_confId_val').text(response.conferenceId);
    $('#lbl_confCode_val').text(response.conferenceCode);
    $('#lbl_postRegCode_val').text(response.postRegistrationCode);
    $('#txt_confName').val(response.conferenceName);

    //Registration start/end + date/time
    $('#div_regStart .date').datepicker('setDate', new Date(response.registrationStart));
    $('#div_regEnd .date').datepicker('setDate', new Date(response.registrationEnd));
    $('#div_regStart .time').timepicker('setTime', new Date(response.registrationStart));
    $('#div_regEnd .time').timepicker('setTime', new Date(response.registrationEnd));
    
    //Abstract start/end + date/time
    $('#div_absStart .date').datepicker('setDate', new Date(response.abstractStart));
    $('#div_absEnd .date').datepicker('setDate', new Date(response.abstractEnd));
    $('#div_absStart .time').timepicker('setTime', new Date(response.abstractStart));
    $('#div_absEnd .time').timepicker('setTime', new Date(response.abstractEnd));

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
        formatNoMatches: function () {
            return 'No fee entities for this conference';
        },
        data: response.feeEntities
    });

    $('#tbl_promo').bootstrapTable({
        columns: [
            {
                field: 'promotionCodeId',
                title: 'ID',
                sortable: true
            },
            {
                field: 'code',
                title: 'Promo Code',
                sortable: true
            },
            {
                field: 'description',
                title: 'Description',
                sortable: true
            }
        ],
        formatNoMatches: function () {
            return 'No promo codes for this conference';
        },
        data: response.promoCodes
    });

    $('#cb_talks').bootstrapToggle(response.shortTalks? 'on': 'off')

    disableEditableFields(true);
}


function newConfAjaxSuccess(response) {
    window.location = './conference.html?id=' + response.conferenceId;
}