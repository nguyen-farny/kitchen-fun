<?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	header('Content-Type: text/html; charset=utf-8');

	require_once('config.php');
	require_once('recipe.lib.php');
	require_once('ingredient.lib.php');
	

    // Connect to MySQL with PDO
    $pdo = new PDO("mysql:host=".$hostname.";dbname=".$schema,$username,$password);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
	
	if(isset($_GET['recipes'])){
		$recipes = Recipe::GetRecipes($pdo);
		echo json_encode($recipes);
	}
	else if(isset($_GET['recipe'])){
		$recipe = new Recipe($pdo);
		$recipe->Load($_GET['recipe']);
		echo json_encode($recipe);
	}
	else if(isset($_GET['ingredients'])){
		$ingredients = Ingredient::GetIngredients($pdo); 
		echo json_encode($ingredients ); 
	}

?>