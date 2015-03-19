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
		if (answer === $scope.Quiz.questions[0].answers['a']){
			alert("Rätt");
			//add points, routea till nästa question med en increment i position eller dyl.
		}
		else {
			alert("Fel!");
			//routea till nästa med increment
		}
	}


	$scope.Quiz = quizModel.Quiz;
	//console.log($scope.Quiz);
	//console.log($scope.Quiz.questions[0].answers);
	$scope.answers = [];

	for (i in $scope.Quiz.questions[0].answers) { //ÄNDRA SÅ ATT DEN INCREMENTAR QUESTIONS NÄR MAN KLICKAR PÅ NÄSTA FRÅGA! DEN SKA VARA POSITION
		$scope.answers.push($scope.Quiz.questions[0].answers[i]);
	}

	$scope.shuffledArray = $scope.shuffle($scope.answers);
	//$scope.answers = $scope.Quiz.questions[0].answers;




});