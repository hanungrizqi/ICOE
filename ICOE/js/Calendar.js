    document.addEventListener('DOMContentLoaded', function () {
        var calendarEl = document.getElementById('calendar');
    

    $.ajax({
        url: "/Calendar/getDataEv",
        Data: {},
        contentType: "json",
        type: "POST",
        cache: false,
        success: function (result) {
            //debugger
            if (result.status == true) {
                //console.log(result.Data);

                var calendar = new FullCalendar.Calendar(calendarEl, {
                    plugins: ['interaction', 'dayGrid'],
                    eventTimeFormat: {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    },
                    defaultDate: new Date(),
                    editable: false,
                    eventLimit: true, // allow "more" link when too many events
                    events: result.Data
                    });

                calendar.render();
               
                   
            }}
    });    
});