quizApp.controller('homeCtrl', function ($scope, quizModel,$firebaseObject) {
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
		//firebaseRefQuiz = firebaseURL och lägga in skit etc
		console.log("Quiz skapas! " + title + creator);
		console.log(quizModel.Quiz);
	}
	$scope.assignQuiz = function(quiz) {
		quizModel.Quiz = quiz;
		console.log(quizModel.Quiz);
	}	

	var quizzes = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes");
	// download the data into a local object
	var syncObject = $firebaseObject(quizzes);
	// synchronize the object with a three-way data binding
	// click on `index.html` above to see it used in the DOM!
	syncObject.$bindTo($scope, "quizzes");



	//För de quiz som skall presenteras på förtsa sidan använd AngulatFire för att skapa en three-way binding!:)
})