 
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
