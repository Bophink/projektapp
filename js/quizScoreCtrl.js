quizApp.controller('quizScoreCtrl', function ($scope,quizModel,$routeParams,$window) {

	$scope.calculatePraise = function(){
		// calculates result feedback to user based on the total score
		var praiseDict = {
			'0':'Are you drunk?',
			'0.1':'Are you even trying?',
			'0.2':'Bruh...',
			'0.3':'Practice makes perfect',
			'0.4':'\"Good job\"',
			'0.5':'Good job!',
			'0.6':'Great!',
			'0.7':'Awesome',
			'0.8':'Wow!',
			'0.9':'Amazeballs!',
			'1':'Perfect score!'};
		var maxScore = quizModel.Quiz.questions.length * 10;
		console.log('Praise: ' + ($scope.getPoints()/maxScore).toString().substr(0,3));
		return praiseDict[($scope.getPoints()/maxScore).toString().substr(0,3)];
	}

	$scope.getQuestions = function(){
		// Saves all the questions in the quiz in an array. Calls a function to retrieve the song from Spotify API.
		$scope.questions = [];
		// Loops through all the questions in quiz and creates a temporary local question.
		for (var k=0; k < quizModel.Quiz.questions.length; k++){
			var localQ = quizModel.Quiz.questions[k];
	 		localQ['question'] = localQ['question'].slice(0,200);
	 		// Adds the local question to the scope
	 		$scope.questions.push(localQ);
	 		// Calls function to recieve song from Spoitfy API and add it to the question.
	 		$scope.getSong(k, localQ);
		}
	}

	$scope.getSong = function(k, question){
		// Retrieves track from Spotify
		quizModel.song.get({id:question.songId}, function(track){
			question.song = track.name;
			question.artist = track.artists[0].name;
			question.album = track.album.name;
			question.songImg = track.album.images[2].url;
			question.preview_url = track.preview_url;
			question.songId = track.id;
			// Overwrites the question in scope with the same question + track information due to asynchrounous call.
			$scope.questions[k] = question;
		});
	}

	$scope.getUserAnswers = function(){
		// Returns the saved user answers from the model.
		return quizModel.userAnswers;
	}

	$scope.getPoints = function(){
		// Returns the total quiz score from the model.
		return quizModel.getQuizResult();
	}

	$scope.getShareLink = function () {
		// Creates a shareable quiz link based on quiz ID.
		$scope.shareLinkPopup = false;
		$scope.shareLink = "http://localhost:8000/#/quiz/"+quizModel.Quiz.quizId;
	}

	$scope.getCreateNew = function () {
		// Sets pop-up variable to false so the pop-up window will show.
		$scope.createNewPopup = false;
		console.log("create new");
	}

	$scope.closePopups = function () {
		// Sets pop-up variables to true so the pop-up window will hide. Checkinput resets to false.
		$scope.shareLinkPopup = true;
		$scope.createNewPopup = true;
		$scope.checkInput = false;
	}

	$scope.createQuiz = function(title, creator) {
		// Calls model to create new quiz. Redirects to search when done.
		if(title === undefined || title === '' || creator === undefined || creator === ''){ // if title or creator is unexisting, tell the user.
			$scope.checkInput = true;
			console.log('Invalid input');
		}else{ // correct input
			$scope.checkInput = false;
			quizModel.createQuiz(title, creator);
			$scope.assignQuiz(quizModel.Quiz.quizId);
		}
	}

	$scope.assignQuiz = function(quizId) {
		// Redirects user to the search view when a new quiz is selected.
		var callback = function(){
			// Callback function for redirection due to asynchronous flow in the code.
			var win = angular.element($window); // Selects the window element.
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



	$scope.praise = $scope.calculatePraise(); 
	$scope.userAnswers = $scope.getUserAnswers();
	$scope.getQuestions();
	// Controls if popups is shown or not.
	$scope.shareLinkPopup = true;
	$scope.createNewPopup = true;
});