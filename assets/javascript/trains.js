// Initialize Firebase
var config = {
    apiKey: "AIzaSyC5DcOofEnrc5oiiFu916uD3qEnSsye3xo",
    authDomain: "trains-e0f49.firebaseapp.com",
    databaseURL: "https://trains-e0f49.firebaseio.com",
    projectId: "trains-e0f49",
    storageBucket: "trains-e0f49.appspot.com",
    messagingSenderId: "750729885781"
};
firebase.initializeApp(config);

var database = firebase.database();
$(document).ready(function () {
    var timepicker = new TimePicker('f-train', {
        lang: 'en',
        theme: 'dark'
    });
    timepicker.on('change', function (evt) {
        var value = (evt.hour || '00') + ':' + (evt.minute || '00');
        evt.element.value = value;
    });
    $(document).on("click", "#t-submit", function (event) {
        event.preventDefault();
        if ($("#t-name").val() && $("#dest").val() && $("#f-train").val() && $("#freq").val()) {
            database.ref("trains").push({
                name: $("#t-name").val(),
                destination: $("#dest").val(),
                firstTrain: $("#f-train").val(),
                frequency: $("#freq").val(),
            });
            $("#t-name").val("");
            $("#dest").val("");
            $("#f-train").val("");
            $("#freq").val("");
        }
    });
    database.ref("trains").on("child_added", function (child) {
        var train = child.val();
        var newTrain = $("<tr>");
        for (var t = 0; t < 24; t++) {
            var time = (moment(train.firstTrain, "hh:mm").add(t * train.frequency, "m")).diff(moment());
            if (time < 0) {
                continue;
            }
            var nextTrain = time;
            t = 24;
        };

        if (nextTrain < moment("23:59:59", "HH:mm:ss").diff(moment())) {
            var nextTrainAt = moment().add(nextTrain).format("HH:mm");
            var nextTrainIn = moment.duration(nextTrain).minutes();
            newTrain.append($("<td>").text(train.name), $("<td>").text(train.destination), $("<td>").text(train.frequency), $("<td>").text(nextTrainAt), $("<td>").text(nextTrainIn));
        } else {
            newTrain.append($("<td>").text(train.name), $("<td>").text(train.destination), $("<td>").text(train.frequency), $("<td>").text("try again tomorrow"), $("<td>").text("better luck next time"));
        }
        $("table").append(newTrain);
    });




});
