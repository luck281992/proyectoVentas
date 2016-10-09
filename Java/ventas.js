var Modulo = "ventas";
var Funcionalidad = {consultar_venta:  "consultar_venta",consultar_articulos: "consultar_articulos",eliminar: "eliminar",agregar: "agregar",busqueda: "busqueda"};
var configuracion = {};
var datos_abonos = {};
var TotalAdeudo = 0;
var TotalBonificacion = 0;
var TotalEngrane = 0;
$( document ).ready(function() {
var datos;
var id_producto =0;
var id_cliente = 0;
var registro_configuracion = FuncionesGeneral.Consultar("configuracion");
for(indice in registro_configuracion){
  configuracion[indice] = registro_configuracion[indice]; 
}
FuncionesGeneral.template(Modulo,Funcionalidad.consultar_venta,"#consultar");
$("#agregar_"+Modulo).hide();
   // FuncionesGeneral.ActualizaFolio(Modulo,"folio");
  var registros = Venta.ConsultarVenta(Modulo);
  FuncionesGeneral.CargarDatos(Modulo,registros);
  $(document).on("keydown.autocomplete","#busqueda_cliente",function(e){
      	$(this).autocomplete({
            source: function( request, response ) {
            	datos = ObtenerRegistrosbusqueda("clientes",request.term);
              response(datos);
            },
            select: function( event, objeto ) {
            	arreglo = objeto.item.value.split("-");
            	id_cliente = arreglo[0].trim();
            	registro_cliente = FuncionesGeneral.ObtenerRegistro("clientes",id_cliente);
            	$('#rfc').html("RFC: "+registro_cliente[0].rfc);
            },
            change: function( event, objeto ) {
              if(objeto.item == null){
                $('#rfc').html("");
                $('#busqueda_cliente').val("");
                id_cliente = 0; 
              }
            },
            minLength: 3
          });
    });
  $(document).on("keydown.autocomplete","#busqueda_articulo",function(e){
          $(this).autocomplete({
              source: function( request, response ) {
              datos = ObtenerRegistrosbusqueda("articulos",request.term);
              response(datos);
              },
              select: function( event, objeto ) {
              arreglo = objeto.item.value.split("-");
              id_producto = arreglo[0].trim();
              // registro = FuncionesGeneral.ObtenerRegistro("articulos",id_producto);
              },
              change: function( event, objeto ) {
               if(objeto.item  == null){ 
                 id_producto = 0;
                 $('#busqueda_articulo').val("");
               }
              },
              minLength: 3
          });
  });

    $(document).on("click",".eliminar",function(index){
        $(this).parent().parent().remove();
         FormulasVenta.CalcularImportesVenta();
    })

    $(document).on("click","#agregar_productos_detalle_venta",function(e){
        e.preventDefault();
        if(!id_producto){
          $('#mensaje').html("Es necesario ingresar un articulo.");
          return false;
        }
        registro_articulo = FuncionesGeneral.ObtenerRegistro("articulos",id_producto);
        if(registro_articulo[0].existencia < 1){
          $('#mensaje').html("El articulo seleccionado no cuenta con existencia, favor de verificar.");
          id_producto = 0;
          $('#busqueda_articulo').val("");
        }else{
            $('#mensaje').html("");
            if(!RecorrerTabla(registro_articulo[0].id)){
               $('#mensaje').html("Este articulo ya esta seleccionado.");
               return false;
            }
           
            $('#agregar_producto_'+Modulo).show();
	          AgregarProductoVentaTabla(registro_articulo);
        }
    });

    $(document).on("click",".venta_eliminar",function(index){
       var arreglo = index.currentTarget.id.split("_");
       var id = arreglo[1];
       if(confirm("Estas Seguro que deseas eliminar este registro")){
          var resultado = FuncionesGeneral.PublicEliminar(Modulo,id);
          if(resultado.boleano){
            FuncionesGeneral.template(Modulo,Funcionalidad.consultar_venta,"#consultar");       
            var registros = Venta.ConsultarVenta(Modulo);
            FuncionesGeneral.CargarDatos(Modulo,registros);
            $("#agregar_"+Modulo).html("");
            $("#agregar_"+Modulo).hide(); 
            $("#consultar_"+Modulo).show();   
          }
       }
       index.preventDefault();
    });

    
    $( document ).on("change",".cantidad_producto",function(event) {
        var arreglo = event.target.id.split("_");
        var id = arreglo[1];
        var cantidad = $('#cantidad_'+id).val();

        datos = FuncionesGeneral.ObtenerRegistro("articulos",id);
        if(isNaN(cantidad)){
          alert("Favor de ingresar correctemente la cantidad");
          return false;
        }
        if(parseInt(cantidad) > parseInt(datos[0].existencia)){
          alert("Ingrese una cantidad menor o igual, su existencia es de "+parseInt(datos[0].existencia));
          return false;
        }
        var registroTabla = [];
        $("#cant_"+id).html(cantidad);
        $(this).parents("tr").find("td").each(function(indice){
            registroTabla [indice] = $(this).html().trim();
        });
        var nuevoImporte = FormulasVenta.CalcularImporte(registroTabla[6],cantidad);
        $("#importe_"+id).html(nuevoImporte.toFixed(2));
        
         FormulasVenta.CalcularImportesVenta();
          event.preventDefault();
    });

    $(".cantidad").mouseenter(function(){
        $(this).removeAttr("disabled",true);
    });

    $(".cantidad_producto").mouseenter(function(){
        $(this).removeAttr("disabled",true);
    });

    $(document).on("click","#siguiente_"+Modulo,function(event){
       var rows_productos= $("#tabla_producto_venta tr").length;
       if(parseInt(rows_productos) > 1 && parseInt(id_cliente) > 0){
          TablaAbonos();
          $("#siguiente_"+Modulo).hide();
          $("#guardar_"+Modulo).show();
       }else{
          $('#mensaje').html("");
          $('#mensaje').html("Los datos ingresados no son correctos, favor de verificar");
          return false;
       }
        event.preventDefault();
    });

    $(document).on("click","#guardar_"+Modulo,function(event){
          var rowAbono = 0; 
          rowAbono  =  $('input:radio[name=optradio]:checked').parent().parent().find('td:first').html();
          if(parseInt(rowAbono) > 0){
                var respVenta = Venta.GuardarVenta();
                if(respVenta.boleano){
	                 alert(respVenta.mensaje);
                    $("#consultar_"+Modulo).html("");
                    $("#nuevo_"+Modulo).show();
                    $("#agregar_"+Modulo).html("");
                   FuncionesGeneral.template(Modulo,Funcionalidad.consultar_venta,"#consultar");
                   var registros = Venta.ConsultarVenta(Modulo);
                   FuncionesGeneral.CargarDatos(Modulo,registros);
                   $("#agregar_"+Modulo).hide(); 
                   $("#consultar_"+Modulo).show(); 
	             	}
          }else{
            $('#mensaje').html("");
            $('#mensaje').html("Los datos ingresados no son correctos, favor de verificar");
            return false;
          }
           event.preventDefault();
    });

    $(document).on("click","#regresar_"+Modulo,function(event){
      if(confirm("Estas seguro que desea salir de "+Modulo)){
            $("#agregar_"+Modulo).html("");
            $("#agregar_"+Modulo).hide();     
            $("#consultar_"+Modulo).show();
            $("#nuevo_"+Modulo).show();
            id_producto = 0;
            id_cliente = 0;                                         
       }
      event.preventDefault();
    });

    $(document).on("click","#nuevo_"+Modulo,function(event){
        //var registros = FuncionesGeneral.Consultar(Modulo);
        if(registro_configuracion.length == 0){
          alert("Es necesario que agregue una configuracion");
          return;
        }
        FuncionesGeneral.template(Modulo,Funcionalidad.agregar,"#agregar");
        FuncionesGeneral.template(Modulo,Funcionalidad.busqueda,"#busqueda");
        FuncionesGeneral.template(Modulo,Funcionalidad.consultar_articulos,"#agregar_producto");
        FuncionesGeneral.ActualizaFolio(Modulo,"folio");
        $("#abonos").hide();
        $("#guardar_"+Modulo).hide();
        $("#nuevo_"+Modulo).hide();
        $("#consultar_"+Modulo).hide();
        $("#agregar_producto_"+Modulo).hide();
        $("#agregar_"+Modulo).show();

        event.preventDefault();
    });
});

