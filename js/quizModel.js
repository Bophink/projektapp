quizApp.factory('quizModel',function ($resource, $cookieStore, $firebaseObject, $firebaseArray) { 

var points = 0;
this.carouselPosition = 100;
this.carouselSlideTo = null;

var Quiz = this.Quiz = {};

this.Quiz.questions=[];
this.searchResults = null;

var userAnswers = this.userAnswers = [];
//var currentQuizObj = ""; // the Quiz the user is currently creating/modifying.

//resources and keys
var echonestApiKey = "6WKAD9UOX8AQCCF9O";
this.songSearch = $resource('https://api.spotify.com/v1/search');
this.song = $resource('https://api.spotify.com/v1/tracks/:id');
this.biography = $resource('http://developer.echonest.com/api/v4/artist/biographies',{"api_key":echonestApiKey,"license":'cc-by-sa'});

this.createQuiz = function(title, creator){
	//creates a Quiz object in model and Firebase
	// in model
	this.Quiz['title'] = title;
	this.Quiz['creator'] = creator;
	this.Quiz['questions'] = [];

	//add to Firebase
	var ref = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes");

		//the push returns the id to the Quiz in Firebase
	this.Quiz['quizId'] = ref.push({'title':title,
			'creator':creator,
		}).path.o[1];
	quizRef= ref.child(this.Quiz.quizId);
	quizRef.update({'quizId':this.Quiz['quizId']});//lägger in Id (huvudnoden i objectet så vi kan hitta den senare)

	this.Quiz.questions = $firebaseArray(quizRef.child("questions"));
	console.log("Har skapat quizzet: "+this.Quiz.title);
}

this.renameQuiz = function(quizID, newTitle){
	//Not implemented in this version
	this.Quiz['title'] = newTitle;
	var ref = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz.quizID+"/");
	ref.update({'title' : newTitle}); // tror koden är rätt men ej testad
	console.log("renamed quiz to: "+newTitle);
}

this.getQuiz = function(quizId, callback){
	//Reads in a Quiz to the model
	this.searchResults = null;
	var quiz = null;
	this.Quiz.questions = null;
	this.carouselPosition = 100;
	this.carouselSlideTo = null;

	console.log("Hämtar quiz till modellen");
	var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+quizId);

	var questionsRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+quizId+"/questions/");
	this.Quiz.questions = $firebaseArray(questionsRef);//alltid synkad
	
	quiz = $firebaseObject(quizRef);
	
	quiz.$loaded().then(function(x){
		console.log(quiz);
		Quiz.title = quiz.title;
		console.log('Title: ' + Quiz.title);
		Quiz.creator = quiz.creator;
		Quiz.quizId = quiz.quizId;

		console.log('Creator: ' + quiz.creator);
		if(callback){
			callback();
		}

	});

}
	

this.createQuestion = function(question,a,b,c,d,songId, albumImgUrl, fbId){
	//Creates a JSON object with the incomming parameters and returns it
	return {"question":question,"songId":songId,"answers":{"a":a,"b":b,"c":c,"d":d},"img": albumImgUrl,"fbId":fbId};
}

this.setQuestion = function(questionObj,index,callback){
	//creates or updates a question (both in model and firebase)
	//Firebase referens till questions i det specifika quizet.
	var questionsRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz.quizId+"/questions/");
	
	if(typeof index !== "undefined"){//if the question should be modified
		var fbId = this.Quiz.questions[index].fbId;
		questionObj.fbId = fbId;

		var qRef = questionsRef.child(fbId);
		qRef.update(questionObj, callback());

		console.log("Har editerat frågan: "+questionObj.question);
	}else{// add new question
		console.log(questionObj);
		var index = this.Quiz.questions.length; //new index
		questionObj.fbId = null;
		questionObj.position = index+1;
		questionObj.$priority = index+1;


		this.Quiz.questions.$add(questionObj).then(function(questionsRef) {
		  var id = questionsRef.key();
		  var qRef = questionsRef;
		  //Adds the attribute fbId to the object
		  qRef.update({'fbId' : id});
		  qRef.setPriority(questionObj.position,callback());
		  console.log("Har lagt till frågan: " + questionObj.question);
		});
	}
}

this.removeQuestion = function(question, callback){
	//Removes a question and then notify observers through callback function.
	var qRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz['quizId']+"/questions/"+question.fbId);
	qRef.remove(callback);
}

this.shiftPosition = function(questions, callback){
	//Moves all questions one position forward
	for(var i=0; i<questions.length; i++){
	    questions[i].position = i+1;
	    var fbId = questions[i].fbId;
	    var qRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz.quizId+"/questions/"+fbId);
	    qRef.update({'position' : questions[i].position});
	    qRef.setPriority(questions[i].position);
	  }
	  callback();
}

this.getQuizResult = function(){
	return points;
}

this.setQuizResult = function(num){
	points = num;
}

 return this;
});