<?php
  include("./FuncionesGenerales.php");
	$modulo = $_POST['modulo'];
	$campo = $_POST['campo'];
	$FuncionesGenerales = new FuncionesGenerales();
	$ultimoFolio = $FuncionesGenerales->UltimoFolio($modulo,$campo);
	echo json_encode($ultimoFolio);
?>
