<?php
require_once('ingredient.lib.php');
class QuantityIngredient extends Ingredient implements JsonSerializable
{
	// attributes
	var $quantity = 0; 
	var $unit = ""; 
		
	/*
		Serialize
	*/
	
    function jsonSerialize()
	{
        return [
			'id' => $this->id,
			'name' => utf8_encode($this->name),
			'quantity' => $this->quantity,
			'unit' => utf8_encode($this->unit)
		];
    }	
}



?>