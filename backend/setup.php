<?php
require_once('config.php');

try{
    // Connect to MySQL with PDO
    $pdo = new PDO("mysql:host=".$hostname.";dbname=".$schema,$username,$password);
	
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
	
	$sql1 = "CREATE TABLE Recipe (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
	title VARCHAR(60),
	image VARCHAR(200),
	prepareTime INT(5), 
	cookTime INT (5), 
	instructions TEXT
	)"; 
	
	$sql2 = "CREATE TABLE Ingredient (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
	name VARCHAR(20)
	)"; 
	
	$sql3 = "CREATE TABLE RecipeIngredientLink (
	recipeId INT(6),
	ingredientId INT(6), 
	quantity INT (6),
	unit VARCHAR(20)
	)"; 
	
	$pdo->exec($sql1); 
	$pdo->exec($sql2); 
	$pdo->exec($sql3); 	
}
catch(PDOException $e){
	echo $e->getmessage(); 
}

$conn = null; 
?>