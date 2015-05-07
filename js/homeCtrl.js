quizApp.controller('homeCtrl', function ($scope, $window, quizModel,$firebaseObject, $firebaseArray) {
	var location = window.location.hash.split("/");
	$scope.position = location[0]+"/"+location[1];
	//tar ej hänsyn till sista paremtern i quiz och track

	//Använd ng-show och ng-hide istället
	$scope.createNewPopup =  true;
	$scope.shareLinkPopup = true;
	$scope.getCreateNew = function () {
		$scope.createNewPopup = false;
		console.log("create new");
	}

	$scope.closePopups = function (size) {
		$scope.shareLinkPopup = true;
		$scope.createNewPopup = true;
	}

	$scope.getShareLink = function (quizId) {
		$scope.shareLinkPopup = false;
		$scope.shareLink = "http://localhost:8000/#/quiz/"+quizId;
		console.log($scope.shareLink);
	}

	$scope.createQuiz = function(title, creator) {
		quizModel.createQuiz(title, creator);
		$scope.assignQuiz(quizModel.Quiz.quizId);

	}

	$scope.assignQuiz = function(quizId) {
		var callback = function(){
			var win = angular.element($window);
			if (quizModel.carouselPosition > ((quizModel.Quiz.questions.length+1)*-220)+win.width()){
				quizModel.carouselSlideTo = ((quizModel.Quiz.questions.length+1)*-220)+win.width(); 
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
				window.location ="#/quiz/";
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
				break;
			}else if($scope.quizzes[quiz].questions === ''){
				// adds placeholder image
				$scope.quizImgs.push('img/quizPlaceholder.png');
			}else{
				// adds the first image in quiz to quizImgs.
				for(var question in $scope.quizzes[quiz].questions){
					if(limit != 1){
						$scope.quizImgs.push($scope.quizzes[quiz].questions[question].img);
						limit++;
					}
				}	
			}
		}
	});
});
