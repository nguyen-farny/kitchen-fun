<?php
require_once('QuantityIngredient.lib.php');

class Recipe implements JsonSerializable
{ 
	// attributes
	private $id; 
	private $title; 
	private $prepareTime; 
	private $cookTime; 
	private $instructions; 
	private $ingredients; 
	private $image; 
	
	// internal attributes
	private $access;
	
    function __construct($pdo) 
	{
		$this->access = $pdo;
    }
	
	/*
		CRUD
	*/
	
	static function GetRecipes($pdo)
	{
		$statement = $pdo->prepare("
			SELECT 
				r.id as recipeId, 
				r.title, 
				r.prepareTime, 
				r.cookTime, 
				r.instructions, 
				r.image, 
				i.id as ingredientId, 
				i.name, 
				ri.quantity, 
				ri.unit 
			FROM recipe r, recipeingredientlink ri, ingredient i
			WHERE 
				r.id = ri.recipeId 
				AND i.id = ri.ingredientId
			ORDER by r.id
			"
		); 
		$statement->execute();
		
		$result = [];
		$index = -1;
				
		while ($row = $statement->fetchObject()) 
		{
			// first time on a recipe
			if(count($result) == 0 || $result[$index]->id != $row->recipeId)
			{
				$recipe = new Recipe($pdo);
				$recipe->id = $row->recipeId;
				$recipe->title = $row->title;
				$recipe->prepareTime = $row->prepareTime;
				$recipe->cookTime = $row->cookTime;
				$recipe->instructions = $row->instructions;
				$recipe->image = $row->image;
				$recipe->ingredients = [];
				$result[] = $recipe;
				$index++;
			}
			
			// handle ingredients
			$ingredient = new QuantityIngredient($pdo);
			$ingredient->id = $row->ingredientId;
			$ingredient->name = $row->name;
			$ingredient->quantity = $row->quantity;
			$ingredient->unit = $row->unit;
			$result[$index]->ingredients[] = $ingredient;
		}
		
		return $result;
	}
	
	function Load($id) 
	{
		$statement = $this->access->prepare("
			SELECT 
				r.title, 
				r.prepareTime, 
				r.cookTime, 
				r.instructions, 
				r.image, 
				i.id, 
				i.name, 
				ri.quantity, 
				ri.unit 
			FROM recipe r, recipeingredientlink ri, ingredient i
			WHERE 
				r.id = ri.recipeId 
				AND i.id = ri.ingredientId
				AND r.id = :id
			"
		); 
		$statement->bindParam(':id', $id, PDO::PARAM_INT); 
		$statement->execute();
		
		if(!is_array($this->ingredients))
			$this->ingredients = [];
			
		while ($result = $statement->fetchObject()) 
		{
			$this->id = $id;
			$this->title = $result->title;
			$this->prepareTime = $result->prepareTime;
			$this->cookTime = $result->cookTime;
			$this->image = $result->image;
			$this->instructions = $result->instructions;
			
			$ingredient = new QuantityIngredient($this->access);
			$ingredient->id = $result->id;
			$ingredient->name = $result->name;
			$ingredient->quantity = $result->quantity;
			$ingredient->unit = $result->unit;
			$this->ingredients[] = $ingredient;
		}			
	}
	
	function Save()
	{
		if(isset($id)) 
		{
			// UPDATE
			$statement = $this->access->prepare("UPDATE recipe SET 
				title=:title, 
				prepareTime=:prepareTime, 
				cookTime=:cookTime, 
				instructions=:instructions,
				image=:image
				WHERE id=:id");
			$statement->bindParam(':id', $id, PDO::PARAM_INT); 
		}
		else 
		{
			// INSERT
			$statement = $this->access->prepare("INSERT INTO recipe SET 
				title=:title, 
				prepareTime=:prepareTime, 
				cookTime=:cookTime, 
				instructions=:instructions,
				image=:image");
		}
		
		$statement->bindParam('title', $this->title, PDO::PARAM_STR); 
		$statement->bindParam('prepareTime', $this->prepareTime, PDO::PARAM_INT); 
		$statement->bindParam('cookTime', $this->cookTime, PDO::PARAM_INT); 
		$statement->bindParam('instructions', $this->instructions, PDO::PARAM_STR); 
		$statement->bindParam('image', $this->image, PDO::PARAM_STR); 
		// $statement->debugDumpParams ();
		return $statement->execute();
	}
	
	function Remove()
	{
		$statement = $this->access->prepare("DELETE FROM recipe WHERE id = :id"); 
		$statement->bindParam(':id', $this->id, PDO::PARAM_INT); 
		$statement->execute();
	}
	
	/*
		Serialize
	*/
	
    function jsonSerialize()
	{
       return [
			'id' => $this->id,
			'title' => utf8_encode($this->title),
			'prepareTime' => $this->prepareTime,
			'cookTime' => $this->cookTime,
			'image' => $this->image,
			'ingredients' => $this->ingredients,
			'instructions' => utf8_encode($this->instructions)
		];
    }	
	
	/*
		Getters/Setters
	*/
	
	function SetTitle($t) 
	{ 
		$this->title = $t;
	}
	 
	function GetTitle() 
	{ 
		return $this->title; 
	} 
	
	function SetInstructions($value) 
	{ 
		$this->instructions = $value;
	}
	 
	function GetInstructions() 
	{ 
		return $this->instructions; 
	} 
}

?>