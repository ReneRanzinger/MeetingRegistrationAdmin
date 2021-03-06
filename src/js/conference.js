var changed;
$(function() {
    $('#div_regStart .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    }).on('changeDate', function(e) {
        $('#div_regEnd .date').datepicker('setStartDate', e.date);
        $('#div_regStart .time').timepicker('setTime', '00:00:00');
    });

    $('#div_regEnd .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    }).on('changeDate', function(e) {
        $('#div_regStart .date').datepicker('setEndDate', e.date);
        $('#div_regEnd .time').timepicker('setTime', '23:59:59');
    });

    $('#div_regStart .time').timepicker({
        timeFormat: 'H:i:s',
        maxTime: '11:30pm',
        step: 30
    })
    // if required for past time disabling, not enough as date changes must also affect this
    // .on('changeTime', function(e) {
    //     var startDate = $('#div_regStart .date').datepicker('getDate');
    //     var endDate = $('#div_regEnd .date').datepicker('getDate');
    //     if(endDate-startDate == 0) {
    //         $('#div_regEnd .time').timepicker('option', 'minTime', $('#div_regStart .time').timepicker('getTime'));
    //     }
    //     else {
    //         $('#div_regEnd .time').timepicker('option', 'minTime', '00:00:00');
    //     }
    // });

    $('#div_regEnd .time').timepicker({
        timeFormat: 'H:i:s',
        maxTime: '11:30pm',
        step: 30,
    });

    //Abstract start/end + date/time
    $('#div_absStart .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    }).on('changeDate', function(e) {
        $('#div_absEnd .date').datepicker('setStartDate', e.date);
        $('#div_absStart .time').timepicker('setTime', '00:00:00');
    });

    $('#div_absEnd .date').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    }).on('changeDate', function(e) {
        $('#div_absStart .date').datepicker('setEndDate', e.date);
        $('#div_absEnd .time').timepicker('setTime', '23:59:59');
    });

    $('#div_absStart .time').timepicker({
        timeFormat: 'H:i:s',
        step: 30,
    });

    $('#div_absEnd .time').timepicker({
        timeFormat: 'H:i:s',
        step: 30,
    });

    $('#frm_conf').validator().on('submit', function(e) {
        if(!e.isDefaultPrevented()) {
            e.preventDefault();
            editConference();
        }
    });
    $('.table').on('click', '.editFeePromoBtn', editFeePromo);
    $('.table').on('click', '.saveFeePromoBtn', saveFeePromo);
    $('.table').on('click', '.deleteFeePromoBtn', deleteFeePromo);
    $('.add-btn').on('click', addFeePromo);

    var confId = getUrlParameter('id');
    if(confId) {
        // View/edit mode
        existingConferenceSetup(confId);
    }
    else{
        // Create mode
        newConferenceSetup();        
    }

    $('.headerlink').removeClass('active');
    $('#li_conf_mgmt').addClass('active');
    
    $('#txt_EmailList').blur(function(e) {
        var el = $(this);
        if(el.val().slice(-1)===';') {
            el.val(el.val().slice(0,-1));
        }
        $('#frm_conf').validator('validate');
    });

    //unsaved alert
    changed = false;
    $(document).on('change', ':input', function() {
        changed = true;
    });
    window.onbeforeunload = unloadPage;
});


function existingConferenceSetup(confId) {
    ajaxCall('GET', 'conference_details', {confId:confId}, null, confDetailsAjaxSuccess);
}


function newConferenceSetup() {
    editConference();
    hideExistingConferenceFields(true);
    jQuery.get('email.txt', function(data) {
        $('#ta_confirmationEmail').val(data);
    });

    $('#ta_confirmationEmail').focus(function(e) {
        $(this).val($(this).val().replace("Please remember to replace the tags enclosed within '<>' with actual values. Click to add more to your email here...", ""));
    });
}


function disableEditableFields(status) {
    $('.editable').prop('disabled', status);
}


