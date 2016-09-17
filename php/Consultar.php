<?php
  include("./FuncionesGenerales.php");
	$modulo = $_POST['modulo'];
	$FuncionesGenerales = new FuncionesGenerales();
	$datos = $FuncionesGenerales->Consulta($modulo);
	echo json_encode($datos);
?>