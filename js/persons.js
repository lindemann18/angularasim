var app = angular.module("app2",['ngResource','infinite-scroll','angularSpinner','jcs-autoValidate','angular-ladda','mgcrea.ngStrap','toaster','ngAnimate','ui.router']);

app.config(function($httpProvider,$resourceProvider,laddaProvider,$datepickerProvider){
	$httpProvider.defaults.headers.common['Authorization'] = 'Token d8f38e4e94a7c3766c35e3805d46c46500913752';
	$resourceProvider.defaults.stripTrailingSlashes = false;
	laddaProvider.setOption({
		style:'expand-right'
	});
	angular.extend($datepickerProvider.defaults,{
		dateFormat:'d/M/yyyy',
		autoclose:true
	});
});

app.config(function($stateProvider,$urlRouterProvider){
	$stateProvider
	.state('list',{
		url:'/',
		templateUrl:'templates/list.html',
		controller:'personsController'
	})

	.state('edit',{
		url:'/edit/:email',
		templateUrl:'templates/edit.html',
		controller:'personsDetail'
	});
	$urlRouterProvider.otherwise('/');
});


app.factory("Contact",function($resource){
	return $resource("https://codecraftpro.com/api/samples/v1/contact/:id/",{id:'@id'},{update:{
		method:'PUT'
	}});
});

app.filter('defaultImage',function(){
	return function(input,param){;
		if (!input)
		{
			input = param;
		}
		return input;
	}
});

app.service("ContactService",function($http,Contact,$q,toaster){
	
	var self={
		'selectedPerson': null,
		'page':1,
		'hasMore':true,
		'isLoading':false,
		'persons': [],
		'isSaving': false,
		'search':null,
		'ordering':null,
		'getPerson':function(email){
			for(var i = 0; i<self.persons.length; i++)
			{
				var obj = self.persons[i];
				if(obj.email == email)
				{
					return obj;
				}
			}
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
			var d 		  = $q.defer();
			console.log("Service called update");
			self.isSaving = true;
			person.$update().then(function(){
				self.isSaving = false;
				toaster.pop('success',"updated "+person.name);
				d.resolve();
			});
			return d.promise;
		},
		'removeContact':function(person){
			var d 		  = $q.defer();
			console.log("Service called Delete");
			self.isDeleting = true;
			person.$remove().then(function(){
				self.isDeleting = false;
				var index = self.persons.indexOf(person);
				self.persons.splice(index,1);
				self.selectedPerson = null;
				toaster.pop('success',"Deleted "+person.name);
				d.resolve();
			});
			return d.promise;
		},
		'createContact':function(person){
			var d 		  = $q.defer();
			self.isSaving = true;
			Contact.save(person).$promise.then(function(){
				self.isSaving = false;
				self.selectedPerson = null;
				self.hasMore = true;
				self.page = 1;
				self.persons = [];
				self.loadContacts();
				toaster.pop('success',"Created "+person.name);
				//here is complete
				d.resolve();
			});
			return d.promise;
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
		$scope.contacts.createContact($scope.contacts.selectedPerson).then(function(){
			$scope.createModal.hide();
		});
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

app.controller("personsDetail",function($scope,ContactService,$stateParams,$state){
	$scope.contacts = ContactService;
	$scope.contacts.selectedPerson = $scope.contacts.getPerson($stateParams.email);

	$scope.save = function()
	{
		$scope.contacts.updateContact($scope.contacts.selectedPerson);
		$state.go("list");
	}

	$scope.remove = function()
	{
		$scope.contacts.removeContact($scope.contacts.selectedPerson);
	}

});

