var app = angular.module("app2",['ngResource','infinite-scroll']);

app.config(function($httpProvider,$resourceProvider){
	$httpProvider.defaults.headers.common['Authorization'] = 'Token d8f38e4e94a7c3766c35e3805d46c46500913752';
	$resourceProvider.defaults.stripTrailingSlashes = false;
});


app.factory("Contact",function($resource){
	return $resource("https://codecraftpro.com/api/samples/v1/contact/:id/");
});



app.service("ContactService",function($http,Contact){
	

	var self={
		'selectedPerson': null,
		'addPerson':function(person){
			this.persons.push(person)
		},
		'page':1,
		'hasMore':true,
		'isLoading':false,
		'persons': [],
		'loadContacts':function(){
			if(self.hasMore && !self.isLoading){
				self.isLoading = true;
				var params = {
					'page':self.page
				};
				Contact.get(params,function(data){
					console.log(data);
					angular.forEach(data.results,function(person){
						self.persons.push(new Contact(person));
					});
					if(!data.next){
						self.hasMore = false;
					}
					self.isLoading = false;
				});
			}//hasmore
			
		},
		'loadMore':function()
		{
			if(self.hasMore && !self.isLoading){
				self.page+=1;
				self.loadContacts();
			}
		}

	};
	self.loadContacts();
	return self;
});

app.controller("personsController",function($scope,$http,ContactService){
	$scope.selectedPerson = ContactService.selectedPerson;
	$scope.search  		  = "";
	$scope.order 		  = "name";
	$scope.contacts = ContactService;

	$scope.loadMore = function()
	{
		$scope.contacts.loadMore();
	}

	$scope.selectPerson = function(person)
	{
		if (person == $scope.selectedPerson)
		{
			$scope.selectedPerson = null;
		}
		else{
			$scope.selectedPerson = person;	
		}
		
	}

	$scope.sensitiveSearch = function(person)
	{
		if ($scope.search) 
		{
			return person.name.indexOf($scope.search) == 0 ||
			person.email.indexOf($scope.search) == 0;
		}
		return true;
	}
	
	/*$http.get("persons.json").success(function(data){
		$scope.persons = data;
		console.log($scope.persons);
	})*/
});

app.controller("personsDetail",function($scope,ContactService){
	$scope.contacts = ContactService;

});

