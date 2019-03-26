	//firebase initialization
var config = {
  apiKey: "AIzaSyA23LVZdEzl0Et4pPx--Ebfnby5iaSf6gM",
  authDomain: "train-schedule-bc72a.firebaseapp.com",
  databaseURL: "https://train-schedule-bc72a.firebaseio.com",
  projectId: "train-schedule-bc72a",
  storageBucket: "train-schedule-bc72a.appspot.com",
  messagingSenderId: "665059625790"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

//Declaring current time
var currentTime = moment().format();

//Logging current time
	console.log("Current Time: " + currentTime);
				
//When the submit button is clicked, we will run the snapshot function below.
$("#click-button").on("click", function() {
      // Prevent the page from refreshing
      event.preventDefault();

      // Grabs user input
	  var trainNameForm = $("#trainNameForm").val().trim();
	  var destinationForm = $("#destinationForm").val().trim();
	  var trainTimeForm = moment($("#trainTimeForm").val().trim(), "HH:mm").format("HH:mm");
	//Saving this goodness
//	  var frequencyForm = moment($("#frequencyForm").val().trim().format("mm"));
	  var frequencyForm = $("#frequencyForm").val().trim();

	  // Creates local "temporary" object for holding inputs
	  var newTrain = {
		train: trainNameForm,
		destination: destinationForm,
		first: trainTimeForm,
		frequency: frequencyForm
    };
	//Setting new values in the database
	database.ref().push(newTrain);
	
	//Console.logging to make sure the new data has been stored to the database
	console.log(newTrain.train);
  	console.log(newTrain.destination);
	console.log(newTrain.first);
	console.log(newTrain.frequency);
	
	//Clearing the inputs
	 $("#trainNameForm").val("");
  	 $("#destinationForm").val("");
	 $("#trainTimeForm").val("");
	 $("#frequencyForm").val("");
});

//Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());
	
  // Store everything into a variable.
  var trainName = childSnapshot.val().train;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;
  
  //Variable to figure out the converted train time
  var trainTimeConverted = moment(trainTime, "HH:mm");
	
  //Declaring a time difference variable
  var timeDifference = moment().diff(moment(trainTimeConverted), "minutes");
	console.log(timeDifference);
	
  var frequencyMinutes = childSnapshot.val().frequency;
	console.log("Frequency Minutes: " + frequencyMinutes);
  
  var minutesAway = Math.abs(timeDifference % frequencyMinutes);
  	console.log("Minutes Away: " + minutesAway);
  
  var nextArrival = moment(currentTime).add(minutesAway, "minutes").format("hh:mm A");
	console.log("Next Arrival: " + nextArrival);
	
	
  //Adding into the table
  $("#trainScheduleTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});