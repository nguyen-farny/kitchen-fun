<?php
class Ingredient implements JsonSerializable
{
	// attributes
	var $id; 
	var $name; 
	
	// internal attributes
	var $access;
	
    function __construct($pdo) 
	{
		$this->access = $pdo;
    }
	
	/*
		CRUD
	*/
	
	static function GetIngredients($pdo)
	{
		$statement = $pdo->prepare("SELECT id, name FROM ingredient"); 
		$statement->execute();
		$result = [];
		while ($row = $statement->fetchObject()) 
		{
			$ingredient = new Ingredient($pdo);
			$ingredient->id = $row->id;
			$ingredient->name = $row->name;
			$result[] = $ingredient;
		}
		return $result;
	}

	function Load($id)
	{
		$statement = $this->access->prepare("SELECT name FROM ingredients WHERE id = :id"); 
		$statement->bindParam(':id', $id, PDO::PARAM_INT); 
		$statement->execute();
		
		if($statement->rowCount() > 0)
		{
			$result = $statement->fetchObject();
			$this->id = $id;
			$this->title = $result->name;
		}			
	}
	
	function Save()
	{
		if(isset($id)) 
		{
			// UPDATE
			$statement = $this->access->prepare("UPDATE ingredients SET 
				name=:name, 
				WHERE id=:id");
			$statement->bindParam(':id', $id, PDO::PARAM_INT); 
		}
		else 
		{
			// INSERT
			$statement = $this->access->prepare("INSERT INTO ingredients SET 
				name=:name");
		}
		
		$statement->bindParam(':title', $name, PDO::PARAM_STR);  
		$statement->execute();
	}
	
	function Remove()
	{
		$statement = $this->acces->prepare("DELETE FROM ingredients WHERE id = :id"); 
		$statement->bindParam(':id', $id, PDO::PARAM_INT); 
		$statement->execute();
	}
	
	/*
		Serialize
	*/
	
    function jsonSerialize()
	{
        return [
			'id' => $this->id,
			'name' => utf8_encode($this->name)
		];
    }	
}



?>