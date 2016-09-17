<?php

	include("./FuncionesGenerales.php");
	$modulo = $_POST['modulo'];
	$valores = array();
	$campos = array();
	foreach (json_decode($_POST['datos']) as $key => $value) {
		 $campos[] = $value->name;
		 $valores[] = "'{$value->value}'";
	}
	$FuncionesGenerales = new FuncionesGenerales();
	$mensaje = $FuncionesGenerales->InsertRegistro($modulo,$valores,$campos);

	echo json_encode($mensaje);
?>