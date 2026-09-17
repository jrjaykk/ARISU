const input =
    document.getElementById("commandInput");

const sendBtn =
    document.getElementById("sendBtn");

const micBtn =
    document.getElementById("micBtn");

const response =
    document.getElementById("response");

const status =
    document.getElementById("status");


// ==========================
// ARISU VOICE
// ==========================

function speak(text) {

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 0.95;
    speech.pitch = 0.85;
    speech.volume = 1;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(speech);
}


// ==========================
// RUN COMMAND
// ==========================

function runCommand() {

    const command =
        input.value.trim();

    if (command === "") {
        return;
    }


    status.innerText =
        "PROCESSING...";


    const answer =
        processCommand(command);


    response.innerText =
        answer;


    speak(answer);


    input.value = "";


    setTimeout(() => {

        status.innerText =
            "SYSTEM ONLINE";

    }, 1000);
}


// ==========================
// SEND BUTTON
// ==========================

sendBtn.addEventListener(
    "click",
    runCommand
);


// ==========================
// ENTER KEY
// ==========================

input.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            runCommand();

        }

    }
);


// ==========================
// VOICE RECOGNITION
// ==========================

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


    // MIC CLICK

    micBtn.addEventListener(
        "click",
        function() {

            status.innerText =
                "LISTENING...";

            micBtn.innerText =
                "🔴";

            recognition.start();

        }
    );


    // RESULT

    recognition.onresult =
        function(event) {

            const command =
                event.results[0][0]
                .transcript;


            input.value =
                command;


            runCommand();

        };


    // ERROR

    recognition.onerror =
        function() {

            status.innerText =
                "MIC ERROR";

            response.innerText =
                "I could not hear you. Please try again.";

            micBtn.innerText =
                "🎤";

        };


    // END

    recognition.onend =
        function() {

            micBtn.innerText =
                "🎤";

            setTimeout(() => {

                status.innerText =
                    "SYSTEM ONLINE";

            }, 500);

        };

} else {

    micBtn.disabled = true;

    response.innerText =
        "Voice recognition is not supported in this browser.";
}
