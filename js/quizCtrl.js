quizApp.controller('quizCtrl', function ($scope,quizModel,$routeParams,$firebaseObject, $firebaseArray) {

	$scope.currentQPos = 0;
	$scope.qAnswered = false;
	quizModel.setQuizResult(0);
	quizModel.userAnswers = [];
	$scope.answers = [];
	$scope.points = 10;

	$scope.getNewAnswers = function() {
		$scope.answers = [];
		console.log($scope.questions[$scope.currentQPos]);
		for (var i in $scope.questions[$scope.currentQPos].answers) {
			$scope.answers.push($scope.questions[$scope.currentQPos].answers[i]);
		}
		quizModel.song.get({id:$scope.questions[$scope.currentQPos].songId}, function(data){
			$scope.track = data;
			$scope.waitingForInput = false;
		});
	}

	$scope.shuffle = function(array) {
	 	var m = array.length, t, i;
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
			if (answer === $scope.questions[$scope.currentQPos].answers['a']){
				quizModel.setQuizResult(quizModel.getQuizResult() + $scope.points);
				//add points, routea till nästa question med en increment i position eller dyl.
			}else{
				$scope.points = 0;
			}
			quizModel.userAnswers.push(answer);
		}
		$scope.correctAnswer = $scope.questions[$scope.currentQPos].answers['a'];
		$scope.falseAnswers = [$scope.questions[$scope.currentQPos].answers['b'], $scope.questions[$scope.currentQPos].answers['c'], $scope.questions[$scope.currentQPos].answers['d']];
		$scope.qAnswered = true;
	}

	$scope.moveOn = function() {
		$scope.correctAnswer = null;
		$scope.falseAnswers = null;

		console.log("Move on!")
		if (quizModel.userAnswers[$scope.currentQPos] === undefined) {
			quizModel.userAnswers.push("no answer");
		}
		if (($scope.questions[$scope.currentQPos + 1]) != undefined) {
			$scope.currentQPos += 1;
			$scope.qAnswered = false;
			$scope.getNewAnswers();
			$scope.shuffledArray = $scope.shuffle($scope.answers);

			// $scope.song.animate({volume: 1},500, function(){
			// 	$scope.song[0].play();	
			// });
		}
		else {
			window.location = ('#/quizScore');
		}
	}

	$scope.getPoints = function(){
		return quizModel.getQuizResult();
	}

	if($routeParams['quizId']){//Läs in quiz från Firebase
		console.log('läs från firebase!')
		//quizModel.getQuiz($routeParams['quizId']);
		
	    quizModel.Quiz.questions.$loaded().then(function(x){
	    	$scope.questions=quizModel.Quiz.questions;
	    	$scope.getNewAnswers();
			$scope.shuffledArray = $scope.shuffle($scope.answers);

			$scope.Quiz = quizModel.Quiz;
		   	
		}); 	

	}else{//ingen routeParam
	//Inläsning feån modellen
		console.log("läs från modellen")
		$scope.Quiz = quizModel.Quiz;
		//console.log($scope.Quiz);
		$scope.questions = quizModel.Quiz.questions;
		//console.log($scope.questions);
		$scope.getNewAnswers();
		$scope.shuffledArray = $scope.shuffle($scope.answers);
		//quizModel.Quiz = $scope.Quiz; 	
	}	
});

