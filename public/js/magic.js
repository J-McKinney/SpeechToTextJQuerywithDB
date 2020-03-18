$(document).ready(function () {
    window.SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
        let finalTranscript = "";
        let interimTranscript = "";
    let recognition = new window.SpeechRecognition();

    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.continuous = true;

    recognition.onresult = event => {
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += " " + transcript;
            } 
            else {
                interimTranscript += " " + transcript;
            }
        }

        document.querySelector("#transcriptField").innerHTML =
            finalTranscript;
            console.log(finalTranscript)
    };

    $("#startButton").on("click", function () {
        recognition.start()
    })
    $("#stopButton").on("click", function () {
        recognition.stop()
        // finalTranscript = "";
        interimTranscript = "";
    })
    $("#resetButton").on("click", function() {
        $("#transcriptField").empty()
        finalTranscript = "";
        interimTranscript = "";
    })
});
