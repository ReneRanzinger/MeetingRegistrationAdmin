$(function() {
    $('.headerlink').removeClass('active');
    $('#li_all_conf').addClass('active');

    ajaxCall('GET', 'all_conferences', {}, null, allConferencesAjaxSuccess);

    $('#tbl_conferences').on('click', '.viewEditBtn', viewEditConference);
    $('#btn_addConf').on('click', newConference);
});

function allConferencesAjaxSuccess(response) {
    $('#tbl_conferences').bootstrapTable({
        columns: [
            {
                field: 'id',
                title: 'Conference ID',
                sortable: true
            },
            {
                field: 'conferenceName',
                title: 'Conference Name',
                sortable: true
            },
            {
                field: 'registrationStart',
                title: 'Registration Start Date',
                sortable: true
            },
            {
                field: 'registrationEnd',
                title: 'Registration End Date',
                sortable: true
            },
            {
                title: 'Actions',
                sortable: false,
                formatter: function (value, row, index, field) {
                    return "<input type='image' class='table-btn viewEditBtn' src='resources/ViewEdit.png' alt='View/Edit' data-toggle='tooltip' data-trigger='hover' data-html='true' title='View<br>Conference' data-confid='" + row.id + "'/>\
                    <input type='image' class='table-btn showParticipantsBtn' src='resources/Participants.png' alt='Show' data-toggle='tooltip' data-trigger='hover' title='Show Participants' data-confid='" + row.id + "'/>"
                }
            }
        ],
        pagination: 20,
        data: response
    });
    $('[data-toggle="tooltip"]').tooltip();
}


function viewEditConference(e) {
    e.preventDefault();
    window.location = './conference.html?id=' + $(this).data('confid');
}


function newConference(e) {
    e.preventDefault();
    window.location = './conference.html';
}