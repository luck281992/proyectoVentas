<?php
    include("./FuncionesGenerales.php");
	$id = $_POST['id'];
	$modulo = $_POST['modulo'];

	$FuncionesGenerales = new FuncionesGenerales();
	$datos = $FuncionesGenerales->ObtenerRegistro($modulo,$id);

	echo json_encode($datos);
