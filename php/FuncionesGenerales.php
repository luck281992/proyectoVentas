<?php

class FuncionesGenerales{

	public function conexion(){
	    $hostname = 'localhost';
	    $database = 'examen';
	    $username = 'root';
	    $password = '';

        $mysqli = new mysqli($hostname, $username,$password, $database);
            if ($mysqli -> connect_errno) {
                die( "Fallo la conexión a MySQL: (" . $mysqli -> mysqli_connect_errno() . ") " . $mysqli -> mysqli_connect_error());
            } 
          return $mysqli;   
	}
	
	public function ConsultaVenta($modulo){
		$mysqli = $this->conexion();
		if(empty($modulo)){
			return $datos = ["boleano" => false, "mensaje" => "Error algunos datos estan vacios"];
		}
		$datos = array();
		$query = "SELECT v.id, v.folio,v.fecha, c.numero,c.nombre,v.total_adeudo FROM ventas v INNER JOIN clientes c ON c.id = v.cliente_id";
		$result = mysqli_query($mysqli,$query) or die("Error ".mysqli_error($mysqli));
		while($objeto = mysqli_fetch_object($result)){
			$EstructuraDatos =$this->EstructuraDatos($modulo,$objeto);
			$datos[] = $EstructuraDatos;
		}

			return $datos;
	}

	public function Ultimofolio($modulo,$campo){
		$mysqli = $this->conexion();
                $datos  = array();
		if(empty($modulo)){
		       return $datos = ["boleano" => false, "mensaje" => "Error algunos datos estan vacios"];
                }
                $query = "SELECT IFNULL(MAX({$campo}),0) + 1 as UltimoFolio FROM {$modulo} ";
                $result = mysqli_query($mysqli,$query) or die("Error ".mysqli_error($mysqli));
		if(mysqli_num_rows($result) > 0){
                        if($rowObject = mysqli_fetch_object($result)){
				$datos['UltimoFolio'] = $this->FormatFolio($rowObject->UltimoFolio,4);
			}
		}
                return $datos;
	}
	private function FormatFolio($UltimoFolio,$digitos){
		return str_pad((int) $UltimoFolio,$digitos,"0",STR_PAD_LEFT);
	}

	public function ObtenerRegistro($modulo,$id){
		$mysqli = $this->conexion();
		if(empty($modulo) && empty($id)){
			return $datos = ["boleano" => false, "mensaje" => "Error algunos datos estan vacios"];
		}
		$query = "SELECT * FROM {$modulo} WHERE id = {$id} ";
		$result = mysqli_query($mysqli,$query) or die("Error ".mysqli_error($mysqli));
		$datos = array();
		if($objeto = mysqli_fetch_object($result)){
			$datos[0] = $objeto;
		}
		if($modulo =='clientes')
			$datos[0]->numero = $this->FormatFolio($datos[0]->numero,4);
		else if($modulo == 'articulos'){
			$datos[0]->codigo = $this->FormatFolio($datos[0]->codigo,4);
		}

		return $datos;
	}

	public function Consulta($modulo){
		$mysqli = $this->conexion();
		$datos = array();
		if(empty($modulo)){
			return $datos = ["boleano" => false, "mensaje" => "Error algunos datos estan vacios"];
		}
		$query = "SELECT * FROM {$modulo}";
		$result = mysqli_query($mysqli,$query) or die("Error ".mysqli_error($mysqli));
		while($objeto = mysqli_fetch_object($result)){
			$EstructuraDatos =$this->EstructuraDatos($modulo,$objeto);
			$datos[] = $EstructuraDatos;
		}
			return $datos;
	}

	public function busqueda($modulo,$texto){
		$mysqli = $this->conexion();
		$datos = array();
		if(empty($modulo)){
			return $datos = ["boleano" => false, "mensaje" => "Error algunos datos estan vacios"];
		}
		$query = $this->ObtenerQueryBusqueda($modulo,$texto);
		$result = mysqli_query($mysqli,$query) or die("Error ".mysqli_error($mysqli));
		while($objeto = mysqli_fetch_object($result)){
			//$EstructuraDatos =$this->EstructuraDatos($modulo,$objeto);
			$datos[] = $objeto->registro;
		}

			return $datos;
	}

	private function EstructuraDatos($modulo,$objeto){
		switch($modulo) {
		    case 'clientes':
		        return  ["boleano" => true,"id" =>$objeto->id,"numero" => $objeto->numero, "nombre" => $objeto->nombre, "apellido_paterno" => $objeto->apellido_paterno, "apellido_materno" => $objeto->apellido_materno, "rfc" => $objeto->rfc];
		        break;
		    case 'articulos':
		        return ["boleano" => true,"id" =>$objeto->id,"codigo" => $objeto->codigo, "descripcion" => $objeto->descripcion, "modelo" => $objeto->modelo, "existencia" => $objeto->existencia, "precio" => $objeto->precio];
		        break;
		    case 'ventas':
		        return ["boleano" => true,"id" => $objeto->id,"folio" => $objeto->folio,"numero" => $objeto->numero, "nombre" => $objeto->nombre, "fecha" => $objeto->fecha, "total_adeudo" => $objeto->total_adeudo];
		        break;
		    case 'configuracion':
		        return ["boleano" => true,"id" => $objeto->id,"tasa_financiamiento" => $objeto->tasa_financiamiento, "porcentaje_enganche" => $objeto->porcentaje_enganche, "plazo" => $objeto->plazo];
		        break;	
		 }	        
	}

