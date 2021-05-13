// JavaScript source code

'use strict';

import { send } from "process";

function sendLoginAttempt() {

    console.log("attempting login");

    emailToSend = $('#loginEmail').val();
    pwordToSend = $('#loginPassword').val();

    $.ajax({
        url: "/authenticate",
        type: "POST",
        dataType: "JSON",
        data: { email: emailToSend, pword: pwordToSend },
        success: function (data) {
            if (data['status'] == "success") {
                window.location.replace("/profile");
            } else {
                $("#status").text("Incorrect email/password combination.");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#status").text("Unable to log in due to an internal error.");
        }
    });
}

$('#submitBtn').click(function () {
    console.log("Button clicked");
    sendLoginAttempt();
});