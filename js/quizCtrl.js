quizApp.controller('quizCtrl', function ($scope,quizModel,$routeParams,$firebaseObject, $firebaseArray) {

	$scope.currentQPos = 0;
	$scope.qAnswered = false;
	quizModel.setQuizResult(0);
	quizModel.userAnswers = [];
	$scope.answers = [];
	$scope.points = 10;
	$scope.song = $('#songQ');

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

	$scope.shuffle = function(array) {
	 	var m = array.length, t, i;
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

		console.log("Move on!")
		if (quizModel.userAnswers[$scope.currentQPos] === undefined) {
			quizModel.userAnswers.push("no answer");
		}
		if (($scope.questions[$scope.currentQPos + 1]) != undefined) {
			$scope.currentQPos += 1;
			$scope.qAnswered = false;
			$scope.getNewAnswers();
			$scope.shuffledArray = $scope.shuffle($scope.answers);

			$scope.song.animate({volume: 1},500, function(){
				$scope.song[0].play();	
			});
		}
		else {
			window.location = ('#/quizScore');
		}
	}

	$scope.getPoints = function(){
		return quizModel.getQuizResult();
	}

	if($routeParams['quizId']){//Läs in quiz från Firebase
		quizModel.getQuiz($routeParams['quizId']);
		
	    //var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+$routeParams['quizId']);
	    // AJAX anropp för att läsa in data
	    //Dessa två AJAX anrop kankse kan läggas ihop?
	  /*  quizRef.on("value", function(snapshot) {
	    	$scope.Quiz = snapshot.val();
	    	console.log("Laddar in quiz "+$scope.Quiz.title);
	    }, function (errorObject) {
	    	console.log("The read failed: " + errorObject.code);
	    });*/


	    //var questionRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+$routeParams['quizId']+"/questions/");

	    // $scope.questions = $firebaseArray(questionRef);
	    // console.log($scope.questions);
	    

	    /*//AJAX
	    questionRef.on("value", function(snap){
	    	snap.forEach(function(childSnapshot) {
	    		var key= childSnapshot.key();
	    		$scope.questions.push(childSnapshot.val());//Lägger till frågorna i en lista.
	    		//console.log(key + childSnapshot.val());
	    	})
	    },function (errorObject) {
	    	console.log("The read failed: " + errorObject.code);
	    });
	    */

	    quizModel.Quiz.questions.$loaded().then(function(x){
	    	$scope.questions=quizModel.Quiz.questions;
	    	$scope.getNewAnswers();
			$scope.shuffledArray = $scope.shuffle($scope.answers);

			$scope.Quiz = quizModel.Quiz;
				

	    	
	    })
		
	  	

	}else{//ingen routeParam
	//Inläsning feån modellen
		console.log("läs från modellen")
		$scope.Quiz = quizModel.Quiz;
		//console.log($scope.Quiz);
		$scope.questions = quizModel.Quiz.questions;
		//console.log($scope.questions);
		$scope.getNewAnswers();
		$scope.shuffledArray = $scope.shuffle($scope.answers);
		//quizModel.Quiz = $scope.Quiz; 	
	}	
});

quizApp.directive("quizAudio", function(){
    return function($scope, element, attrs){
        element.bind("timeupdate", function(){
        	if(!$scope.qAnswered){
	            $scope.timeElapsed = element[0].currentTime;
	            if ($scope.timeElapsed < 3){
	            	$scope.points = 10;
	            }else if ($scope.timeElapsed > 3 && $scope.timeElapsed <= 6){
	            	$scope.points = 9;
	            }else if ($scope.timeElapsed > 6  && $scope.timeElapsed <= 9){
	            	$scope.points = 8;
	            }else if ($scope.timeElapsed > 9  && $scope.timeElapsed <= 12){
	            	$scope.points = 7;
	            }else if ($scope.timeElapsed > 12  && $scope.timeElapsed <= 15){
	            	$scope.points = 6;
	            }else if ($scope.timeElapsed > 15  && $scope.timeElapsed <= 19){
	            	$scope.points = 5;
	            }else if ($scope.timeElapsed > 19  && $scope.timeElapsed <= 23){
	            	$scope.points = 4;
	            }else if ($scope.timeElapsed > 23  && $scope.timeElapsed <= 26){
	            	$scope.points = 3;
	            }else if ($scope.timeElapsed > 26  && $scope.timeElapsed <= 29){
	            	$scope.points = 2;
	            }else if ($scope.timeElapsed > 29){
	            	$scope.points = 1;
	            	$scope.song.animate({volume: 0}, 500);
	            }
	        }
            $scope.$apply();
        });
    }
});