	private function ObtenerQueryBusqueda($modulo,$texto){

		switch($modulo) {
		    case 'clientes':
		        return "SELECT CONCAT(id,' - ', nombre,' ', apellido_paterno,' ',apellido_materno ) AS registro FROM {$modulo} WHERE (nombre LIKE '%{$texto}%' OR apellido_paterno LIKE '%{$texto}%' OR apellido_materno LIKE '%{$texto}%')";  
		        break;
		    case 'articulos':
		        return "SELECT CONCAT(id,' - ',descripcion) as registro FROM {$modulo} WHERE descripcion LIKE '%{$texto}%'";
		        break;
		}
	}

	public function InsertRegistro($modulo,$valores,$campos){
		$mysqli = $this->conexion();
		$msj = array();
		if(empty($modulo) && empty($valores) && empty($campos)){
			return $msj = ["boleano" => false, "mensaje" => "Error algunos datos estan vacios"];
		}
		$campos = implode(",", $campos);
		$valores = implode(",", $valores);
		$query = "INSERT INTO {$modulo} ({$campos}) VALUES ({$valores})";
		if(mysqli_query($mysqli,$query)){
			$msj = ["boleano" => true, "mensaje" => "Bien Hecho. se ha guardado correctamente."];
		}else{
			$msj = ["boleano" => false, "mensaje" => "Error al guardar"];
		}

		return $msj;

	}

	public function Editar($modulo,$nuevosValores,$id){
		$mysqli = $this->conexion();
		$msj = array();
		if(empty($modulo) && empty($nuevosValores) && empty($id)){
			return $msj = ["boleano" => false, "mensaje" => "Error algunos datos estan vacios"];
		}
		$nuevosValores = implode(",", $nuevosValores);
		$query = "UPDATE {$modulo} SET {$nuevosValores} WHERE id = {$id} ";
		if(mysqli_query($mysqli,$query)){
			$msj = ["boleano" => true, "mensaje" => "Se ha modificado correctamente su registro '{$modulo}' "];
		}else{
			$msj = ["boleano" => false, "mensaje" => "Error al editar su registro"];
		}

		return $msj;

	}

	public function Eliminar($modulo,$id){
		$mysqli = $this->conexion();
		$msj = array();
		if(empty($modulo) && empty($id)){
			return $msj = ["boleano" => false, "mensaje" => "Error algunos datos estan vacios"];
		}

		$query = "DELETE FROM {$modulo} WHERE id = {$id} ";

		if(mysqli_query($mysqli,$query)){
			$msj = ["boleano" => true, "mensaje" => "Se ha Eliminado con exito su registro en $modulo"];
		}else{
			$msj = ["boleano" => false, "mensaje" => "Error al eliminar en $modulo"];
		}

		return $msj;

	}

	public function GuardarVenta($Venta,$DetalleVentaProducto){
		$mysqli = $this->conexion();
		$msj = array();
		if(!is_object($Venta) && !is_object($DetalleVentaProducto)){
			return $msj = ["boleano" =>false, "mensaje" =>"Error en los datos de la venta"];
		}
		$Fecha = date('Y-m-d'); 
		$queryVenta ="INSERT INTO ventas (folio,fecha,cliente_id,enganche,precio_contado,total_adeudo,importe_abono,importe_ahorro,plazo_abono,bonificacion_enganche,total_pagar) VALUES('{$Venta->folio}','{$Fecha}','{$Venta->cliente_id}','{$Venta->enganche}','{$Venta->precio_contado}','{$Venta->total_adeudo}','{$Venta->importe_abono}','{$Venta->importe_ahorro}','{$Venta->plazo_abono}','{$Venta->bonificacion}','{$Venta->total_pagar}') ";
		if(mysqli_query($mysqli,$queryVenta)){
			$venta_id = mysqli_insert_id($mysqli);
			foreach(json_decode($DetalleVentaProducto,true) as $DetalleVenta){
				$queryDetalleVenta = "INSERT INTO detalle_venta_producto (cliente_id,producto_id,Cantidad,precio_total,importe,venta_id) VALUES('{$Venta->cliente_id}','{$DetalleVenta[0]}','{$DetalleVenta[5]}','{$DetalleVenta[6]}','{$DetalleVenta[7]}','{$venta_id}') ";
				if(!mysqli_query($mysqli,$queryDetalleVenta)){
			
					return $msj = ["boleano" => false, "mensaje" =>"error al guardar el detalle de la venta"];
				}
			}
				return $msj = ["boleano" => true, "mensaje" =>"Bien Hecho, Tu venta ha sido registrada correctamente"];
		}else{
		    return $msj = ["boleano" =>false, "mensaje" =>"Error al guardar la venta"];
		}
	}
}
