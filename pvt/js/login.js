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
                $("#status").text("Incorrect email/password combination.");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#status").text("Unable to log in due to an internal error.");
        }
    });
}

console.log("Login script loaded");
$(document).ready(function () {
    $("#submitBtn").click(function () {
        console.log("Button clicked");
        sendLoginAttempt();
    });
});
