// ==========================================
// ARISU - CLEAN FRONTEND
// ==========================================

const input = document.getElementById("commandInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const status = document.getElementById("status");
const chatBox = document.getElementById("chatBox");
const clearChatBtn = document.getElementById("clearChatBtn");
const voiceToggleBtn = document.getElementById("voiceToggleBtn");

const BACKEND_URL = "https://arisu-29rh.onrender.com";

let currentChatId = null;


// ==========================================
// VOICE
// ==========================================

let voiceEnabled =
    localStorage.getItem("arisuVoiceEnabled");

if (voiceEnabled === null) {
    voiceEnabled = true;
} else {
    voiceEnabled = voiceEnabled === "true";
}

function updateVoiceButton() {

    if (!voiceToggleBtn) return;

    voiceToggleBtn.innerText =
        voiceEnabled
            ? "🔊 Voice ON"
            : "🔇 Voice OFF";
}

function speak(text) {

    if (!voiceEnabled) return;

    if (!("speechSynthesis" in window)) return;

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 0.95;
    speech.pitch = 0.85;

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


// ==========================================
// SESSION
// ==========================================

async function getSession() {

    const result =
        await supabaseClient.auth.getSession();

    return result.data.session;
}


// ==========================================
// CHAT SIDEBAR
// ==========================================

function createChatSidebar() {

    if (document.getElementById("arisuSidebar")) {
        return;
    }

    const sidebar =
        document.createElement("aside");
    const closeBtn = document.createElement("button");

closeBtn.innerText = "✕";
closeBtn.style.position = "absolute";
closeBtn.style.top = "15px";
closeBtn.style.right = "15px";
closeBtn.style.background = "transparent";
closeBtn.style.border = "none";
closeBtn.style.color = "#00eaff";
closeBtn.style.fontSize = "22px";
closeBtn.style.cursor = "pointer";
closeBtn.style.zIndex = "10";

closeBtn.onclick = function () {
    sidebar.style.display = "none";
};

sidebar.appendChild(closeBtn);

    sidebar.id = "arisuSidebar";

    sidebar.style.display = "none";

    sidebar.innerHTML = `
        <div class="sidebar-header">
            <div class="sidebar-logo">✦</div>

            <div>
                <div class="sidebar-title">
                    ARISU
                </div>

                <div class="sidebar-subtitle">
                    AI ASSISTANT
                </div>
            </div>
        </div>

        <button id="newChatBtn"
                class="new-chat-btn">
            ＋ NEW CHAT
        </button>

        <div class="chat-history-title">
            CHAT HISTORY
        </div>

        <div id="chatList">
            <div class="chat-loading">
                Loading chats...
            </div>
        </div>
    `;

    document.body.prepend(sidebar);
    sidebar.style.display = "none";

    const style =
        document.createElement("style");

    style.id = "arisuSidebarStyle";

    style.innerHTML = `
        #arisuSidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 270px;
            background: #02090c;
            border-right: 1px solid rgba(0,234,255,.35);
            padding: 20px;
            z-index: 10000;
            overflow-y: auto;
            box-sizing: border-box;
        }

        .sidebar-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(0,234,255,.2);
        }

        .sidebar-logo {
            width: 45px;
            height: 45px;
            border: 1px solid #00eaff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00eaff;
            font-size: 24px;
        }

        .sidebar-title {
            color: #00eaff;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 4px;
        }

        .sidebar-subtitle {
            color: #6b8990;
            font-size: 9px;
            letter-spacing: 2px;
        }

        .new-chat-btn {
            width: 100%;
            padding: 13px;
            border: 1px solid #00eaff;
            background: rgba(0,234,255,.06);
            color: #00eaff;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 25px;
        }

        .new-chat-btn:hover {
            background: #00eaff;
            color: #000;
        }

        .chat-history-title {
            color: #507078;
            font-size: 10px;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }

        #chatList {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .chat-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 11px;
            border-radius: 8px;
            color: #b9d9dd;
            cursor: pointer;
        }

        .chat-item:hover,
        .chat-item.active {
            background: rgba(0,234,255,.1);
            border: 1px solid rgba(0,234,255,.3);
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
            padding-left: 0;
            box-sizing: border-box;
        }

        @media (max-width: 600px) {
            #arisuSidebar {
                width: 210px;
            }

            body {
                padding-left: 0;
            }
        }
    `;

    document.head.appendChild(style);

    document
        .getElementById("newChatBtn")
        .addEventListener(
            "click",
            createNewChat
        );
}

createChatSidebar();
document.getElementById("arisuSidebar").style.display = "none";
let touchStartX = 0;

sidebar.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
});

sidebar.addEventListener("touchend", function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance < -70) {
        sidebar.style.display = "none";
    }
});
// ==========================================
// LOAD CHAT LIST
// ==========================================

