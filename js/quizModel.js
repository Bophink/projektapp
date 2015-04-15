// Here we create an Angular service that we will use for our 
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
quizApp.factory('quizModel',function ($resource, $cookieStore, $firebaseObject, $firebaseArray) { 
  
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
var crouselPosition = 0;

var Quiz = this.Quiz = {};

this.Quiz.questions=[];

this.searchResults = {}

var userAnswers = this.userAnswers = [];
//var currentQuizObj = ""; // the Quiz the user is currently creating/modifying.

var echonestApiKey = "6WKAD9UOX8AQCCF9O";

this.songSearch = $resource('https://api.spotify.com/v1/search');
this.song = $resource('https://api.spotify.com/v1/tracks/:id');
this.biography = $resource('http://developer.echonest.com/api/v4/artist/biographies',{"api_key":echonestApiKey,"license":'cc-by-sa'});

this.createQuiz = function(title, creator){
	this.Quiz['title'] = title;
	this.Quiz['creator'] = creator;
	this.Quiz['questions'] = [];

	//add to Firebase
	var ref = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes");

	//pushen returnerar sökvgen till objektet i Firebase.
	this.Quiz['quizId'] = ref.push({'title':title,
			'creator':creator,
			'questions':''
		}).path.o[1];
	quizRef= ref.child(this.Quiz.quizId);
	quizRef.update({'quizId':this.Quiz['quizId']});//lägger in Id (huvudnoden i objectet så vi kan hitta den senare)

	this.Quiz.questions = $firebaseArray(quizRef.child("questions"));
	//$firebaseArray är en array som alltid är synkad!
	console.log("Har skapat quizzet: "+this.Quiz.title);
}

this.renameQuiz = function(quizID, newTitle){
	//Gör så det fungerar med Firebase.
	this.Quiz['title'] = newTitle;
	var ref = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz.quizID+"/");
	ref.update({'title' : newTitle}); // tror koden är rätt men ej testad
	console.log("renamed quiz to: "+newTitle);
}

this.getQuiz = function(quizId, callback){
	var quiz = null;
	this.Quiz.questions = null;
	console.log("Hämtar quiz till modellen");
	var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+quizId);
	// vi fixar denna när vi har implementerat inloggning

	var questionsRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+quizId+"/questions/");
	this.Quiz.questions = $firebaseArray(questionsRef);//alltid synkad
	
	quiz = $firebaseObject(quizRef);
	
	quiz.$loaded().then(function(x){
		console.log(quiz);
		Quiz.title = quiz.title;
		console.log(Quiz.title);
		Quiz.creator = quiz.creator;
		Quiz.quizId = quiz.quizId;

		console.log(quiz.creator);

		callback();

	})




}
	

this.createQuestion = function(question,a,b,c,d,songId, albumImgUrl, fbId){
	return {"question":question,"songId":songId,"answers":{"a":a,"b":b,"c":c,"d":d},"img": albumImgUrl,"fbId":fbId};
}

this.setQuestion = function(questionObj,index){
	//Firebase referens till questions i det specifika quizet.
	var questionsRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz.quizId+"/questions/");
	
	if(typeof index !== "undefined"){//if the question should be modified
		
		questionObj.position = index+1;
		var fbId = this.Quiz.questions[index].fbId;
		questionObj.fbId = fbId;
		this.Quiz.questions[index] = questionObj;

		var qRef = questionsRef.child(questionObj.fbId);
		qRef.update(questionObj);
		Quiz.questions[index]= questionObj;

		console.log("Har edterat frågan: "+questionObj.question);
	}else{// add new question
		var index = this.Quiz.questions.length; //nya indexet
		questionObj.fbId = null;
		questionObj.position = index+1;

		this.Quiz.questions.$add(questionObj).then(function(questionsRef) {
		  var id = questionsRef.key();
		  var qRef = questionsRef;
		  qRef.update({'fbId' : id});//Lägger till fbId i objektet
		  console.log("Har lagt till frågan: "+questionObj.question);
		});
	}
}

this.getQuestion = function(index){
	return this.Quiz.questions[index];
}

this.removeQuestion = function(index){
	//Kanske skulle kunna göras med att enbart ändra i this.Quiz.questions och sen synka det. men då får man synka hela arrayen?

	//Firebase
	var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz['quizId']+"/questions");
	questionRef= quizRef.child(this.Quiz.questions[index].fbId);
	questionRef.remove();

	//Modellen

	console.log("Har tagit bort frågan: "+ this.Quiz.questions[index].question);
	this.Quiz.questions.splice(index,1);
	
}

this.shiftPosition = function(currentPosition, newPosition){
	//Används denna?

	//Firebase
	//Ej implementerat

	//Modellen
	selectedQuestion = this.Quiz.questions.splice(currentPosition,1);
	this.Quiz.questions.splice(newPosition,0,selectedQuestion);
}


this.getQuizResult = function(){
	return points;
}

this.setQuizResult = function(num){
	points = num;
}

 return this;
});