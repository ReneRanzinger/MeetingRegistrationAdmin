$(function() {
    $('.headerlink').removeClass('active');
    $('#li_all_conf').addClass('active');

    ajaxCall('GET', 'all_conferences', {}, null, allConferencesAjaxSuccess)

    $('#tbl_conferences').on('click', '.viewEditBtn', viewEditConference)
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
                title: 'View/Edit Details',
                sortable: false,
                formatter: function (value, row, index, field) {
                    return "<input type='button' class='table-btn viewEditBtn' value='View/Edit' data-confid='" + row.id + "'/>"
                }
            },
            {
                title: 'Show Participants',
                sortable: false,
                formatter: function (value, row, index, field) {
                    return "<input type='button' class='table-btn showParticipantsBtn' value='Show' data-confid='" + row.id + "'/>"
                }
            }
        ],
        pagination: 20,
        data: response
    });
}

function viewEditConference(e) {
    e.preventDefault();
    window.location = './conference.html?id=' + $(this).data('confid');
}