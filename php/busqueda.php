<?php
	include("./FuncionesGenerales.php");
	$modulo = $_POST['modulo'];
	$texto = $_POST['texto'];
	$FuncionesGenerales = new FuncionesGenerales();
	$datos = $FuncionesGenerales->busqueda($modulo,$texto);
	
	 echo json_encode($datos);
	
