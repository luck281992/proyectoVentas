$(document).ready(function(){
	var id_registro = 0; 
	var fecha = new Date();
	var fecha = new Date();
	var dd = fecha.getDate();
	var mm = fecha.getMonth()+1; //hoy es 0!
	var yyyy = fecha.getFullYear();

	if(dd<10) {
	dd='0'+dd
	} 

	if(mm<10) {
	mm='0'+mm
	} 

	fecha = mm+'/'+dd+'/'+yyyy;
		
	$("#fecha").html(fecha);
});

var Validaciones = (function(){

	var publicValidacionGeneral = function(datos){
		var mensaje={};
		for(indice in datos){
			//console.log(datos[indice].value);
			mensaje = privateValidacionGeneral(datos[indice].value,datos[indice].name);
			if(!mensaje.boleano){
				return mensaje;
			}
			
		}
		return mensaje;
		//console.log(datos);
	};
	var privateValidacionGeneral = function(valor,nombre){
		var mensaje = {};
		if(Vacio(valor)){
			return mensaje = {boleano: false, mensaje: "No es posible continuar, debe ingresar '"+nombre+"' es obligatorio."};
		}
		return mensaje = {boleano: true, mensaje: "todo se ha validado bien"}
	}

	return{
		publicValidacionGeneral: publicValidacionGeneral
	}
})();

function Vacio(string){
	return (!string || string.length === 0);
}

