var app = angular.module("app2",['ngResource','infinite-scroll','angularSpinner','jcs-autoValidate','angular-ladda','mgcrea.ngStrap']);

app.config(function($httpProvider,$resourceProvider,laddaProvider){
	$httpProvider.defaults.headers.common['Authorization'] = 'Token d8f38e4e94a7c3766c35e3805d46c46500913752';
	$resourceProvider.defaults.stripTrailingSlashes = false;
	laddaProvider.setOption({
		style:'expand-right'
	});
});


app.factory("Contact",function($resource){
	return $resource("https://codecraftpro.com/api/samples/v1/contact/:id/",{id:'@id'},{update:{
		method:'PUT'
	}});
});



app.service("ContactService",function($http,Contact){
	
	var self={
		'selectedPerson': null,
		'page':1,
		'hasMore':true,
		'isLoading':false,
		'persons': [],
		'isSaving': false,
		'search':null,
		'ordering':null,
		'addPerson':function(person){
			this.persons.push(person)
		},
		'loadContacts':function(){
			if(self.hasMore && !self.isLoading){
				self.isLoading = true;
				var params = {
					'page':self.page,
					'search':self.search,
					'ordering':self.ordering
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
		},
		'doSearch':function(search){
			self.hasMore = true;
			self.page    = 1;
			self.persons = [];
			self.search = search;
			self.loadContacts();

		},
		'doOrder':function(order){
			self.hasMore  = true;
			self.page     = 1;
			self.persons  = [];
			self.ordering = order;
			self.loadContacts();
		},
		'updateContact':function(person){
			console.log("Service called update");
			self.isSaving = true;
			person.$update().then(function(){
				self.isSaving = false;
			});
		},
		'removeContact':function(person){
			console.log("Service called Delete");
			self.isDeleting = true;
			person.$remove().then(function(){
				self.isDeleting = false;
				var index = self.persons.indexOf(person);
				self.persons.splice(index,1);
				self.selectedPerson = null;
			});
		},
		'createContact':function(person){
			self.isSaving = true;
			Contact.save(person).$promise.then(function(){
				self.isSaving = false;
			});
		}

	};
	self.loadContacts();
	return self;
});

app.controller("personsController",function($scope,$http,ContactService,$modal){
	$scope.selectedPerson = ContactService.selectedPerson;
	$scope.search  		  = "";
	$scope.order 		  = "name";
	$scope.contacts = ContactService;

	$scope.createContact = function()
	{
		$scope.contacts.createContact($scope.contacts.selectedPerson);
	}

	$scope.loadMore = function()
	{
		$scope.contacts.loadMore();
	}

	$scope.showCreateModal = function()
	{
		$scope.contacts.selectedPerson = {};
		$scope.createModal = $modal({
			scope:$scope,
			template:'templates/modal.create.tpl.html',
			show:true
		});
	}//showCreateModal	

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

	$scope.$watch('search',function(newVal,oldVal){
		if(angular.isDefined(newVal)){
			$scope.contacts.doSearch(newVal);
		}
	});


	$scope.$watch('order',function(newVal,oldVal){
		if(angular.isDefined(newVal)){
			$scope.contacts.doOrder(newVal);
		}
	});
		
	/*$http.get("persons.json").success(function(data){
		$scope.persons = data;
		console.log($scope.persons);
	})*/
});

app.controller("personsDetail",function($scope,ContactService){
	$scope.contacts = ContactService;

	$scope.save = function()
	{
		$scope.contacts.updateContact($scope.contacts.selectedPerson);

	}

	$scope.remove = function()
	{
		$scope.contacts.removeContact($scope.contacts.selectedPerson);
	}

});