function editConference(e) {
    var btnElement = $('#btn_Edit_Conf');
    if(btnElement.val().trim() == 'Edit Conference') {
        disableEditableFields(false);
        btnElement.prop('value', '   Save Changes');
        btnElement.removeClass('edit-btn');
        btnElement.addClass('saveEdit-btn');
    }
    else {      //save changes
        saveConference();
        disableEditableFields(true);
        btnElement.prop('value', '   Edit Conference');
        btnElement.removeClass('saveEdit-btn');
        btnElement.addClass('edit-btn');
    }
}


function addFeePromo(e) {
    var type;
    if($(this).val().trim() === 'Add Fee') {
        type = 'fee';
    }
    else {
        type = 'promo';
    }

    $('#tbl_'+ type + ' tr:last').after("<tr><td><input type='text'></td><td><input type='text'></td><td><input type='image' class='table-btn saveFeePromoBtn' alt='Save' src='resources/Save.png' data-" + type +"id=''/>\
    <input type='image' class='table-btn deleteFeePromoBtn' alt='Delete' src='resources/Delete.png' data-"+ type + "id=''/></td></tr>");
}


function editFeePromo(e) {
    e.preventDefault();
    $(this).parents("tr").find("td:not(:last-child)").each(function(){
        $(this).html('<input type="text" value="' + $(this).text() + '">');
    });
    $(e.target).removeClass('editFeePromoBtn');
    $(e.target).addClass('saveFeePromoBtn');
    $(e.target).prop('src', 'resources/Save.png');
    $(e.target).prop('title', 'Save');
}


function saveFeePromo(e) {
    e.preventDefault();
    var tr = $(this).parents('tr');
    var data = {
        d1: $(tr.children()[0]).find('input').val(),
        d2: $(tr.children()[1]).find('input').val()
    };
    var feeId = $(this).data('feeid');
    var promoId = $(this).data('promoid');

    if(feeId != null) {
        var json = {
            name: data.d1,
            amount: data.d2
        };
        if(feeId !== '') {
            ajaxCall('PUT', 'update_fee', {feeId:feeId}, json, ajaxSuccessRefreshConference);
        }
        else {
            var confId = $('#lbl_confId_val').text();
            ajaxCall('POST', 'add_fee', {confId:confId}, json, ajaxSuccessRefreshConference);
        }
    }
    else {
        var json = {
            code: data.d1,
            description: data.d2
        };
        if(promoId !== '') {
            ajaxCall('PUT', 'update_promo', {promoId:promoId}, json, ajaxSuccessRefreshConference);
        }
        else {
            var confId = $('#lbl_confId_val').text();
            ajaxCall('POST', 'add_promo', {confId:confId}, json, ajaxSuccessRefreshConference);
        }
    }
    if(feeId !== '' || promoId !== '') {
        $(e.target).removeClass('saveFeePromoBtn');
        $(e.target).addClass('editFeePromoBtn');
    }    
}


function deleteFeePromo(e) {
    e.preventDefault();
    var feeId = $(this).data('feeid');
    var promoId = $(this).data('promoid');
    if(feeId) {
        ajaxCall('DELETE', 'delete_fee', {feeId:feeId}, null, ajaxSuccessRefreshConference);
    }
    else if(promoId) {
        ajaxCall('DELETE', 'delete_promo', {promoId:promoId}, null, ajaxSuccessRefreshConference);
    }
    else {
        $(this).parent().parent().remove();
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
        conferenceName: $('#txt_confName').val().trim(),
        registrationStartDate: getDateTimeString('#div_regStart', true),
        registrationEndDate: getDateTimeString('#div_regEnd', false),
        abstractStartDate: getDateTimeString('#div_absStart', true),
        abstractEndDate: getDateTimeString('#div_absEnd', false),
        confirmationEmail: $('#ta_confirmationEmail').val(),
        emailList: $('#txt_EmailList').val().trim(),
        shortTalks: $('#cb_talks').prop('checked')
    }

    if(confId == "") {      //new conference
        ajaxCall('POST', 'new_conference', {}, conf_json, newConfAjaxSuccess, newConfAjaxFailure);
    }
    else {      //modify existing conference
        ajaxCall('PUT', 'update_conference', {confId:confId}, conf_json, ajaxSuccessRefreshConference);
    }
}


