function processCommand(command) {

    command = command.toLowerCase().trim();


    // GREETING
    if (
        command.includes("hello") ||
        command.includes("hi") ||
        command.includes("hey arisu")
    ) {
        return "Hello. I am ARISU. How can I assist you?";
    }


    // WHO ARE YOU
    if (
        command.includes("who are you") ||
        command.includes("what are you")
    ) {
        return "I am ARISU, your Advanced Intelligent System.";
    }


    // TIME
    if (command.includes("time")) {

        const now = new Date();

        return "The current time is " +
            now.toLocaleTimeString();
    }


    // DATE
    if (command.includes("date")) {

        const now = new Date();

        return "Today's date is " +
            now.toLocaleDateString();
    }


    // OPEN YOUTUBE
    if (command.includes("youtube")) {

        window.open(
            "https://www.youtube.com",
            "_blank"
        );

        return "Opening YouTube.";
    }


    // OPEN GOOGLE
    if (command.includes("open google")) {

        window.open(
            "https://www.google.com",
            "_blank"
        );

        return "Opening Google.";
    }


    // SEARCH GOOGLE
    if (command.startsWith("search")) {

        const query =
            command.replace("search", "").trim();

        if (query !== "") {

            window.open(
                "https://www.google.com/search?q=" +
                encodeURIComponent(query),
                "_blank"
            );

            return "Searching Google for " + query;
        }

        return "What would you like me to search?";
    }


    // THANK YOU
    if (
        command.includes("thank you") ||
        command.includes("thanks")
    ) {
        return "You're welcome.";
    }


    // GOODBYE
    if (
        command.includes("bye") ||
        command.includes("goodbye")
    ) {
        return "Goodbye. I will be here when you need me.";
    }


    // UNKNOWN COMMAND
    return "I don't understand that command yet. My intelligence is still being developed.";
}
