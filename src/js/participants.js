$(function() {
    $('.headerlink').removeClass('active');
    $('#li_participants').addClass('active');

    populateParticipants();

    $('#btn_download_participants').on('click', downloadParticipants)

    $('#tbl_participants').on('click', '.delParticipantBtn', deleteParticipant);

    //participant delete confirmation
    $('#div_confirm_delete').dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        minWidth: 300,
        minHeight: 200,
        width: 'auto',
        position: { my: "center" , at: "center center" }
    });
    $('#btn_confirm_delete').on('click', confirmDeleteParticipant);

    $('#tbl_participants').on('click', '.commentsBtn', showComments);

    $('#div_view_comments').dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        minWidth: 300,
        minHeight: 200,
        width: 'auto',
        position: { my: "center" , at: "center center" }
    });

    $('#tbl_participants').on('change', '.paidCB', updatePayed);

});


function updatePayed(e) {
    var cb = $(e.target);
    var pid = cb.data('pid');
    var status = cb.prop('checked').toString();
    
    ajaxCall('PUT', 'update_participant', {participantId:pid}, status, function(response){} )
}


function showComments(e) {
    var pid = $(this).data('pid');
    var comment = $(this).data('comment');
    $('#lbl_comment_pid').text(pid);
    $('#ta_comment').text(comment);
    $('#div_view_comments').dialog('open');
}


function populateParticipants() {
    var confId = getUrlParameter('cid');
    var confName = getUrlParameter('cname');
    $('#lbl_confName').text(confName);

    ajaxCall('GET', 'all_participants', {confId:confId}, null, allParticipantsAjaxSuccess);
}


function downloadParticipants(e) {
    var confId = getUrlParameter('cid');
    window.open(getWsUrl('download_participants', {confId:confId}), '_blank');
    // ajaxFileDownload('download_participants', {confId:confId}, 'application/vnd.ms-excel;charset=UTF-8', downloadParticipantsAjaxSuccess)
}


function deleteParticipant(e) {
    e.preventDefault();
    $('#lbl_pid').text($(this).data('pid'));
    $('#lbl_error').hide();
    $('#div_confirm_delete').dialog('open');
}


function confirmDeleteParticipant(e) {
    var pId = $('#lbl_pid').text()
    if(pId === $('#txt_pid').val()) {
        $('#lbl_error').hide();
        $('#txt_pid').val('')
        ajaxCall('DELETE', 'delete_participant', {participantId:pId}, null, deleteParticipantAjaxSuccess);
    }
    else {
        $('#lbl_error').show();
    }
}


function downloadParticipantsAjaxSuccess(response) {
    var windowUrl = window.URL || window.webkitURL;
    var url = windowUrl.createObjectURL(response);
    var anchor = $(document.createElement('a'));
    anchor.prop('href', url);
    anchor.get(0).click();
    windowUrl.revokeObjectURL(url);
}


function deleteParticipantAjaxSuccess() {
    $('#div_confirm_delete').dialog('close');
    populateParticipants();
}


function allParticipantsAjaxSuccess(response) {
    $('#tbl_participants').bootstrapTable('destroy');
    $('#tbl_participants').bootstrapTable({
        columns: [
            {
                field: 'participantId',
                title: 'ID',
                sortable: true
            },
            {
                title: 'Full Name',
                sortable: true,
                formatter: function (value, row, index, field) {
                    return row.title + " " + row.firstName + " " + row.middleName + " " + row.lastName; 
                }
            },
            {
                field: 'institution',
                title: 'Institution',
                sortable: true
            },
            {
                field: 'email',
                title: 'Email'
            },
            {
                field: 'promotionCode',
                title: 'Promo Code',
                sortable: true
            },
            {
                title: 'Fee Details',
                sortable: true,
                formatter: function (value, row, index, field) {
                    return row.fee.name + " ($" + row.fee.amount + ")"; 
                }
            },
            {
                title: 'Registration Time',
                formatter: function (value, row, index, field) {
                    return moment(row.registrationTime).format("ddd, MMM D YYYY, H:mm:ss"); 
                },
                sortable: true
            },
            {
                title: 'Comments',
                formatter: function (value, row, index, field) {
                    return "<input type='image' class='table-btn commentsBtn' src='resources/Comments.png' alt='Comments' data-toggle='tooltip' data-trigger='hover' data-html='true' title='View<br>Comments' data-pid='" + row.participantId + "' data-comment='" + row.comment + "'/>";
                },
                align: 'center'
            },
            {
                field: 'payed',
                title: 'Paid',
                formatter: function (value, row, index, field) {
                    if(value)
                        return "<input type='checkbox' class='table-btn paidCB' data-toggle='tooltip' data-trigger='hover' data-html='true' title='Click to set<br>as unpaid' data-pid='" + row.participantId + "' checked/>";
                    else
                        return "<input type='checkbox' class='table-btn paidCB' data-toggle='tooltip' data-trigger='hover' data-html='true' title='Click to set<br>as paid' data-pid='" + row.participantId + "'/>";
                },
                align: 'center'
            },
            {
                title: 'Actions',
                sortable: false,
                formatter: function (value, row, index, field) {
                    return "<input type='image' class='table-btn absDownloadBtn' src='resources/DownloadAbstract.png' alt='Download Abstract' data-toggle='tooltip' data-trigger='hover' data-html='true' title='Download<br>Abstract' data-pid='" + row.participantId + "'/>\
                    <input type='image' class='table-btn delParticipantBtn' src='resources/Delete.png' alt='Delete' data-toggle='tooltip' data-trigger='hover' title='Delete Participant' data-pid='" + row.participantId + "'/>"
                },
                width: '75'
            }
        ],
        pagination: 20,
        data: response,
        sortName: 'participantId',
        formatNoMatches: function () {
            return 'No participants registered for this conference';
        }
    });
    $('[data-toggle="tooltip"]').tooltip();
}