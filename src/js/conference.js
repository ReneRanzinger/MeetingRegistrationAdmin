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
});


function existingConferenceSetup(confId) {
    ajaxCall('GET', 'conference_details', {confId:confId}, null, confDetailsAjaxSuccess);
}


function newConferenceSetup() {
    editConference();
    hideExistingConferenceFields(true);        
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
        $(this).parents.find('tr').remove();
    }
}


function modifyPromoCodes() {
    
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
        ajaxCall('PUT', 'update_conference', {confId:confId}, conf_json, ajaxSuccessRefreshConference);
    }
}


function getDateTimeString(datetime_div) {
    var date = $(datetime_div + ' .date').val().replace("/", "-");
    date = (date.substring(6) + "-" + date.substring(0, 5));
    var time = $(datetime_div + ' .time').val();
    return date + " " + time;
}


function confDetailsAjaxSuccess(response) {
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
}


function newConfAjaxSuccess(response) {
    existingConferenceSetup(response.conferenceId);
}


function ajaxSuccessRefreshConference(response) {
    var confId = $('#lbl_confId_val').text();
    existingConferenceSetup(confId);
}