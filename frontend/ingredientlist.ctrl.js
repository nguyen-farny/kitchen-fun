 // Controleur liste des ingredients
kitchenApp.controller(
	'IngredientListCtrl',
	[
		'$scope',
		'$rootScope',
		'$http',
		function ($scope, $rootScope, $http) 
		{
			$scope.ingredients = {};

			$rootScope.availableIngredients = [];
			$rootScope.ingredientFilterMode = "Unique";
			
			$http({
				method: 'GET', // variables dans l'adresse
				url: server + '?ingredients'
			})
			.success(function (data, status, headers, config) {
				$scope.ingredients = data;
				$scope.checkAll();
			})
			.error(function (data, status, headers, config) {
				// alert("error");
			});	
						
			// Filtre les inutiles
			$scope.hideOptional = hideOptional;

			$scope.updateFilter = function(ingredient) 
			{
				// update rootScope.availableIngredients
				if(ingredient.checked)
				{
					$rootScope.availableIngredients.push(ingredient.id);
				}
				else 
				{
					var index = $rootScope.availableIngredients.indexOf(ingredient.id);
					if (index > -1) 
						$rootScope.availableIngredients.splice(index, 1);
				}
			}
			
			// check all or uncheck all
			$scope.checkAll = function() 
			{
				if(!$scope.ingredients || $scope.ingredients.length == 0)
					return;
				
				for(var i = 0; i < $scope.ingredients.length ; ++i) {
					$scope.ingredients[i].checked = true;
					$rootScope.availableIngredients.push($scope.ingredients[i].id);
				}
				
				if(uncheck)
					$rootScope.availableIngredients = [];
			}
			
			$scope.uncheckAll = function() 
			{
				if(!$scope.ingredients || $scope.ingredients.length == 0)
					return;
				
				for(var i = 0; i < $scope.ingredients.length ; ++i) {
					$scope.ingredients[i].checked = false;
				}
				
				$rootScope.availableIngredients = [];
			}
			
			$scope.$watch('ingredientFilterMode', function() { 
				$rootScope.ingredientFilterMode = $scope.ingredientFilterMode; 
			});
		}
	]
);