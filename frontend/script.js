//var server = "//127.0.0.1/kitchen/backend/api.php";
var server = "//hanhphuc-sport.com/kitchenfun/backend/api.php";
var kitchenApp = angular.module('kitchenApp', []);

function hideOptional(item) 
{
	var hide = ['sel', 'poivre', 'basilic'];
	return hide.indexOf(item.name) == -1;
};


// Controleur affichage d'une recette
kitchenApp.controller(
	'SearchCtrl',
	[
		'$scope',
		'$rootScope',
		'$http',
		'$sce',
		function ($scope, $rootScope, $http, $sce) 
		{
			$scope.$watch('search', function() 
			{
				$rootScope.search = $scope.search;
			}, true);

		}
	]
);

kitchenApp.controller(
	'RecipeCtrl',
	[
		'$scope',
		'$rootScope',
		'$http',
		'$sce',
		function ($scope, $rootScope, $http, $sce) 
		{
			$scope.recipe = {};
			
			$scope.renderHtml = function(html_code)
			{
				return $sce.trustAsHtml(html_code);
			};

			$scope.closeRecipe = function() 
			{
				$rootScope.id = null;
			}
			
			// si l'id change, on demande au backend la recette 
			// et on met à jour le modèle
			$scope.$watch('id', function() 
			{ 
				if($rootScope.id) 
				{
					$http({
						method: 'GET', // variables dans l'adresse
						url: server + '?recipe=' + $rootScope.id
					})
					.success(function (data, status, headers, config) {
						$scope.recipe = data;
						$rootScope.recipeVisible = true;
					})
					.error(function (data, status, headers, config) {
						// alert("error");
						$rootScope.recipeVisible = false;
					});	
				}
				else 
				{
					$rootScope.recipeVisible = false;
				}
			}, true);
		}
	]
);

// Controleur liste des recettes
kitchenApp.controller(
	'RecipeListCtrl',
	[
		'$scope',
		'$rootScope',
		'$http',
		function ($scope, $rootScope, $http) 
		{
			// creation du modèle
			$scope.recipes = {};

			// Recupere la liste du serveur
			$http({
				method: 'GET', // variables dans l'adresse
				url: server + '?recipes'
			})
			.success(function (data, status, headers, config) {
				$scope.recipes = data;
			})
			.error(function (data, status, headers, config) {
				// alert("error");
			});	
			
			$scope.showRecipe = function(id) {
				$rootScope.id = id;
			}

			$scope.$watch('availableIngredients', function() { $scope.apply(); });
			
			// Filtre par ingredient
			$scope.matchingIngredients = function (item) {							
				for(var index in item.ingredients)
				{
					var ingredientId = item.ingredients[index].id;
					var checked = $rootScope.availableIngredients.indexOf(ingredientId) > -1;
					var mandatory = hideOptional(item.ingredients[index]);
					if(!checked && mandatory) // not found
						return false; // recette masquée
				}
				
				// tous les ingrédients sont disponibles
				return true;
			};

			// Filtre par texte
			$scope.matchingSearch = function (item) {
				// pas de filtre pour le moment -> recette affichée
				if(!$rootScope.search || $rootScope.search.length == 0)
					return true;  
							
				return item.title.toLowerCase().indexOf($rootScope.search.toLowerCase()) != -1;
			};
		}
	]
);

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
		}
	]
);