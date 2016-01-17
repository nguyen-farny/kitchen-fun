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
				// recuperer le mode
				var mode = $rootScope.ingredientFilterMode;
			
				// Au moins
				if(mode == "AuMoins")
				{
					var recipeIngredients = [];
					for(var index in item.ingredients)
						recipeIngredients.push(item.ingredients[index].id);
					
					var selectedIngredients = $rootScope.availableIngredients;

					for(var index in selectedIngredients)
					{
						var checked = recipeIngredients.indexOf(selectedIngredients[index]) > -1; 
						if(!checked)
							return false;
					}
				}
				
				// Uniquement
				else
				{
					for(var index in item.ingredients)
					{
						var ingredientId = item.ingredients[index].id;
						var checked = $rootScope.availableIngredients.indexOf(ingredientId) > -1;
						var mandatory = hideOptional(item.ingredients[index]);
						if(!checked && mandatory) // not found
							return false; // recette masquée
					}
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

