<?php
include("./FuncionesGenerales.php");
	$DatosVenta = $_POST['DatosVenta'];
	$DatosDetalleVenta = $_POST['DatosDetalleVenta'];
	$FuncionesGenerales = new FuncionesGenerales();

	$respuesta = $FuncionesGenerales->GuardarVenta(json_decode($DatosVenta),$DatosDetalleVenta);
	
	echo json_encode($respuesta);
?>
