'use strict';

$(document).ready(function () {
    $("#logout").click(function () {
        $.ajax({
            url: "/end-user",
            type: "POST",
            dataType: "JSON",
            success: function (data) {
                console.log(data);
                if (data.status == "success") {
                    console.log("Logout successful.");
                    window.location.replace('/');
                } else {
                    console.log("logout error");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("logout error");
            }
        });
    });
});
