<?php

	include("./FuncionesGenerales.php");
	$modulo = $_POST['modulo'];
        $id = $_POST['id'];
	$datos = $_POST['datos'];
	$nuevosValores = array();
	foreach (json_decode($_POST['datos']) as $key => $value) {
		 $nuevosValores[] = "{$value->name} = '{$value->value}'";
	}
	
	$FuncionesGenerales = new FuncionesGenerales();
	$mensaje = $FuncionesGenerales->Editar($modulo,$nuevosValores,$id);

	echo json_encode($mensaje);
?>
