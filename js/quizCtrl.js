quizApp.controller('quizCtrl', function ($scope,quizModel,$routeParams,$sce) {



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
		if (answer === $scope.Quiz.questions[$scope.currentQPos].answers['a']){
			alert("Rätt");
			quizModel.setQuizResult(1);
			console.log("Spain, deux points: " + quizModel.getQuizResult())
			
			//add points, routea till nästa question med en increment i position eller dyl.
		}
		else {
			alert("Fel!");
			//routea till nästa med increment
		}
		quizModel.userAnswers.push(answer);
		//console.log(quizModel.userAnswers[$scope.currentQPos]);
		if (($scope.Quiz.questions[$scope.currentQPos + 1]) != undefined) {
			console.log($scope.Quiz.questions[$scope.currentQPos].position);
			window.location = ("#/quiz/" + ($scope.Quiz.questions[$scope.currentQPos].position + 1));
		}
		else {
			window.location = ('#/quizScore');
		}
	}

	$scope.getPoints = function(){
		console.log('getPoints(): ' + quizModel.getQuizResult());
		return quizModel.getQuizResult();
	}

	$scope.currentQPos = $routeParams.quizId - 1; //ÄNDRA SEN SÅ ATT DET INTE HETER QUZIID

	quizModel.song.get({id:quizModel.Quiz.questions[$scope.currentQPos].songId}, function(data){
		$scope.track = data;
		$scope.waitingForInput = false;
	});

	$scope.Quiz = quizModel.Quiz;
	//console.log($scope.Quiz);
	//console.log($scope.Quiz.questions[0].answers);
	$scope.answers = [];

	for (var i in $scope.Quiz.questions[$scope.currentQPos].answers) { //ÄNDRA SÅ ATT DEN INCREMENTAR QUESTIONS NÄR MAN KLICKAR PÅ NÄSTA FRÅGA! DEN SKA VARA POSITION
		$scope.answers.push($scope.Quiz.questions[$scope.currentQPos].answers[i]);
	}

	$scope.shuffledArray = $scope.shuffle($scope.answers);
	//$scope.answers = $scope.Quiz.questions[0].answers;


});