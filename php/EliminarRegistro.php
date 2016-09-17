<?php

	include("./FuncionesGenerales.php");
	$modulo = $_POST['modulo'];
	$id = $_POST['id'];
	
	$FuncionesGenerales = new FuncionesGenerales();
	$mensaje = $FuncionesGenerales->Eliminar($modulo,$id);

	echo json_encode($mensaje);
?>