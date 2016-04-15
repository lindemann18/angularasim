var app=angular.module("app",[]);

app.controller("myController",function($scope,$http,$q,contacts){
	var cat = contacts.getAll();
    cat.then(function(data) {
        $scope.categories = data.data;//don't forget "this" in the service
        console.log($scope.categories);
        
    $scope.person = $scope.categories[0];
    console.log($scope.person);
    })

});

app.service("contacts",function($http,$q){
	 this.getAll = function() {

        return $http.get("persons.json").then(function(data){
        	return data
        });

    }
});