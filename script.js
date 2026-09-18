const input = document.getElementById("commandInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const status = document.getElementById("status");
const chatBox = document.getElementById("chatBox");
const clearChatBtn = document.getElementById("clearChatBtn");

const BACKEND_URL = "https://arisu-29rh.onrender.com";

function speak(text) {
    let voiceEnabled = localStorage.getItem("arisuVoiceEnabled");

if (voiceEnabled === null) {
    voiceEnabled = true;
} else {
    voiceEnabled = voiceEnabled === "true";
}

const voiceToggleBtn = document.getElementById("voiceToggleBtn");

function updateVoiceButton() {
    if (voiceEnabled) {
        voiceToggleBtn.innerText = "🔊 Voice ON";
    } else {
        voiceToggleBtn.innerText = "🔇 Voice OFF";
    }
}

function speak(text) {

    if (!voiceEnabled) {
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 0.95;
    speech.pitch = 0.85;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

voiceToggleBtn.addEventListener("click", function() {

    voiceEnabled = !voiceEnabled;

    localStorage.setItem(
        "arisuVoiceEnabled",
        voiceEnabled
    );

    if (!voiceEnabled) {
        window.speechSynthesis.cancel();
    }

    updateVoiceButton();
});

updateVoiceButton();
}

function addMessage(sender, message) {

    const messageDiv = document.createElement("div");

    messageDiv.className = "message";

    let formattedMessage = message;

    // Bold: text
    formattedMessage = formattedMessage.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    // Headings: ## Heading
    formattedMessage = formattedMessage.replace(
        /^## (.*)$/gm,
        "<h3>$1</h3>"
    );

    // Bullet points: - text
    formattedMessage = formattedMessage.replace(
        /^- (.*)$/gm,
        "• $1"
    );

    // New lines
    formattedMessage = formattedMessage.replace(
        /\n/g,
        "<br>"
    );

    messageDiv.innerHTML =
        "<div class='sender'>" + sender + "</div>" +
        "<div class='message-text'>" + formattedMessage + "</div>";

    chatBox.appendChild(messageDiv);

    // Automatically scroll to latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function runCommand() {

    const command = input.value.trim();

    if (command === "") {
        return;
    }

    addMessage("YOU", command);

    input.value = "";

    status.innerText = "THINKING...";

    try {

        const sessionResult =
    await supabaseClient.auth.getSession();

const session =
    sessionResult.data.session;

if (!session) {

    addMessage(
        "ARISU",
        "Please login first."
    );

    return;
}


const response = await fetch(
    BACKEND_URL + "/api/chat",
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json",

            "Authorization":
                "Bearer " + session.access_token
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

        addMessage("ARISU", data.reply);

        speak(data.reply);

        status.innerText = "SYSTEM ONLINE";

    } catch (error) {

        console.error("ARISU ERROR:", error);

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

    chatBox.innerHTML = "";

    addMessage(
        "ARISU",
        "Chat cleared. How may I assist you?"
    );

    speak("Chat cleared. How may I assist you?");
});

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

        micBtn.innerText = "🎤";

        addMessage(
            "ARISU",
            "I could not hear you. Please try again."
        );
    };

    recognition.onend = function() {

        micBtn.innerText = "🎤";

        setTimeout(function() {
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