function getDateTimeString(datetime_div, isStart) {
    var date = $(datetime_div + ' .date').val().replace("/", "-");
    date = (date.substring(6) + "-" + date.substring(0, 5));
    var defaultTime = isStart? "00:00:00" : "23:59:59";
    var time = $(datetime_div + ' .time').val() || defaultTime;
    return date + " " + time;
}


function confDetailsAjaxSuccess(response) {
    $('#lbl_confId_val').text(response.conferenceId);
    $('#lbl_confCode_val').text(response.conferenceCode);
    $('#lbl_postRegCode_val').text(response.postRegistrationCode);
    $('#txt_confName').val(response.conferenceName);

    //Registration start/end + date/time
    $('#div_regStart .date').datepicker('setDate', moment(response.registrationStart)._d);
    $('#div_regEnd .date').datepicker('setDate', moment(response.registrationEnd)._d);
    $('#div_regStart .time').timepicker('setTime', moment(response.registrationStart)._d);
    $('#div_regEnd .time').timepicker('setTime', moment(response.registrationEnd)._d);
    
    //Abstract start/end + date/time
    $('#div_absStart .date').datepicker('setDate', moment(response.abstractStart)._d);
    $('#div_absEnd .date').datepicker('setDate', moment(response.abstractEnd)._d);
    $('#div_absStart .time').timepicker('setTime', moment(response.abstractStart)._d);
    $('#div_absEnd .time').timepicker('setTime', moment(response.abstractEnd)._d);

    $('#ta_confirmationEmail').text(response.confirmationEmail);
    $('#txt_EmailList').val(response.emailList);
    
    $('#tbl_fee').bootstrapTable('destroy');
    $('#tbl_fee').bootstrapTable({
        columns: [
            {
                field: 'name',
                title: 'Name',
                sortable: true
            },
            {
                field: 'amount',
                title: 'Amount',
                sortable: true
            },
            {
                title: 'Actions',
                width: '20%',
                sortable: false,
                formatter: function (value, row, index, field) {
                    return "<input type='image' class='table-btn editFeePromoBtn' alt='Edit/Save' src='resources/Edit.png' data-toggle='tooltip' title='Edit' data-feeid='" + row.feeId + "'/>\
                    <input type='image' class='table-btn deleteFeePromoBtn' alt='Delete' src='resources/Delete.png' data-toggle='tooltip' title='Delete' data-feeid='" + row.feeId + "'/>"
                }
            }
        ],
        formatNoMatches: function () {
            return 'No fee entities exist for this conference';
        },
        data: response.feeEntities
    });

    $('#tbl_promo').bootstrapTable('destroy');
    $('#tbl_promo').bootstrapTable({
        columns: [
            {
                field: 'code',
                title: 'Promo Code',
                sortable: true
            },
            {
                field: 'description',
                title: 'Description',
                sortable: true
            },
            {
                title: 'Actions',
                width: '20%',
                sortable: false,
                formatter: function (value, row, index, field) {
                    return "<input type='image' class='table-btn editFeePromoBtn' alt='Edit/Save' src='resources/Edit.png' data-toggle='tooltip' title='Edit' data-promoid='" + row.promotionCodeId + "'/>\
                    <input type='image' class='table-btn deleteFeePromoBtn' alt='Delete' src='resources/Delete.png' data-toggle='tooltip' title='Delete' data-promoid='" + row.promotionCodeId + "'/>"
                }
            }
        ],
        formatNoMatches: function () {
            return 'No promo codes exist for this conference';
        },
        data: response.promoCodes
    });

    $('#cb_talks').bootstrapToggle(response.shortTalks? 'on': 'off')

    disableEditableFields(true);
    changed = false;
}


function newConfAjaxSuccess(response) {
    hideExistingConferenceFields(false);
    existingConferenceSetup(response.conferenceId);
}


function newConfAjaxFailure(response) {
    message = response.responseJSON.message || response.responseJSON.errors.toString();
    alertify.alert().setting({
        'title': 'Error',
        'message': message,
        'onok': newConferenceSetup
    }).show();
}


function ajaxSuccessRefreshConference(response) {
    var confId = $('#lbl_confId_val').text();
    existingConferenceSetup(confId);
}


function unloadPage(e){ 
    if(changed){
        return true;
    }
}