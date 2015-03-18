// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
quizApp.factory('quizModel',function ($resource, $cookieStore) { 
  
// var Quiz = {
// 	quizId : 1,
// 	title: 'My rock quiz', 
// 	creator : UserName/Id,
//	questions : [{
// 		question:'What is the name of the song?',
// 	    position:1,
// 	    songId:xxxxxxxxxx,
// 		correctAnswer: “2”, 
// 		answers: {
// 			1:”Austria”,
// 			2:”Australia!!”,
// 			3:”Estrella”,
// 			4:”Oyster Jaah!”
//			}
// 		},
//		{question:'Who is the artist that sings?',
//		etc...}
//	]
// };

var points = 0;

var Quiz = {};
this.songSearch = $resource('https://api.spotify.com/v1/search',{q:query,type:"track",limit:50});
this.song = $resource('"https://api.spotify.com/v1/tracks/:trackId');

this.createQuiz = function(title, creator){
	// generera quizID
	Quiz['quizId'] = 1;
	Quiz['title'] = title;
	Quiz['creator'] = creator;
	Quiz['questions'] = [];
}

this.renameQuiz = function(quizID, newTitle){
	Quiz['title'] = newTitle;
}

this.getQuiz = function(quizID){
	// vi fixar denna när vi har implementerat inloggning
	return Quiz;
}

this.createQuestion = function(question,a,b,c,d,songId,correct, position){
	//sätter defaultvärde.
	position = typeof position !== 'undefined' ? position : Quiz.questions.length+1;
	return {"question":question,"position":position,"songId":songId,"correctAnswer":correct,"answers":{"1":a,"2":b,"3":c}};
}

this.setQuestion = function(questionObj){
	Quiz['questions'].append(questionObj);
}

this.getQuestion = function(position){
	for(var q in Quiz.questions){
		if (q.position == position){
			return q;
		}
	} 
}

this.removeQuestion = function(position){
	shiftPosition(position,Quiz.questions.length)
	Quiz.questions.splice(Quiz.questions.length, 1);
}

this.shiftPosition = function(currentPosition, newPosition){
	var selectedQ = getQuestion(currentPosition);
	if (newPosition < currentPosition){
	 	for(var q in Quiz.questions){
	 		if (q.position < currentPosition && q.position >= newPosition){
	 			q.position += 1;
	 		}
	 	}
	}
	else{
		for(var q in Quiz.questions){
	 		if (q.position > currentPosition && q.position <= newPosition){
	 			q.position -= 1;
	 		} 	
	 	}
	}
	selectedQ.position = newPosition;
}

this.checkAnswer = function(answer,position,p){
	if (answer == getQuestion(position).correctAnswer){
		points += p;
		return true;
	}else{
		return false;
	}
}

this.getQuizResult = function(){
	return points;
}

//logOut() {loggedin = false}


  return this;

});