function TablaAbonos(){
  var rows = 4;
  var fila = "";
  var plazo = 0;
  var total_adeudo = $("#total_adeudo").html();
  for (var indice = 1; indice <= rows; indice++) {
    plazo += 3;
    //alert(plazo);
  //alert(indice);
   var precio_contado = FormulasVenta.PrecioContado(total_adeudo,configuracion[0].tasa_financiamiento,configuracion[0].plazo);
   var total_pagar = FormulasVenta.TotalPagar(precio_contado,configuracion[0].tasa_financiamiento,plazo);
   var importe_abono = FormulasVenta.ImporteAbono(total_pagar,plazo);
   var importe_ahorro = FormulasVenta.ImporteAhorro(total_adeudo,total_pagar);
   datos_abonos[indice] = {precio_contado: precio_contado.toFixed(2),total_pagar: total_pagar.toFixed(2),importe_abono: importe_abono.toFixed(2),importe_ahorro: importe_ahorro.toFixed(2), plazo_abono: plazo};
    
    fila += "<tr>";
    fila += "<td hidden>"+indice+"</td>"
    fila += "<td>"+plazo+" ABONOS DE</td>"
    fila += "<td>TOTAL A PAGAR $"+total_pagar.toFixed(2)+"</td>"
    fila += "<td> $ "+importe_abono.toFixed(2)+"</td>"
    fila += "<td>SE AHORRA $"+importe_ahorro.toFixed(2)+"</td>"
    fila += "<td><input type='radio' id ='check_"+indice+"' name='optradio' value'"+indice+"' class ='radio'/>";
    fila += "</tr>";
  }
   $("#tabla_abonos").append(fila);
   $("#abonos").show();
}