async function loadChatList() {

    const chatList =
        document.getElementById("chatList");

    if (!chatList) return;

    const session =
        await getSession();

    if (!session) {
        chatList.innerHTML =
            `<div class="chat-loading">
                Please login.
            </div>`;
        return;
    }

    chatList.innerHTML =
        `<div class="chat-loading">
            Loading chats...
        </div>`;

    try {

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

        if (!response.ok) {
            throw new Error(
                data.error ||
                "Unable to load chats."
            );
        }

        chatList.innerHTML = "";

        const chats =
            data.chats || [];

        if (chats.length === 0) {

            chatList.innerHTML =
                `<div class="chat-loading">
                    No chats yet.
                </div>`;

            return;
        }

        chats.forEach(function(chat) {

            const item =
                document.createElement("div");

            item.className =
                "chat-item";

            if (
                String(chat.id) ===
                String(currentChatId)
            ) {
                item.classList.add("active");
            }

            const name =
                document.createElement("div");

            name.className =
                "chat-name";

            name.innerText =
                chat.title || "New Chat";


            const deleteBtn =
                document.createElement("button");

            deleteBtn.className =
                "delete-chat-btn";

            deleteBtn.innerText = "✕";

            deleteBtn.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    deleteChat(chat.id);
                }
            );


            item.appendChild(name);
            item.appendChild(deleteBtn);


            item.addEventListener(
                "click",
                function() {

                    loadChat(chat.id);
                }
            );


            chatList.appendChild(item);

        });

    } catch (error) {

        console.error(
            "CHAT LIST ERROR:",
            error
        );

        chatList.innerHTML =
            `<div class="chat-loading">
                Unable to load chats.
            </div>`;
    }
}


// ==========================================
// CREATE NEW CHAT
// ==========================================

async function createNewChat() {

    const session =
        await getSession();

    if (!session) {

        alert("Please login first.");

        return;
    }

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


// ==========================================
// LOAD OLD CHAT
// ==========================================

async function loadChat(chatId) {

    const session =
        await getSession();

    if (!session) {

        alert("Please login first.");

        return;
    }


    try {

        status.innerText =
            "LOADING CHAT...";


        const response =
            await fetch(
                BACKEND_URL +
                "/api/chats/" +
                chatId +
                "/messages",
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


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to load chat."
            );
        }


        currentChatId =
            chatId;


        chatBox.innerHTML = "";


        const messages =
            data.messages || [];


        if (messages.length === 0) {

            addMessage(
                "ARISU",
                "This chat is empty. How may I assist you?"
            );

        } else {

            messages.forEach(
                function(message) {

                    const sender =
                        message.role === "user"
                            ? "YOU"
                            : "ARISU";


                    addMessage(
                        sender,
                        message.content
                    );

                }
            );
        }


        status.innerText =
            "SYSTEM ONLINE";


        await loadChatList();


    } catch (error) {

        console.error(
            "LOAD CHAT ERROR:",
            error
        );


        status.innerText =
            "CONNECTION ERROR";


        addMessage(
            "ARISU",
            "Unable to load this chat."
        );
    }
}
// ==========================================
// DELETE CHAT
// ==========================================

async function deleteChat(chatId) {

    if (!confirm("Delete this chat?")) {
        return;
    }

    const session =
        await getSession();

    if (!session) return;

    try {

        const response =
            await fetch(
                BACKEND_URL +
                "/api/chats/" +
                chatId,
                {
                    method: "DELETE",

                    headers: {
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
                "Unable to delete chat."
            );
        }


        if (
            String(currentChatId) ===
            String(chatId)
        ) {

            currentChatId = null;

            chatBox.innerHTML = "";

            addMessage(
                "ARISU",
                "Chat deleted. Start a new chat to continue."
            );
        }


        await loadChatList();


    } catch (error) {

        console.error(
            "DELETE CHAT ERROR:",
            error
        );

        alert(
            "Unable to delete chat."
        );
    }
}


// ==========================================
// MESSAGE DISPLAY
// ==========================================

function addMessage(sender, message) {

    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message";


    const senderDiv =
        document.createElement("div");

    senderDiv.className =
        "sender";

    senderDiv.innerText =
        sender;


    const textDiv =
        document.createElement("div");

    textDiv.className =
        "message-text";


    const safeText =
        String(message)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");


    let formatted =
        safeText;


    formatted =
        formatted.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    formatted =
        formatted.replace(
            /^## (.*)$/gm,
            "<h3>$1</h3>"
        );


    formatted =
        formatted.replace(
            /^- (.*)$/gm,
            "• $1"
        );


    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    textDiv.innerHTML =
        formatted;


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


    // Create chat if needed
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
                        message: command,
                        chat_id: currentChatId
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
// SEND BUTTON + ENTER
// ==========================================

sendBtn.addEventListener(
    "click",
    runCommand
);


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
// CLEAR CHAT DISPLAY
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


if (SpeechRecognition && micBtn) {

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


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
                    "MIC ERROR:",
                    error
                );
            }
        }
    );


    recognition.onresult =
        function(event) {

            const command =
                event.results[0][0]
                    .transcript;

            input.value =
                command;

            runCommand();
        };


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


    recognition.onend =
        function() {

            micBtn.innerText =
                "🎤";

            status.innerText =
                "SYSTEM ONLINE";
        };


} else if (micBtn) {

    micBtn.disabled = true;
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


        await loadChatList();


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

            await loadChat(
                data.chats[0].id
            );

        } else {

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
// START
// ==========================================

setTimeout(
    initializeARISU,
    700
);

// ==========================================
// LOGIN UI CONTROL
// ==========================================

function updateLoginUI(session) {

    const sidebar =
        document.getElementById("arisuSidebar");

    const app =
        document.getElementById("arisuApp");

    const auth =
        document.getElementById("authScreen");

    if (session) {

        if (auth) {
            auth.style.display = "none";
        }

        if (app) {
            app.style.display = "block";
        }

        if (sidebar) {
            sidebar.style.display = "none";
        }

        loadChatList();

    } else {

        if (auth) {
            auth.style.display = "flex";
        }

        if (app) {
            app.style.display = "none";
        }

        if (sidebar) {
            sidebar.style.display = "none";
        }

        currentChatId = null;
    }
}
