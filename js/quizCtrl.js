quizApp.controller('quizCtrl', function ($scope,quizModel,$routeParams,$sce) {


	$scope.currentQPos = 0; //ÄNDRA SEN SÅ ATT DET INTE HETER QUZIID
	$scope.qAnswered = false;
	quizModel.setQuizResult(0);
	quizModel.userAnswers = [];

	$scope.Quiz = quizModel.Quiz;
	$scope.answers = [];
	$scope.points = 10;
	$scope.song = $('#songQ');

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
				quizModel.setQuizResult(quizModel.getQuizResult() + $scope.points);
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

			$scope.song.animate({volume: 1},500, function(){
				$scope.song[0].play();	
			});
			//window.location = ("#/quiz");
		}
		else {
			window.location = ('#/quizScore');
		}
	}

	$scope.getPoints = function(){
		return quizModel.getQuizResult();
	}

	$scope.stopAudio = function() {
		// resets audio-timer
		//setTimeout(function() {song.animate({volume: 0}, 2000)},28000);
		// $scope.song.animate({volume: 0}, 500, function(){
		// 	$scope.song[0].pause();
		// });
		console.log("click");
	}

	$scope.getNewAnswers();
	$scope.shuffledArray = $scope.shuffle($scope.answers);
});

quizApp.directive("quizAudio", function(){
    return function($scope, element, attrs){
        element.bind("timeupdate", function(){
        	if(!$scope.qAnswered){
	            $scope.timeElapsed = element[0].currentTime;
	            if ($scope.timeElapsed < 3){
	            	$scope.points = 10;
	            }else if ($scope.timeElapsed > 3 && $scope.timeElapsed <= 6){
	            	$scope.points = 9;
	            	console.log("9");
	            }else if ($scope.timeElapsed > 6  && $scope.timeElapsed <= 9){
	            	$scope.points = 8;
	            }else if ($scope.timeElapsed > 9  && $scope.timeElapsed <= 12){
	            	$scope.points = 7;
	            }else if ($scope.timeElapsed > 12  && $scope.timeElapsed <= 15){
	            	$scope.points = 6;
	            }else if ($scope.timeElapsed > 15  && $scope.timeElapsed <= 19){
	            	$scope.points = 5;
	            }else if ($scope.timeElapsed > 19  && $scope.timeElapsed <= 23){
	            	$scope.points = 4;
	            }else if ($scope.timeElapsed > 23  && $scope.timeElapsed <= 26){
	            	$scope.points = 3;
	            }else if ($scope.timeElapsed > 26  && $scope.timeElapsed <= 29){
	            	$scope.points = 2;
	            }else if ($scope.timeElapsed > 29){
	            	$scope.points = 1;
	            	$scope.song.animate({volume: 0}, 500);
	            }
	        }
            $scope.$apply();
        });
    }
});