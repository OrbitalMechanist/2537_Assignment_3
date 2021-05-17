// JavaScript source code

'use strict';

function sendLoginAttempt() {

    console.log("attempting login");

    let emailToSend = $('#loginEmail').val();
    let pwordToSend = $('#loginPassword').val();

    console.log("Email:", emailToSend, "Password:", pwordToSend);

    $.ajax({
        url: "/auth-user",
        type: "POST",
        dataType: "JSON",
        data: { email: emailToSend, pword: pwordToSend },
        success: function (data) {
            console.log(data);
            if (data.status == "success") {
                console.log("Login successful.");
                window.location.replace('/contentful');
            } else {
                console.log("wronggggggg");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#status").text("Unable to log in due to an internal error.");
        }
    });
}

$(document).ready(function () {
    $("#submitBtn").click(function () {
        sendLoginAttempt();
    });
});
