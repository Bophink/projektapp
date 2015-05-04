quizApp.controller('homeCtrl', function ($scope, quizModel,$firebaseObject, $firebaseArray) {
	var location = window.location.hash.split("/");
	$scope.position = location[0]+"/"+location[1];
	//tar ej hänsyn till sista paremtern i quiz och track

	//Använd ng-show och ng-hide istället
	$scope.isClicked = false;

	$scope.clicked = function() {
		if ($scope.isClicked === true) {
			$scope.isClicked = false;
		}
		else {
			$scope.isClicked = true;
		}
	}

	$scope.createQuiz = function(title, creator) {
		quizModel.createQuiz(title, creator);
		$scope.assignQuiz(quizModel.Quiz.quizId);

	}

	$scope.assignQuiz = function(quizId) {
		var callback = function(){
			if (quizModel.carouselPosition > ((quizModel.Quiz.questions.length+1)*-220)+$(window).width()){
				quizModel.carouselSlideTo = ((quizModel.Quiz.questions.length+1)*-220)+$(window).width(); 
			}
			window.location ="#/search";
		}
		if(quizModel.Quiz.quizId != quizId){
			quizModel.getQuiz(quizId,callback);
		}else{
			callback();
		}
	}

	$scope.goToQuiz = function(quizId){
		// accesses the quiz
		quizModel.getQuiz(quizId);
		// when the quiz has loaded check if it has any questions. If not, return. Else go play the quiz!
		quizModel.Quiz.questions.$loaded().then(function(x){
			if(quizModel.Quiz.questions.length < 1){
				return
			}else{
				window.location ="#/quiz/"+quizId;
			}
		});
	}	

	var quizzes = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes");
	// download the data into a local object
	$scope.quizzes = $firebaseArray(quizzes);

	// creates an array to store front image for quiz
	$scope.quizImgs = [];
	// when the quizzes are loaded:
	$scope.quizzes.$loaded().then(function(x){
		for(var quiz in $scope.quizzes){
			// sets a variable for the limit of images
			var limit = 0;
			// checks if a quiz does not have any questions
			if($scope.quizzes[quiz].questions === undefined){
				// adds placeholder image
				$scope.quizImgs.push('http://www.cs.odu.edu/~acm/img/portrait_placeholder.png')
			}
			// adds the first image in quiz to quizImgs.
			for(var question in $scope.quizzes[quiz].questions){
				if(limit != 1){
					$scope.quizImgs.push($scope.quizzes[quiz].questions[question].img);
					limit++;
				}	
			}
		}
	});
});
