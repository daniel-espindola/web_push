vapidPublicKey = "xyz";

if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            .then((reg) => {
                if (Notification.permission === "granted") {
                    requestNotificationAccess(reg);
                    $("#desabilitaNotificacao").show();
                } else if (Notification.permission === "blocked" || Notification.permission === "denied") {

                } else {
                    $("#solicitarNotificacao").show();
                    $("#solicitarNotificacao").click(() => requestNotificationAccess(reg));
                }
            });
    });
} else {
    toastr.error("Seu dispositivo não tem suporte a notificações")
}


function requestNotificationAccess(reg) {
    Notification.requestPermission(function (status) {        
        $("#solicitarNotificacao").hide();
        if (status == "granted") {
            getSubscription(reg);
        }
    });
}
    

function getSubscription(reg) {
    reg.pushManager.getSubscription().then(function (sub) {
        if (sub === null) {
            reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey,
            }).then(function (sub) {
                saveSubscription(sub);
            }).catch(function (e) {
            });
        } else {
            saveSubscription(sub);
        }
    });
    }

function saveSubscription(sub) {
    subscriptionData = {
        endPoint: sub.endpoint,
        p256dh: arrayBufferToBase64(sub.getKey("p256dh")),
        auth: arrayBufferToBase64(sub.getKey("auth")),
        User_Agent: window.navigator.userAgent
    };

    document.getElementById("res").innerText = JSON.stringify(subscriptionData);
    console.log(subscriptionData);
    console.table(subscriptionData);

    $.ajax({
        type: "POST",
        url: `/notificacao/save_subscription`,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(subscriptionData),
    }).done(function (data) {
    }).fail(function (xhr, status, error) {
        console.log(`Code: ${JSON.stringify(xhr)} Status: ${status}`);
    });
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}