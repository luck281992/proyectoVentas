var Funcionalidad = {consultar: "consultar",editar: "editar",eliminar: "eliminar",agregar: "agregar",busqueda: "busqueda"};
var Modulo = "configuracion";
$( document ).ready(function() {
	FuncionesGeneral.template(Modulo,Funcionalidad.consultar,"#consultar");
	FuncionesGeneral.template(Modulo,Funcionalidad.agregar,"#agregar");
	var registros = FuncionesGeneral.Consultar(Modulo);
    	if(ValidarExistenciaConfiguracion(registros)){
          $("#consultar_"+Modulo).show();
          $("#agregar_"+Modulo).hide();
    	}else{
          $("#agregar_"+Modulo).show();
          $("#consultar_"+Modulo).hide();
      }
	$("#guardar_configuracion").click(function(){
             var data = $("#configuracion").serializeArray();
             var mensaje = Validaciones.publicValidacionGeneral(data);
             if(!mensaje.boleano){
                 alert(mensaje.mensaje);
                 return false;
             }
             var mensaje = ValidacionConfiguracion(data);
             if(!mensaje.boleano){
                alert(mensaje.mensaje);
                return false;
             }
             var registros = FuncionesGeneral.Consultar(Modulo);   
             if(ValidarExistenciaConfiguracion(registros)){
              if(!confirm("Ya tiene capturada una configuracion")){
                var registros = FuncionesGeneral.Consultar(Modulo);
                 FuncionesGeneral.CargarDatos(Modulo,registros);
                 FuncionesGeneral.Regresar(Modulo);
              }
            }else{
               FuncionesGeneral.template(Modulo,Funcionalidad.consultar,"#consultar");
               FuncionesGeneral.InsertarRegistro(Modulo,data);
               var registros = FuncionesGeneral.Consultar(Modulo);
               FuncionesGeneral.CargarDatos(Modulo,registros);
               FuncionesGeneral.Regresar(Modulo);
            }

  });

  $(document).on("click",".configuracion_eliminar",function(index){
       var arreglo = index.currentTarget.id.split("_");
       var id = arreglo[1];
       if(confirm("Estas Seguro que deseas eliminar este registro")){
          FuncionesGeneral.PublicEliminar(Modulo,id);
       }
       index.preventDefault();
  });

   $(document).on("click",'#cancelar_'+Modulo,function(index){
       if(confirm("Estas seguro que desea salir de "+Modulo)){
            FuncionesGeneral.Regresar(Modulo);
       }
  });

   $(document).on("click",'.configuracion_editar',function(index){
       var arreglo = index.currentTarget.id.split("_");
       var id = arreglo[1];
       if(confirm("Estas Seguro que deseas editar este registro")){
          FuncionesGeneral.PublicDatosEditar(Modulo,id);

       }
       index.preventDefault();
  });
    $(document).on("click","#editar_"+Modulo,function(event){
      event.preventDefault();
      var data = $("#configuracion").serializeArray();
      var mensaje = Validaciones.publicValidacionGeneral(data);
           if(!mensaje.boleano){
               alert(mensaje.mensaje);
               return false;
           }

           var mensaje = ValidacionConfiguracion(data);
             if(!mensaje.boleano){
                alert(mensaje.mensaje);
                return false;
             }
             
        	  FuncionesGeneral.PublicEditar(Modulo,data,id_registro);
            FuncionesGeneral.template(Modulo,Funcionalidad.consultar,"#consultar");
            var registros = FuncionesGeneral.Consultar(Modulo);
            FuncionesGeneral.CargarDatos(Modulo,registros);
            FuncionesGeneral.Regresar(Modulo);
    });
});

function ValidacionConfiguracion(valor){
  var mensaje = {};

  for(indice in valor){
        if( isNaN(valor[indice].value) ) {
            return mensaje = {boleano: false, mensaje: "No es posible continuar, el campo '"+valor[indice].name+"' debe ser numerico."};
        } 
  }
    return mensaje = {boleano: true}
}

function ValidarExistenciaConfiguracion(datos){
  var num =0;
  for(indice in datos){
      num ++;
      FuncionesGeneral.AgregarCamposTabla(Modulo,datos,indice);
  }

  if(num == 0){
    return false;
  }
  return true;
}
