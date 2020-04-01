$(document).ready(function() {
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
      } else {
        interimTranscript += " " + transcript;
      }
    }

    document.querySelector("#transcriptField").innerHTML = finalTranscript;
    console.log(finalTranscript);
  };

  $("#startButton").on("click", function() {
    $("#transcriptField").empty();
    interimTranscript = "";
    finalTranscript = "";
    recognition.start();
    document.getElementById("stopButton").disabled = false;
    document.getElementById("startButton").disabled = true;
    document.getElementById("submitButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
  });

  $("#stopButton").on("click", function() {
    recognition.stop();
    document.getElementById("stopButton").disabled = true;
    document.getElementById("submitButton").disabled = false;
    document.getElementById("resetButton").disabled = false;
  });

  $("#resetButton").on("click", function() {
    $("#transcriptField").empty();
    finalTranscript = "";
    interimTranscript = "";
    document.getElementById("startButton").disabled = false;
    document.getElementById("stopButton").disabled = true;
    document.getElementById("submitButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
  });

  // Loads results onto the page
  function getResults() {
    // Empty any results currently on the page
    $("#submitField").empty();
    // Grab all of the current notes
    $.getJSON("/all", function(data) {
      // For each note...
      for (var i = 0; i < data.length; i++) {
        // ...populate #results with a p-tag that includes the note's title and object id
        $("#submitField").prepend(
          "<p class='data-entry' data-id=" +
            data[i]._id +
            "><span class='dataTitle' data-id=" +
            data[i]._id +
            ">" +
            data[i].title +
            "</span><span class=delete>X</span></p>"
        );
      }
    });
  }

  // Runs the getResults function as soon as the script is executed
  getResults();

  $(document).on("click", "#submitButton", function() {
    $("#transcriptField").empty();
    // finalTranscript = "";
    interimTranscript = "";
    // AJAX POST call to the submit route on the server
    // This will take the data from the div and send it to the server
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/submit",
      data: {
        sentence: finalTranscript,
        created: Date.now()
      }
    })
      // If that API call succeeds, add the title and a delete button for the note to the page
      .then(function(data) {
        // Add the title and delete button to the #submitField section
        $("#submitField").prepend(
          "<p class='data-entry' data-id=" +
            data._id +
            "><span class='dataTitle' data-id=" +
            data._id +
            ">" +
            data.sentence +
            "</span></p>"
        );
        ///////////////////////////////////////////////////
        // Clear the note and title inputs on the page   //
        $("#transcriptField").val(""); ////////////////////
        ///////////////////////////////////////////////////
      });
    document.getElementById("startButton").disabled = false;
    document.getElementById("stopButton").disabled = true;
    document.getElementById("submitButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
  });

  // When the #clear-all button is pressed
  $("#clear-all").on("click", function() {
    // Make an AJAX GET request to delete the notes from the db
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "/clearall",
      // On a successful call, clear the #results section
      success: function(response) {
        $("#submitField").empty();
      }
    });
  });
});
