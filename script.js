const input = document.getElementById("commandInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const status = document.getElementById("status");
const chatBox = document.getElementById("chatBox");
const clearChatBtn = document.getElementById("clearChatBtn");

// 👇 YAHAN APNA RENDER URL PASTE KARNA HAI
const BACKEND_URL = "https://arisu-29rh.onrender.com";

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 0.95;
    speech.pitch = 0.85;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

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

async function runCommand() {

    const command = input.value.trim();

    if (command === "") return;

    addMessage("YOU", command);

    input.value = "";
    status.innerText = "THINKING...";

    try {

        const response = await fetch(
            BACKEND_URL + "/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: command
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Backend error");
        }

        const answer = data.reply;

        addMessage("ARISU", answer);

        speak(answer);

        status.innerText = "SYSTEM ONLINE";

    } catch (error) {

        console.error(error);

        addMessage(
            "ARISU",
            "I am unable to connect to my AI brain right now."
        );

        status.innerText = "CONNECTION ERROR";
    }
}

sendBtn.addEventListener("click", runCommand);

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        runCommand();
    }

});

clearChatBtn.addEventListener("click", function() {

    chatBox.innerHTML = 
        <div class="message arisu-message">
            <div class="message-name">ARISU</div>

            <div class="message-text">
                Chat cleared.<br>
                How may I assist you?
            </div>
        </div>
    ;

    speak("Chat cleared. How may I assist you?");
});


// ===============================
// VOICE RECOGNITION
// ===============================

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
