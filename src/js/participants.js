$(function() {
    $('.headerlink').removeClass('active');
    $('#li_participants').addClass('active');

    var confId = getUrlParameter('cid');
    var confName = getUrlParameter('cname');

    $('#lbl_confName').text(confName);

    ajaxCall('GET', 'all_participants', {confId:confId}, null, allParticipantsAjaxSuccess);

});


function allParticipantsAjaxSuccess(response) {
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
                    return "<input type='image' class='table-btn commentsBtn' src='resources/Comments.png' alt='Comments' data-toggle='tooltip' data-trigger='hover' data-html='true' title='View<br>Comments' data-confid='" + row.participantId + "'/>";
                },
                align: 'center'
            },
            {
                field: 'payed',
                title: 'Payed',
                formatter: function (value, row, index, field) {
                    if(value)
                        return "<input type='checkbox' class='table-btn payedStatusBtn' data-toggle='tooltip' data-trigger='hover' data-html='true' title='Click to set<br>as unpayed' data-confid='" + row.participantId + "' checked/>";
                    else
                        return "<input type='checkbox' class='table-btn payedStatusBtn' data-toggle='tooltip' data-trigger='hover' data-html='true' title='Click to set<br>as payed' data-confid='" + row.participantId + "'/>";
                },
                align: 'center'
            },
            {
                title: 'Actions',
                sortable: false,
                formatter: function (value, row, index, field) {
                    return "<input type='image' class='table-btn absDownloadBtn' src='resources/DownloadAbstract.png' alt='Download Abstract' data-toggle='tooltip' data-trigger='hover' data-html='true' title='Download<br>Abstract' data-confid='" + row.participantId + "'/>\
                    <input type='image' class='table-btn delParticipantBtn' src='resources/Delete.png' alt='Delete' data-toggle='tooltip' data-trigger='hover' title='Delete Participants' data-confid='" + row.participantId + "'/>"
                },
                width: '75'
            }
        ],
        pagination: 20,
        data: response,
        sortName: 'id',
        sortOrder: 'desc'
    });
    $('[data-toggle="tooltip"]').tooltip();
}