function RecorrerTabla(idproducto){
  var bandera = true;
  $("#tabla_producto_venta tbody tr").each(function (indice,row){
      $(this).children("td:first").each(function (indice2){
          if(parseInt($(this).text()) == parseInt(idproducto)){
              bandera = false;
          }
      });
  });
  return bandera;
}

var FormulasVenta = (function(){
    var CalcularPrecio = function(precio,tasa_financiamiento,plazo_maximo){
         return parseFloat(precio) * (1+(parseFloat(tasa_financiamiento) * parseInt(plazo_maximo))/100);
    }

    var CalcularImporte = function(precio,cantidad){
       return parseFloat(precio) * parseInt(cantidad);
    }

    var CalcularEnganche = function(porcentaje_enganche,importe){
      return (parseInt(porcentaje_enganche)/100) * parseFloat(importe);
    }

    var CalcularBonificacionEnganche = function(enganche,tasa_financiamiento,plazo_maximo){
      return parseFloat(enganche) * ((parseFloat(tasa_financiamiento) * parseInt(plazo_maximo))/100);
    }

    var TotalAdeudo = function(importe,enganche,bonificaciones_enganche){
       return parseFloat(importe) - parseFloat(enganche) - parseFloat(bonificaciones_enganche);
    }

    var PrecioContado = function(total_adeudo,tasa_financiamiento,plazo_maximo){
      return parseFloat(total_adeudo) / (1+((parseFloat(tasa_financiamiento) * parseInt(plazo_maximo))/100));
    }

    var TotalPagar = function(precio_contado,tasa_financiamiento,plazo_abono){
      return parseFloat(precio_contado) * (1 +(parseFloat(tasa_financiamiento) * parseInt(plazo_abono))/100);
    }

    var ImporteAbono = function(total_pagar,plazo_abono){
      return parseFloat(total_pagar) / parseInt(plazo_abono);
    }

    var ImporteAhorro = function(total_adeudo,total_pagar){
      return parseFloat(total_adeudo) - parseFloat(total_pagar);
    }

    var CalcularImportesVenta = function(){
        var DatosTablaVenta = [];
        $("#tabla_producto_venta tr").find(".importe").each(function(indice){
              DatosTablaVenta[indice] = $(this).text().trim();
        });

        var TotalEnganche = 0;
        var TotalBonificacion = 0;
        var TotalAdeudo = 0;
        for (var i = 0; i < DatosTablaVenta.length; i++) {
            var enganche = FormulasVenta.CalcularEnganche(configuracion[0].porcentaje_enganche,DatosTablaVenta[i]);
            TotalEnganche += enganche;
            var Bonificacion = FormulasVenta.CalcularBonificacionEnganche(enganche,configuracion[0].tasa_financiamiento,configuracion[0].plazo);
            TotalBonificacion += Bonificacion;
            var Adeudo = FormulasVenta.TotalAdeudo(DatosTablaVenta[i],enganche,Bonificacion);
            TotalAdeudo += Adeudo;
        };
        $('#enganche').html(TotalEnganche.toFixed(2));
        $("#bonificacion").html(TotalBonificacion.toFixed(2));
        $("#total_adeudo").html(TotalAdeudo.toFixed(2));
    }

    return {
      CalcularPrecio: CalcularPrecio,
      CalcularImporte: CalcularImporte,
      CalcularEnganche: CalcularEnganche,
      CalcularBonificacionEnganche: CalcularBonificacionEnganche,
      TotalAdeudo: TotalAdeudo,
      PrecioContado: PrecioContado,
      ImporteAbono: ImporteAbono,
      ImporteAhorro: ImporteAhorro,
      TotalPagar: TotalPagar,
      CalcularImportesVenta: CalcularImportesVenta
    }

})();

