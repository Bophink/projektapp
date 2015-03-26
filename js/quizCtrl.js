quizApp.controller('quizCtrl', function ($scope,quizModel,$routeParams,$firebaseObject) {



	$scope.currentQPos = 0; //ÄNDRA SEN SÅ ATT DET INTE HETER QUZIID
	$scope.qAnswered = false;
	quizModel.setQuizResult(0);
	quizModel.userAnswers = [];
	$scope.answers = [];
	$scope.points = 10;
	$scope.song = $('#songQ');



	

	$scope.getNewAnswers = function() {
		$scope.answers = [];
		
		for (var i in $scope.questions[$scope.currentQPos].answers) { //ÄNDRA SÅ ATT DEN INCREMENTAR QUESTIONS NÄR MAN KLICKAR PÅ NÄSTA FRÅGA! DEN SKA VARA POSITION
		$scope.answers.push($scope.questions[$scope.currentQPos].answers[i]);
		}
		quizModel.song.get({id:$scope.questions[$scope.currentQPos].songId}, function(data){
			$scope.track = data;
			$scope.waitingForInput = false;
		});
	}

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
		if ($scope.qAnswered != true){
			if (answer === $scope.questions[$scope.currentQPos].answers['a']){
				quizModel.setQuizResult(quizModel.getQuizResult() + $scope.points);
				//add points, routea till nästa question med en increment i position eller dyl.
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
			//window.location = ("#/quiz");
		}
		else {
			window.location = ('#/quizScore');
		}
	}

	$scope.getPoints = function(){
		return quizModel.getQuizResult();
	}

	$scope.stopAudio = function() {
		// resets audio-timer
		//setTimeout(function() {song.animate({volume: 0}, 2000)},28000);
		// $scope.song.animate({volume: 0}, 500, function(){
		// 	$scope.song[0].pause();
		// });
		console.log("click");
	}





	if($routeParams['quizId']){
		$scope.local = false;
		console.log("Laddar in quiz");
		    // Get a reference to our posts
	    var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+$routeParams['quizId']);
	    // Attach an asynchronous callback to read the data at our posts reference
	    quizRef.on("value", function(snapshot) {
	    	//$scope.key = snapshot.key()
	    	$scope.Quiz = snapshot.val();
	    	//console.log(key);
	    	
	    	//console.log($scope.Quiz.questions);
	    	
	    }, function (errorObject) {
	    	console.log("The read failed: " + errorObject.code);
	    });


	    var questionRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+$routeParams['quizId']+"/questions/");
	    $scope.questions =[];
	    questionRef.on("value", function(snap){
	    	snap.forEach(function(childSnapshot) {
	    		var key= childSnapshot.key();
	    		$scope.questions.push(childSnapshot.val());
	    		console.log(key + childSnapshot.val());
	    	})
	    	$scope.getNewAnswers();
			$scope.shuffledArray = $scope.shuffle($scope.answers);
	    },function (errorObject) {
	    	console.log("The read failed: " + errorObject.code);
	    });

	    quizModel.Quiz = $scope.Quiz;
	   	quizModel.Quiz.questions= $scope.questions;
		//$scope.Quiz = quizModel.Quiz;
	}else{
		console.log("läs från modellen")
		$scope.Quiz = quizModel.Quiz;
		$scope.questions = $scope.Quiz.questions;
		
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
	            	console.log("9");
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