const input = document.getElementById("commandInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const status = document.getElementById("status");
const chatBox = document.getElementById("chatBox");
const clearChatBtn = document.getElementById("clearChatBtn");


/* =========================
   VOICE OUTPUT
   ========================= */

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 0.95;
    speech.pitch = 0.85;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}


/* =========================
   ADD MESSAGE
   ========================= */

function addMessage(sender, text) {

    const message = document.createElement("div");

    if (sender === "ARISU") {
        message.className = "message arisu-message";
    } else {
        message.className = "message user-message";
    }

    message.innerHTML = 
        <div class="message-name">${sender}</div>
        <div class="message-text">${text}</div>
    ;

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
}


/* =========================
   RUN COMMAND
   ========================= */

function runCommand() {

    const command = input.value.trim();

    if (command === "") return;

    status.innerText = "PROCESSING...";


    // User message
    addMessage("YOU", command);


    // Get ARISU response
    const answer = processCommand(command);


    // ARISU response
    setTimeout(() => {

        addMessage("ARISU", answer);

        speak(answer);

        status.innerText = "SYSTEM ONLINE";

    }, 400);


    input.value = "";
}


/* =========================
   SEND BUTTON
   ========================= */

sendBtn.addEventListener("click", runCommand);


/* =========================
   ENTER KEY
   ========================= */

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        runCommand();
    }

});


/* =========================
   CLEAR CHAT
   ========================= */

clearChatBtn.addEventListener("click", function() {

    chatBox.innerHTML = 
        <div class="message arisu-message">

            <div class="message-name">
                ARISU
            </div>

            <div class="message-text">
                Chat cleared.<br>
                How may I assist you?
            </div>

        </div>
    ;

    speak("Chat cleared. How may I assist you?");

});


/* =========================
   VOICE RECOGNITION
   ========================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;


    micBtn.addEventListener("click", function() {

        status.innerText = "LISTENING...";

        micBtn.innerText = "🔴";

        recognition.start();

    });


    recognition.onresult = function(event) {

        const command =
            event.results[0][0].transcript;

        input.value = command;

        runCommand();

    };


    recognition.onerror = function() {

        status.innerText = "MIC ERROR";

        addMessage(
            "ARISU",
            "I could not hear you. Please try again."
        );

        micBtn.innerText = "🎤";

    };


    recognition.onend = function() {

        micBtn.innerText = "🎤";

        setTimeout(() => {

            status.innerText = "SYSTEM ONLINE";

        }, 500);

    };

} else {

    micBtn.disabled = true;

    addMessage(
        "ARISU",
        "Voice recognition is not supported in this browser."
    );

}
