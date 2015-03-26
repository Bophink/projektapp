quizApp.controller('homeCtrl', function ($scope, quizModel,$firebaseObject) {
	var location = window.location.hash.split("/");
	$scope.position = location[0]+"/"+location[1];
	//tar ej hänsyn till sista paremtern i quiz och track

	
	
	//Använd ng-show och ng-hide istället

	$('#form').hide();
	$scope.showForm= function(){
		$('#form').show();
	}

	$scope.createNew = function(){
		$('#form').hide();
		console.log("dags att skapa en ny");
		quizModel.createQuiz($scope.title, $scope.creator);
		window.location = "#/search/";
	}

	var quizzes = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes");
	// download the data into a local object
	var syncObject = $firebaseObject(quizzes);
	// synchronize the object with a three-way data binding
	// click on `index.html` above to see it used in the DOM!
	syncObject.$bindTo($scope, "quizzes");



	//För de quiz som skall presenteras på förtsa sidan använd AngulatFire för att skapa en three-way binding!:)
})