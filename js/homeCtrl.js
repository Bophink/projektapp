quizApp.controller('homeCtrl', function ($scope, quizModel,$firebaseObject) {
	var location = window.location.hash.split("/");
	$scope.position = location[0]+"/"+location[1];
	//tar ej hänsyn till sista paremtern i quiz och track

	
	
	

	$('#form').hide();
	$scope.showForm= function(){
		$('#form').show();
	}

	$scope.createNew = function(){
		$('#form').hide();
		console.log("dags att skapa en ny");
		quizModel.createQuiz($scope.title, $scope.creator);
	}
})