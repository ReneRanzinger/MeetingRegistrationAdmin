$(function() {
    $('.headerlink').removeClass('active');
    $('#li_participants').addClass('active');

    populateParticipants();

    $('#btn_download_participants').on('click', downloadParticipants)

    $('#tbl_participants').on('click', '.commentsBtn', showComments);
    $('#tbl_participants').on('change', '.paidCB', updatePayed);
    $('#tbl_participants').on('click', '.absDownloadBtn', downloadAbstract);
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

    $('#div_view_comments').dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        minWidth: 300,
        minHeight: 200,
        width: 'auto',
        position: { my: "center" , at: "center center" }
    });

});


function downloadAbstract(e) {
    var pid = $(this).data('pid');
    var fileName = "Abstract_" + pid;
    var mimeType = $(this).data('amt');

    ajaxFileDownload('download_abstract', {participantId:pid}, fileName, mimeType);

}


function updatePayed(e) {
    var cb = $(e.target);
    var pid = cb.data('pid');
    var status = cb.prop('checked');

    if(status) {
        cb.attr('title', 'Click to set<br>as unpaid').tooltip('fixTitle').tooltip('show');
    }
    else {
        cb.attr('title', 'Click to set<br>as paid').tooltip('fixTitle').tooltip('show');
    }
    
    ajaxCall('PUT', 'update_participant', {participantId:pid}, status.toString(), function(response){});
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
                field: 'fee',
                title: 'Fee Details',
                sortable: true,
                formatter: function (value, row, index, field) {
                    return value.name + " ($" + value.amount + ")"; 
                }
            },
            {
                field: 'registrationTime',
                title: 'Registration Time',
                formatter: function (value, row, index, field) {
                    return moment(value).format("ddd, MMM D YYYY, H:mm:ss"); 
                },
                sortable: true
            },
            {
                field: 'comment',
                title: 'Comments',
                formatter: function (value, row, index, field) {
                    return value? "<input type='image' class='table-btn commentsBtn' src='resources/Comments.png' alt='Comments' data-toggle='tooltip' data-trigger='hover' data-html='true' title='View<br>Comments' data-pid='" + row.participantId + "' data-comment='" + value + "'/>" : "";
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
                    var absDownloadBtn = row.abstractTitle? "<input type='image' class='table-btn absDownloadBtn' src='resources/DownloadAbstract.png' alt='Download Abstract' data-toggle='tooltip' data-trigger='hover' data-html='true' title='Download<br>Abstract' data-pid='" + row.participantId + "' data-amt='" + row.abstractFileType + "'/>" : "";
                    var delParticipantBtn = "<input type='image' class='table-btn delParticipantBtn' src='resources/Delete.png' alt='Delete' data-toggle='tooltip' data-trigger='hover' title='Delete Participant' data-pid='" + row.participantId + "'/>";
                    return absDownloadBtn + delParticipantBtn;
                },
                width: '75',
                align: 'center'
            }
        ],
        pagination: 20,
        data: response,
        sortName: 'participantId',
        formatNoMatches: function () {
            return 'No participants registered for this conference';
        },
        search: true,
        trimOnSearch: false,
        searchAlign: 'left'
    });
    $('[data-toggle="tooltip"]').tooltip();
}