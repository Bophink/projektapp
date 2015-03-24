quizApp.controller('quizCtrl', function ($scope,quizModel,$routeParams,$sce) {


	$scope.currentQPos = 0; //ÄNDRA SEN SÅ ATT DET INTE HETER QUZIID
	$scope.qAnswered = false;
	quizModel.setQuizResult(0);
	quizModel.userAnswers = [];

	$scope.Quiz = quizModel.Quiz;
	$scope.answers = [];

	$scope.getNewAnswers = function() {
		$scope.answers = [];
		for (var i in $scope.Quiz.questions[$scope.currentQPos].answers) { //ÄNDRA SÅ ATT DEN INCREMENTAR QUESTIONS NÄR MAN KLICKAR PÅ NÄSTA FRÅGA! DEN SKA VARA POSITION
		$scope.answers.push($scope.Quiz.questions[$scope.currentQPos].answers[i]);
		}
		quizModel.song.get({id:quizModel.Quiz.questions[$scope.currentQPos].songId}, function(data){
			$scope.track = data;
			$scope.waitingForInput = false;
		});
	}

	$scope.shuffle = function(array) {
	 	var m = array.length, t, i;

		  // While there remain elements to shuffle…
		  while (m) {

		    // Pick a remaining element…
		    i = Math.floor(Math.random() * m--);

		    // And swap it with the current element.
		    t = array[m];
		    array[m] = array[i];
		    array[i] = t;
		  }

	  return array;
	}

	$scope.checkAnswer = function(answer) {
		if ($scope.qAnswered != true){
			if (answer === $scope.Quiz.questions[$scope.currentQPos].answers['a']){
				quizModel.setQuizResult(quizModel.getQuizResult() + 1);
				//add points, routea till nästa question med en increment i position eller dyl.
			}
			quizModel.userAnswers.push(answer);
		}

		$scope.correctAnswer = $scope.Quiz.questions[$scope.currentQPos].answers['a'];
		$scope.falseAnswers = [$scope.Quiz.questions[$scope.currentQPos].answers['b'], $scope.Quiz.questions[$scope.currentQPos].answers['c'], $scope.Quiz.questions[$scope.currentQPos].answers['d']];
		$scope.qAnswered = true;
	}


	$scope.moveOn = function() {
		$scope.correctAnswer = null;
		$scope.falseAnswers = null;

		console.log("Move on!")
		if (quizModel.userAnswers[$scope.currentQPos] === undefined) {
			quizModel.userAnswers.push("no answer");
		}
		if (($scope.Quiz.questions[$scope.currentQPos + 1]) != undefined) {
			$scope.currentQPos += 1;
			$scope.qAnswered = false;
			$scope.getNewAnswers();
			$scope.shuffledArray = $scope.shuffle($scope.answers);
			//window.location = ("#/quiz");
		}
		else {
			window.location = ('#/quizScore');
		}
	}

	$scope.getPoints = function(){
		return quizModel.getQuizResult();
	}

	$scope.resetTime = function() {
		
		// resets audio-timer
		song.currentTime = 0;
		setTimeout(function() {song.animate({volume: 0}, 2000)},28000);
	}

	$scope.getNewAnswers();
	$scope.shuffledArray = $scope.shuffle($scope.answers);
	$scope.song = $('#quizAudio');
	console.log($scope.song.currentTime);


	$("#progressTimer").progressTimer({
		// limit in seconds
	    timeLimit: 30,
	    // seconds remaining when the timer changes to warning
	    warningThreshold: 5,
	    baseStyle: 'progress-bar-warning',
	    warningStyle: 'progress-bar-danger',
	    completeStyle: 'progress-bar-success',
	    onFinish: function() {
	        console.log("I'm done");
	    }
	});


});