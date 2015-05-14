quizApp.controller('quizCtrl', function ($scope,quizModel,$routeParams,$firebaseObject, $firebaseArray) {

	$scope.currentQPos = 0;
	$scope.qAnswered = false;
	quizModel.setQuizResult(0);
	quizModel.userAnswers = [];
	$scope.answers = [];
	$scope.points = 10;

	//gets answers for each question
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

	//a general algortihm used for sorting items in an array in a random order
	//used to sort our questions so that we get a random order of the answers
	$scope.shuffle = function(array) {
	 	var m = array.length, t, i;
		  while (m) {
		    // Pick a remaining element
		    i = Math.floor(Math.random() * m--);
		    // And swap it with the current element.
		    t = array[m];
		    array[m] = array[i];
		    array[i] = t;
		  }
	  return array;
	}

	//Checks if answer is right and adds points if it is. Saves what user answered for results
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
		//If the user did not answer in time, we push no answer.
		if (quizModel.userAnswers[$scope.currentQPos] === undefined) {
			quizModel.userAnswers.push("no answer");
		}
		//If there still are questions in the quiz, get new answers and randomize them
		//Else go to quizScore (results page).
		if (($scope.questions[$scope.currentQPos + 1]) != undefined) {
			$scope.currentQPos += 1;
			$scope.qAnswered = false;
			$scope.getNewAnswers();
			$scope.shuffledArray = $scope.shuffle($scope.answers);
		}
		else {
			window.location = ('#/quizScore');
		}
	}
	//Gets points from quizModel from the quiz
	$scope.getPoints = function(){
		return quizModel.getQuizResult();
	}


	//Checks route parameters to decide if the quiz is played locally through model or through database
	//Runs the quiz from database
	if($routeParams['quizId']){
		console.log('läs från firebase!')
		quizModel.getQuiz($routeParams['quizId']);
		$scope.loading=true;
		console.log($scope.loading);
		
	    quizModel.Quiz.questions.$loaded().then(function(x){
	    	$scope.loading=false;
	    	console.log($scope.loading);
	    	$scope.questions=quizModel.Quiz.questions;
	    	$scope.getNewAnswers();
			$scope.shuffledArray = $scope.shuffle($scope.answers);

			$scope.Quiz = quizModel.Quiz;
		   	
		}); 	
    //Runs quiz from model
	}else{
		console.log("läs från modellen")
		$scope.Quiz = quizModel.Quiz;
		$scope.questions = quizModel.Quiz.questions;
		$scope.getNewAnswers();
		$scope.shuffledArray = $scope.shuffle($scope.answers);
	}	
});

