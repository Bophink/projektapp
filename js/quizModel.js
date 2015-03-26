// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
quizApp.factory('quizModel',function ($resource, $cookieStore, $firebaseObject) { 
  
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

var Quiz = this.Quiz = {};
var userAnswers = this.userAnswers = [];

var echonestApiKey = "6WKAD9UOX8AQCCF9O";

this.songSearch = $resource('https://api.spotify.com/v1/search');
this.song = $resource('https://api.spotify.com/v1/tracks/:id');
this.biography = $resource('http://developer.echonest.com/api/v4/artist/biographies',{"api_key":echonestApiKey,"license":'cc-by-sa'});

this.createQuiz = function(title, creator){

	// generera quizID
	//Quiz['quizId'] = 1;
	Quiz['title'] = title;
	Quiz['creator'] = creator;
	Quiz['questions'] = [];

	//add to Firebase

	var ref = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes");

	//pushen genrerar en id i Firebase.
	Quiz['quizId'] = ref.push({'title':title,
			'creator':creator,
			'questions':''
		}).path.o[1];
	quizRef= ref.child(Quiz.quizId);
	quizRef.update({'quizId':Quiz['quizId']});

}

this.renameQuiz = function(quizID, newTitle){
	Quiz['title'] = newTitle;
}

this.getQuiz = function(quizID){
	// vi fixar denna när vi har implementerat inloggning
	return Quiz;
}

this.createQuestion = function(question,a,b,c,d,songId, albumImgUrl, fbId){
	return {"question":question,"songId":songId,"answers":{"a":a,"b":b,"c":c,"d":d},"img": albumImgUrl,"fbId":fbId};
}

this.setQuestion = function(questionObj,index){
	
	//Byta index till en FireBase index? eller båda?!
	var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+Quiz['quizId']+"/questions");
	//index = typeof index !== 'undefined' ? index : Quiz.questions.length;
	
	if(typeof index !== 'undefined'){//if the question should be modified
		console.log("i edit fbId: "+questionObj.fbId);
		questionRef= quizRef.child(Quiz.questions[index].fbId);
		questionRef.update(questionObj);
		Quiz.questions[index] = questionObj;
	}else{// add new question
		var fbId = quizRef.push(questionObj).path.o[3];
		questionObj['fbId'] = fbId;
		console.log("i new"+questionObj.fbId);
		Quiz.questions.push(questionObj);
	}

	//Vid förändring så skrivs hela question över på firbase.
	
	// console.log(quizRef);
	// var firebaseIndex = quizRef.remove();
	// var firebaseIndex = quizRef.set(Quiz.questions);
	


}

this.getQuestion = function(index){
	return Quiz.questions[index];

}

this.removeQuestion = function(index){
	var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+Quiz['quizId']+"/questions");
	//console.log(quizRef);
	questionRef= quizRef.child(Quiz.questions[index].fbId);
	questionRef.remove();
	Quiz.questions.splice(index,1);
	
}

this.shiftPosition = function(currentPosition, newPosition){
	selectedQuestion = Quiz.questions.splice(currentPosition,1);
	Quiz.questions.splice(newPosition,0,selectedQuestion);
}


this.getQuizResult = function(){
	return points;
}

this.setQuizResult = function(num){
	points = num;
}

//logOut() {loggedin = false}


	//this.createQuiz ('testquizet','testarn');

  return this;

});