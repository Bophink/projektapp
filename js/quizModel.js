quizApp.factory('quizModel',function ($resource, $cookieStore, $firebaseObject, $firebaseArray) { 

var points = 0;
this.carouselPosition = 100;
this.carouselSlideTo = null;

var Quiz = this.Quiz = {};

this.Quiz.questions=[];
this.searchResults = null;

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
	this.searchResults = null;
	var quiz = null;
	this.Quiz.questions = null;
	this.carouselPosition = 100;
	this.carouselSlideTo = null;

	console.log("Hämtar quiz till modellen");
	var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+quizId);
	// vi fixar denna när vi har implementerat inloggning

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

		callback();

	});

}
	

this.createQuestion = function(question,a,b,c,d,songId, albumImgUrl, fbId){
	return {"question":question,"songId":songId,"answers":{"a":a,"b":b,"c":c,"d":d},"img": albumImgUrl,"fbId":fbId};
}

this.setQuestion = function(questionObj,index,callback){
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
		var index = this.Quiz.questions.length; //nya indexet
		questionObj.fbId = null;
		questionObj.position = index+1;
		questionObj.$priority = index+1;


		this.Quiz.questions.$add(questionObj).then(function(questionsRef) {
		  var id = questionsRef.key();
		  var qRef = questionsRef;
		  //Lägger till fbId i objektet
		  qRef.update({'fbId' : id});
		  //sätter prioritet på objektet i firebase
		  qRef.setPriority(questionObj.position,callback());
		  console.log("Har lagt till frågan: " + questionObj.question);
		});
	}
}

this.getQuestion = function(index){
	return this.Quiz.questions[index];
}

this.removeQuestion = function(question, callback){
	var qRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz['quizId']+"/questions/"+question.fbId);
	qRef.remove();

	var quizRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz.quizId);
	var troll = $firebaseObject(quizRef);
	
	troll.$loaded().then(function(x){
		callback();
	});
}

this.shiftPosition = function(C2, callback){
	for(var i=0; i<C2.length; i++){
	    C2[i].position = i+1;
	    var fbId = C2[i].fbId;
	    var qRef = new Firebase("https://radiant-inferno-6844.firebaseio.com/quizzes/"+this.Quiz.quizId+"/questions/"+fbId);
	    qRef.update({'position' : C2[i].position});
	    qRef.setPriority(C2[i].position);
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