function AgregarProductoVentaTabla(datos){
            var nuevaFila="<tr>";
         //   console.log(configuracion);
            var CantidadProductoDefault = 1;
            var Precio = FormulasVenta.CalcularPrecio(datos[0].precio,configuracion[0].tasa_financiamiento,configuracion[0].plazo);            
            Precio = Precio.toFixed(2);
            var Importe = Precio * CantidadProductoDefault;
            Importe = Importe.toFixed(2);
	    nuevaFila+="<td hidden>"+datos[0].id+" ";
            nuevaFila+="<td>"+datos[0].codigo+" ";
            nuevaFila+="<td>"+datos[0].descripcion+" ";
            nuevaFila+="<td>"+datos[0].modelo+" ";
            nuevaFila+="<td id='cantidad'><input type='text' class='cantidad_producto' id='cantidad_"+datos[0].id+"' value='1' />";
	    nuevaFila+="<td hidden id ='cant_"+datos[0].id+"' >"+CantidadProductoDefault+" ";
	    nuevaFila+="<td>"+Precio+" ";
            nuevaFila+="<td class ='importe' id = 'importe_"+datos[0].id+"' >"+Importe+" ";
            nuevaFila+="<td><a href='#' class ='eliminar' id='eliminar_"+datos[0].id+"'>Eliminar</a> ";
            nuevaFila+="</tr>";
            $("#tabla_producto_venta").append(nuevaFila);

            FormulasVenta.CalcularImportesVenta();
           //     Precio = Precio Articulo X (1 + (Tasa Financiamiento X Plazo Máximo) /100)
    
  }


function ObtenerRegistrosbusqueda(modulo,request){
var resultado;
	if(Vacio(modulo)){
		return false;
	}
	$.ajax({
		method: "POST",
  		url: "../../php/busqueda.php",
  		data: { modulo: modulo, texto: request},
  		async: false,
  		success: function(datos){
  			resultado = JSON.parse(datos);
  		},
  		error: function (error){
  			console.log("Error "+error);
  		}
	});
	return resultado;
}

var Venta = (function(){

  var ConsultarVenta = function(modulo){
    if(Vacio(modulo)){
      return false;
    }
    var resultado;
        $.ajax({
              method: "POST",
              url: "../../php/ConsultarVenta.php",
              async: false,
              data: {modulo, modulo},
              success: function(consulta){
                resultado = JSON.parse(consulta);
              },
              error: function (error){
                    console.log("Error "+error);
              }
        }); 
        return resultado;
  }

	var GuardarVenta = function(){
   		var DatosVenta = ObtenerDatosVenta();
   		var DatosDetalleVenta = ObtenerDatosDetalleVentaProducto();
		var resultado = {};
		$.ajax({
                	method: "POST",
                	url: "../../php/GuardarVenta.php",
                	data: { DatosVenta: JSON.stringify(DatosVenta), DatosDetalleVenta: JSON.stringify(DatosDetalleVenta)},
                	async: false,
                	success: function(datos){
                	        resultado = JSON.parse(datos);
                	},
                	error: function (error){
                       		console.log("Error "+error);
                	}
        	});
      		return resultado;
	}

	var ObtenerDatosVenta = function(){
	   var datos = {};
           indiceAbono =  $('input:radio[name=optradio]:checked').parent().parent().find('td:first').html();
	   datos =  {folio: $('#folio').html(), cliente_id: registro_cliente[0].id, enganche: $("#enganche").html(), bonificacion: $("#bonificacion").html(), total_adeudo: $("#total_adeudo").html(), precio_contado: datos_abonos[indiceAbono].precio_contado, total_pagar: datos_abonos[indiceAbono].total_pagar, importe_abono: datos_abonos[indiceAbono].importe_abono, importe_ahorro: datos_abonos[indiceAbono].importe_ahorro, plazo_abono: datos_abonos[indiceAbono].plazo_abono }
	   return datos;
	}

	var ObtenerDatosDetalleVentaProducto = function(){
		var datos = {};
		$("#tabla_producto_venta tbody tr").each(function (indice,row){
			if(indice != 0 ){
                             datos[indice] = {};
                         	$(this).children("td").each(function (indice2){
                               		datos[indice][indice2] = $(this).html().trim();
                         	});
			}
                 });
		return datos;
	}

	return {
	   GuardarVenta: GuardarVenta,
     ConsultarVenta: ConsultarVenta
	}
})();
