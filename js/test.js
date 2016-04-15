var app=angular.module("app",[]);

app.controller("myController",function($scope,$http,$q,contacts){
	$scope.ContactsService = contacts;
	$scope.contactsData    = $scope.ContactsService.getAll();
	$scope.selectedPerson  = {"email":null}; 
	console.log($scope.ContactsService);
    $scope.contactsData.then(function(data) {
        $scope.contacts = data.data;//don't forget "this" in the service
        console.log($scope.contacts);
    });

    $scope.selectPerson = function(person)
    {
    	if($scope.selectedPerson == person)
    	{
    		$scope.selectedPerson = null
    	}else{$scope.selectedPerson = person;}
    	
    	console.log($scope.selectedPerson);
    }

    $scope.Editar = function(person)
    {
    	
    }

});

app.service("contacts",function($http){
	 this.selectedPerson = "null";
	 this.getAll = function() {

        return $http.get("persons.json").then(function(data){
        	return data
        });

    }
});