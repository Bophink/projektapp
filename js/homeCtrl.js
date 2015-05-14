quizApp.controller('homeCtrl', function ($scope, $window, quizModel,$firebaseObject, $firebaseArray) {
	var location = window.location.hash.split("/");
	$scope.position = location[0]+"/"+location[1];

	//Variables to know when to open and close pop-ups
	$scope.createNewPopup =  true;
	$scope.shareLinkPopup = true;

	$scope.getCreateNew = function () {
		$scope.createNewPopup = false;
	}
	//Closes pop-ups
	$scope.closePopups = function (size) {
		$scope.shareLinkPopup = true;
		$scope.createNewPopup = true;
		$scope.checkInput = false;
	}

	//Gets a link to share with other people
	$scope.getShareLink = function (quizId) {
		$scope.shareLinkPopup = false;
		$scope.shareLink = "http://localhost:8000/#/quiz/"+quizId;
	}

	//Creates quiz-object in the model if parameters are valid
	$scope.createQuiz = function(title, creator){
		if(title === undefined || title === '' || creator === undefined || creator === ''){
			$scope.checkInput = true;
			console.log('Invalid input');
		}else{
			$scope.checkInput = false;
			quizModel.createQuiz(title, creator);
			$scope.assignQuiz(quizModel.Quiz.quizId);
		}
	}

	//Makes the selected quiz the current and editable quiz
	$scope.assignQuiz = function(quizId) {
		var callback = function(){
			//slides the carousel to last element
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
	//Takes the user to play the selected quiz
	$scope.goToQuiz = function(quizId){
		window.location ="#/quiz/"+quizId;
	}	

	var quizzes = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes");
	// download the data into a local object
	$scope.quizzes = $firebaseArray(quizzes);

	// creates an array to store front image for quiz
	$scope.quizImgs = [];
	// when the quizzes are loaded, look after images in each quiz or add placeholder if there are none
	//The quizImgs is used to display a picture for each quiz on the home page
	$scope.quizzes.$loaded().then(function(x){
		for(var quiz= 0;  quiz<$scope.quizzes.length; quiz++){
			// sets a variable for the limit of images
			var limit = 0;
			// checks if a quiz does not have any questions and adds a placeholder image.
			if($scope.quizzes[quiz].questions === undefined){
				$scope.quizImgs.push('img/quizPlaceholder.png');
			}
			else{
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