var FuncionesGeneral = (function(){
	var resultado={};
	var mensaje={};

	var LimpiarCampos = function(modulo){
		document.getElementById(modulo).reset();
	}
 
       var ActualizaFolio = function(modulo,campo){
   		var ultimoFolio = UltimoFolio(modulo,campo);
   		$("#"+campo).html(ultimoFolio.UltimoFolio);
   		$("."+campo).val(ultimoFolio.UltimoFolio);
	}

	var UltimoFolio = function(modulo,campo){
            if(Vacio(modulo) && Vacio(campo)){
	    	return false;
	    }
	  var resultado;
	    $.ajax({
		method: "POST",
		url: "../../php/UltimoFolio.php",
		data: {modulo: modulo, campo: campo},
                async: false,
                success: function(consulta){
                        resultado = JSON.parse(consulta);
                        console.log(resultado);
                    },
                    error: function (error){
                          console.log("Error "+error);
                    }
              });
	   return resultado;
	}

	var Regresar = function(modulo){
             $("#agregar_"+modulo).hide(); 
             LimpiarCampos(modulo);
             $("#consultar_"+modulo).show();
	}

	var CargarDatos = function(modulo,registros){
			$("#consultar_"+modulo).show(); 
			if(registros){
				for(indice in registros){
				    FuncionesGeneral.AgregarCamposTabla(modulo,registros,indice);                       
				}
			}
		}

	var PublicConsultar = function(modulo){
		if(Vacio(modulo)){
	            return false;
	      }
		var resultado = {};
	      $.ajax({
	            method: "POST",
	            url: "../../php/Consultar.php",
	            data: { modulo: modulo},
	            async: false,
	            success: function(consulta){
	            	resultado = JSON.parse(consulta);
	            	console.log(resultado);  
	            	
	            },
	            error: function (error){
	                  console.log("Error "+error);
	            }
	      });	
	      return resultado;
	}

	var PublicEditar = function(modulo,datos,id){
      	     if(Vacio(modulo) && Vacio(datos)){
            	return false;
      	     }
     	      $.ajax({
        	    method: "POST",
        	    url: "../../php/EditarRegistro.php",
        	    data: { modulo: modulo, datos: JSON.stringify(datos),id: id},
        	    async: false,
        	    success: function(msj){
        	          mensaje = JSON.parse(msj);
        	          if(mensaje.boleano){
        	               alert(mensaje.mensaje);
			  }
           	   },
            	   error: function (error){
                   	console.log("Error "+error);
            	   }
     	      });
	}

	var PublicInsertarRegistro = function(modulo,datos){
      if(Vacio(modulo)){
            return false;
      }
      $.ajax({
            method: "POST",
            url: "../../php/InsertarRegistro.php",
            data: { modulo: modulo, datos: JSON.stringify(datos)},
            async: false,
            success: function(msj){
                  mensaje = JSON.parse(msj);
                  console.log(mensaje);
                  if(mensaje.boleano)
                  	alert(mensaje.mensaje);
            },
            error: function (error){
                  console.log("Error "+error);
            }
      });
	}


	var PublicObtenerRegistro = function(modulo,id){
		if(Vacio(modulo) && Vacio(id)){
			return false;
		}
		$.ajax({
			method: "POST",
	  		url: "../../php/Registro.php",
	  		data: { modulo: modulo, id: id},
	  		async: false,
	  		success: function(registro){
	  			resultado = JSON.parse(registro);
	  			console.log(resultado);
	  		},
	  		error: function (error){
	  			console.log("Error "+error);
	  		}
		});
		return resultado;
	}

    var PublicEliminar = function(modulo, id){
    	if(Vacio(modulo) && Vacio(id)){
			return false;
		}
		var resultado = {};
		var band =0;
    	$.ajax({
			method: "POST",
	  		url: "../../php/EliminarRegistro.php",
	  		data: { modulo: modulo, id: id},
	  		async: false,
	  		success: function(mensaje){
	  			resultado = JSON.parse(mensaje);
	  			if(modulo != "ventas"){
		  			registros = PublicConsultar(modulo);
		  			if(registros){
		  			  $(".registro_"+modulo).html("");
				      for(indice in registros){
				          PublicAgregarCamposTabla(Modulo,registros,indice);                       
				      }
				   }
			    }else{
			    	band = 1;
			    }
	  		},
	  		error: function (error){
	  			console.log("Error "+error);
	  		}
		});
		if(band == 1){
			return resultado;
		}
    }

	var PublicAgregarCamposTabla = function(modulo,datos,indice){
		switch(modulo) {
			    case 'clientes':
	  				$('#tabla_cliente tbody').append('<tr class= "registro_clientes" id=registro_clientes'+indice+'></tr>'); 
	        		$('#registro_clientes'+indice).append('<td>'+datos[indice].numero+'</td>');
	        		$('#registro_clientes'+indice).append('<td>'+datos[indice].nombre+'</td>');
	        		$('#registro_clientes'+indice).append('<td>'+datos[indice].apellido_paterno+'</td>');
	        		$('#registro_clientes'+indice).append('<td>'+datos[indice].apellido_materno+'</td>');
	        		$('#registro_clientes'+indice).append('<td>'+datos[indice].rfc+'</td>');
	        		$('#registro_clientes'+indice).append('<td><a id="eliminar_'+datos[indice].id+'" class="cliente_eliminar" href="#">Eliminar</a></td>');
	        		$('#registro_clientes'+indice).append('<td><a href="#" id="editar_'+datos[indice].id+'" class ="cliente_editar" >Editar</a></td>');
			        break;
			    case 'articulos':
 			        $('#tabla_articulo tbody').append('<tr class ="registro_articulos" id=registro_articulos'+indice+'></tr>'); 
	        		$('#registro_articulos'+indice).append('<td>'+datos[indice].codigo+'</td>');
	        		$('#registro_articulos'+indice).append('<td>'+datos[indice].descripcion+'</td>');
	        		$('#registro_articulos'+indice).append('<td>'+datos[indice].modelo+'</td>');
	        		$('#registro_articulos'+indice).append('<td>'+datos[indice].precio+'</td>');
	        		$('#registro_articulos'+indice).append('<td>'+datos[indice].existencia+'</td>');
	        		$('#registro_articulos'+indice).append('<td><a id="articulo_'+datos[indice].id+'" class="articulo_eliminar" href="#">Eliminar</a></td>');
	        		$('#registro_articulos'+indice).append('<td><a href="#"id="editar_'+datos[indice].id+'" class ="articulo_editar">Editar</a></td>');
			        break;
			    case 'configuracion':
			        $('#tabla_configuracion tbody').append('<tr class ="registro_configuracion" id=registro_configuracion'+indice+'></tr>'); 
	        		$('#registro_configuracion'+indice).append('<td hidden>'+datos[indice].id+'</td>');
				    $('#registro_configuracion'+indice).append('<td>'+datos[indice].tasa_financiamiento+'</td>');
	        		$('#registro_configuracion'+indice).append('<td>'+datos[indice].porcentaje_enganche+'</td>');
	        		$('#registro_configuracion'+indice).append('<td>'+datos[indice].plazo+'</td>');
	        		$('#registro_configuracion'+indice).append('<td><a id="configuracion_'+datos[indice].id+'" class="configuracion_eliminar" href="#">Eliminar</a></td>');
	        		$('#registro_configuracion'+indice).append('<td><a href="#" id="editar_'+datos[indice].id+'" class ="configuracion_editar" >Editar</a></td>');
			        break;
			    case 'ventas':
			        $('#tabla_venta tbody').append('<tr class ="registro_ventas" id=registro_ventas'+indice+'></tr>'); 
	        		$('#registro_ventas'+indice).append('<td hidden>'+datos[indice].id+'</td>');
	        		$('#registro_ventas'+indice).append('<td>'+datos[indice].folio+'</td>');
	        	    $('#registro_ventas'+indice).append('<td>'+datos[indice].numero+'</td>');
				    $('#registro_ventas'+indice).append('<td>'+datos[indice].nombre+'</td>');
	        		$('#registro_ventas'+indice).append('<td>'+datos[indice].total_adeudo+'</td>');
	        		$('#registro_ventas'+indice).append('<td>'+datos[indice].fecha+'</td>');
	        		$('#registro_ventas'+indice).append('<td><a id="venta_'+datos[indice].id+'" class="venta_eliminar" href="#">Eliminar</a></td>');
			        break;
		}
	}

	var template = function(modulo,funcionalidad,elemento){
		$.ajax({
		  url: "../"+modulo+"/"+funcionalidad+".html",
		  dataType: "html",
		  async: false,
	  		success: function(html){
	  			 $(elemento+'_'+modulo).html(html);
			
	  		},
	  		error: function (error){
	  			console.log("Error "+error);
	  		}
		});
	
	}

	var PublicDatosEditar = function(modulo,id){

		  var registro = PublicObtenerRegistro(modulo,id);
		  id_registro =registro[0].id;
		  $("#consultar_"+Modulo).hide();
		  template(modulo,"editar","#agregar");
		  pintarRegistrosEditados(modulo,registro);
		  $("#agregar_"+Modulo).show();
		  
	}

	var pintarRegistrosEditados = function(modulo,registro){
             var datos = registro;
         switch(modulo){
		 case  "clientes":
		  $('#nuevo_cliente').hide();
		  $('#numero').html(registro[0].numero);
		  $('#nombre').val(registro[0].nombre);
		  $('#apellido_materno').val(registro[0].apellido_materno);
		  $('#apellido_paterno').val(registro[0].apellido_paterno);
		  $('#rfc').val(registro[0].rfc);
		break;
		case  "articulos":
          $('#nuevo_articulo').hide();
          $('#codigo').html(registro[0].codigo);
          $('#descripcion').val(registro[0].descripcion);
          $('#modelo').val(registro[0].modelo);
          $('#precio').val(registro[0].precio);
          $('#existencia').val(registro[0].existencia);
		break;
		case  "configuracion":
		  $('#tasa_financiamiento').val(registro[0].tasa_financiamiento);
	 	  $('#enganche').val(registro[0].porcentaje_enganche);
  		  $('#plazo').val(registro[0].plazo);
		break;
	     }
	}

	return {
		ObtenerRegistro: PublicObtenerRegistro,
		Consultar: PublicConsultar,
		InsertarRegistro: PublicInsertarRegistro,
		PublicEditar: PublicEditar,
		PublicDatosEditar, PublicDatosEditar,
		template: template,
		AgregarCamposTabla: PublicAgregarCamposTabla,
		PublicEliminar: PublicEliminar,
		LimpiarCampos: LimpiarCampos,
        ActualizaFolio: ActualizaFolio,
        CargarDatos: CargarDatos,
        Regresar: Regresar
	}
})();
