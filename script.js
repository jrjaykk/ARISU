// ==========================================
// ARISU FRONTEND
// Chat + History + New Chat + Memory
// ==========================================

const input = document.getElementById("commandInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const status = document.getElementById("status");
const chatBox = document.getElementById("chatBox");
const clearChatBtn = document.getElementById("clearChatBtn");

const BACKEND_URL = "https://arisu-29rh.onrender.com";

let currentChatId = null;


// ==========================================
// VOICE SYSTEM
// ==========================================

let voiceEnabled =
    localStorage.getItem("arisuVoiceEnabled");

if (voiceEnabled === null) {
    voiceEnabled = true;
} else {
    voiceEnabled = voiceEnabled === "true";
}

const voiceToggleBtn =
    document.getElementById("voiceToggleBtn");

function updateVoiceButton() {

    if (!voiceToggleBtn) return;

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

    if (!("speechSynthesis" in window)) {
        return;
    }

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 0.95;
    speech.pitch = 0.85;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

if (voiceToggleBtn) {

    voiceToggleBtn.addEventListener(
        "click",
        function() {

            voiceEnabled = !voiceEnabled;

            localStorage.setItem(
                "arisuVoiceEnabled",
                voiceEnabled
            );

            if (!voiceEnabled) {
                window.speechSynthesis.cancel();
            }

            updateVoiceButton();
        }
    );
}

updateVoiceButton();
padding: 11px;
            border-radius: 8px;

            border:
                1px solid transparent;

            color: #b9d9dd;
            cursor: pointer;
            transition: 0.2s;
        }

        .chat-item:hover {
            background:
                rgba(0,234,255,0.07);

            border-color:
                rgba(0,234,255,0.2);
        }

        .chat-item.active {
            background:
                rgba(0,234,255,0.1);

            border-color:
                rgba(0,234,255,0.45);

            color: #00eaff;

            box-shadow:
                inset 3px 0 0 #00eaff;
        }

        .chat-name {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 13px;
        }

        .delete-chat-btn {
            background: transparent;
            border: none;
            color: #557078;
            cursor: pointer;
            font-size: 13px;
            padding: 3px;
        }

        .delete-chat-btn:hover {
            color: #ff6868;
        }

        .chat-loading {
            color: #547078;
            font-size: 12px;
            padding: 10px;
        }

        body {
            padding-left: 270px;
            box-sizing: border-box;
        }

        @media (max-width: 800px) {

            #arisuSidebar {
                width: 230px;
            }

            body {
                padding-left: 230px;
            }
        }

        @media (max-width: 600px) {

            #arisuSidebar {
                width: 210px;
            }

            body {
                padding-left: 210px;
            }

            .sidebar-title {
                font-size: 17px;
            }
        }
    `;

    document.head.appendChild(style);


    // ======================================
    // NEW CHAT BUTTON
    // ======================================

    document
        .getElementById("newChatBtn")
        .addEventListener(
            "click",
            createNewChat
        );
}


createChatSidebar();
throw new Error(
                data.error ||
                "Unable to create chat."
            );
        }


        currentChatId =
            data.chat.id;


        chatBox.innerHTML = "";


        addMessage(
            "ARISU",
            "New chat started. How may I assist you?"
        );


        status.innerText =
            "SYSTEM ONLINE";


        await loadChatList();


    } catch (error) {

        console.error(
            "NEW CHAT ERROR:",
            error
        );

        addMessage(
            "ARISU",
            "Unable to create a new chat."
        );
    }
}
textDiv.className =
        "message-text";


    const safeText =
        String(message)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");


    let formattedMessage =
        safeText;


    formattedMessage =
        formattedMessage.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    formattedMessage =
        formattedMessage.replace(
            /^## (.*)$/gm,
            "<h3>$1</h3>"
        );


    formattedMessage =
        formattedMessage.replace(
            /^- (.*)$/gm,
            "• $1"
        );


    formattedMessage =
        formattedMessage.replace(
            /\n/g,
            "<br>"
        );


    textDiv.innerHTML =
        formattedMessage;


    messageDiv.appendChild(
        senderDiv
    );

    messageDiv.appendChild(
        textDiv
    );


    chatBox.appendChild(
        messageDiv
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;
}
// ==========================================
// SEND MESSAGE
// ==========================================

async function runCommand() {

    const command =
        input.value.trim();


    if (command === "") {
        return;
    }


    const session =
        await getSession();


    if (!session) {

        addMessage(
            "ARISU",
            "Please login first."
        );

        return;
    }


    // ======================================
    // CREATE CHAT IF NONE EXISTS
    // ======================================

    if (!currentChatId) {

        try {

            const response =
                await fetch(
                    BACKEND_URL + "/api/chats",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                session.access_token
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Unable to create chat."
                );
            }


            currentChatId =
                data.chat.id;


        } catch (error) {

            console.error(
                "CREATE CHAT ERROR:",
                error
            );

            addMessage(
                "ARISU",
                "Unable to start chat."
            );

            return;
        }
    }


    addMessage(
        "YOU",
        command
    );


    input.value = "";


    status.innerText =
        "THINKING...";


    try {

        const response =
            await fetch(
                BACKEND_URL + "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " +
                            session.access_token
                    },

                    body: JSON.stringify({

                        message:
                            command,

                        chat_id:
                            currentChatId

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Backend error"
            );
        }


        addMessage(
            "ARISU",
            data.reply
        );


        speak(
            data.reply
        );


        status.innerText =
            "SYSTEM ONLINE";


        await loadChatList();


    } catch (error) {

        console.error(
            "ARISU ERROR:",
            error
        );


        addMessage(
            "ARISU",
            "I am unable to connect to my AI brain right now."
        );


        status.innerText =
            "CONNECTION ERROR";
    }
}


// ==========================================
// SEND BUTTON
// ==========================================

sendBtn.addEventListener(
    "click",
    runCommand
);


// ==========================================
// ENTER KEY
// ==========================================

input.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            runCommand();

        }

    }
);


// ==========================================
// CLEAR CURRENT DISPLAY
// ==========================================

if (clearChatBtn) {

    clearChatBtn.addEventListener(
        "click",
        function() {

            chatBox.innerHTML = "";

            addMessage(
                "ARISU",
                "Current chat display cleared. Your saved conversation remains in chat history."
            );
            speak(
                "Current chat display cleared."
            );

        }
    );
}
// ==========================================
// VOICE RECOGNITION
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    // ======================================
    // MIC BUTTON
    // ======================================

    micBtn.addEventListener(
        "click",
        function() {

            status.innerText =
                "LISTENING...";


            micBtn.innerText =
                "🔴";


            try {

                recognition.start();

            } catch (error) {

                console.log(
                    "MIC START ERROR:",
                    error
                );

            }

        }
    );


    // ======================================
    // VOICE RESULT
    // ======================================

    recognition.onresult =
        function(event) {

            const command =
                event.results[0][0]
                    .transcript;


            input.value =
                command;


            runCommand();

        };


    // ======================================
    // VOICE ERROR
    // ======================================

    recognition.onerror =
        function() {

            status.innerText =
                "MIC ERROR";


            micBtn.innerText =
                "🎤";


            addMessage(
                "ARISU",
                "I could not hear you. Please try again."
            );

        };


    // ======================================
    // VOICE ENDED
    // ======================================

    recognition.onend =
        function() {

            micBtn.innerText =
                "🎤";


            setTimeout(
                function() {

                    status.innerText =
                        "SYSTEM ONLINE";

                },
                500
            );

        };


} else {

    micBtn.disabled =
        true;


    addMessage(
        "ARISU",
        "Voice recognition is not supported in this browser."
    );

}


// ==========================================
// INITIALIZE ARISU
// ==========================================

async function initializeARISU() {

    try {

        const session =
            await getSession();


        if (!session) {
            return;
        }


        // Load sidebar
        await loadChatList();


        // Get chats
        const response =
            await fetch(
                BACKEND_URL + "/api/chats",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            session.access_token
                    }
                }
            );


        const data =
            await response.json();


        if (
            response.ok &&
            data.chats &&
            data.chats.length > 0
        ) {

            // Open latest chat
            await loadChat(
                data.chats[0].id
            );

        } else {

            // No chat exists
            await createNewChat();

        }


    } catch (error) {

        console.error(
            "INITIALIZATION ERROR:",
            error
        );

    }

}


// ==========================================
// START ARISU
// ==========================================

setTimeout(
    initializeARISU,
    700
);
