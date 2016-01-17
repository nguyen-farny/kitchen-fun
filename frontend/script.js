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
