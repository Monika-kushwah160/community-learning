const chatSocket = new WebSocket(
    "ws://" + window.location.host +
    "/ws/chat/" + sessionId + "/"
);

chatSocket.onmessage = function(e){

    const data = JSON.parse(e.data);

    const chatBox = document.querySelector("#chat-box");

    chatBox.innerHTML +=
        "<p><b>" + data.username + ":</b> " + data.message + "</p>";

    // auto scroll
    chatBox.scrollTop = chatBox.scrollHeight;

    // limit messages in UI (keep last 50)
    const messages = chatBox.querySelectorAll("p");

    if(messages.length > 50){
        messages[0].remove();
    }
};


function sendMessage(){

    const input = document.querySelector("#chat-message-input");

    const message = input.value;

    if(message.trim() === "") return;

    chatSocket.send(JSON.stringify({
        "message": message
    }));

    input.value = "";
}


// Send message with Enter key
document.addEventListener("DOMContentLoaded", function(){

    const input = document.querySelector("#chat-message-input");

    input.addEventListener("keyup", function(e){

        if(e.key === "Enter"){
            sendMessage();
        }

    });

});