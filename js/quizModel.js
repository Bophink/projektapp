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

var Quiz = this.Quiz = {};
var userAnswers = this.userAnswers = [];

var echonestApiKey = "6WKAD9UOX8AQCCF9O";

this.songSearch = $resource('https://api.spotify.com/v1/search');
this.song = $resource('https://api.spotify.com/v1/tracks/:id');
this.biography = $resource('http://developer.echonest.com/api/v4/artist/biographies',{"api_key":echonestApiKey,"license":'cc-by-sa'});

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

this.createQuestion = function(question,a,b,c,d,songId, albumImgUrl){
	return {"question":question,"songId":songId,"answers":{"a":a,"b":b,"c":c,"d":d},"img": albumImgUrl};
}

this.setQuestion = function(questionObj,index){
	index = typeof index !== 'undefined' ? index : Quiz.questions.length;
	Quiz.questions[index] = questionObj;
}

this.getQuestion = function(index){
	return Quiz.questions[index];
}

this.removeQuestion = function(index){
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
	points += num;
}

//logOut() {loggedin = false}


	this.createQuiz ('testquizet','testarn');

  return this;

});