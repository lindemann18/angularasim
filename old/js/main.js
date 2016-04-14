var app = angular.module("app",['jcs-autoValidate','angular-ladda','ngResource']);

app.run(
	function(defaultErrorMessageResolver){
		defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages){
			errorMessages['tooYoung'] = "you must be at least {0} years old to use this site";
			errorMessages['tooOld'] = "you must be max {0} years old to use this site";
			errorMessages['badUserName'] = "Username can only contain numbers ant letters and _";
		});
	}
);

app.controller("MinMaxController",function($scope){
	$scope.FormInfo = {};
	$scope.submitting = false;
	$scope.Submit = function()
	{
		$scope.submitting = true;
		alert("yo yo");
	}
});

app.config(function($httpProvider){
	$httpProvider.defaults.header.common['Authorization'] = 'Token d8f38e4e94a7c3766c35e3805d46c46500913752';
});