var Modulo = "clientes";
var Funcionalidad = {consultar: "consultar",editar: "editar",eliminar: "eliminar",agregar: "agregar",busqueda: "busqueda"};
$( document ).ready(function() {
   
  FuncionesGeneral.template(Modulo,Funcionalidad.consultar,"#consultar");
  FuncionesGeneral.template(Modulo,Funcionalidad.agregar,"#agregar");
  $("#agregar_"+Modulo).hide();
    var registros = FuncionesGeneral.Consultar(Modulo);
    FuncionesGeneral.CargarDatos(Modulo,registros);

    $(document).on("click","#nuevo_"+Modulo ,function(event){
       event.preventDefault();
      FuncionesGeneral.ActualizaFolio(Modulo,"numero");
      $("#nuevo_"+Modulo).hide();
      $("#consultar_"+Modulo).hide();
      $("#agregar_"+Modulo).show();    	
    });
    
     $(document).on("click","#editar_"+Modulo ,function(event){
       event.preventDefault();
       FuncionesGeneral.ActualizaFolio(Modulo,"numero");
       var data = $("#clientes").serializeArray();
           var mensaje = Validaciones.publicValidacionGeneral(data);
           if(!mensaje.boleano){
               alert(mensaje.mensaje);
               return false;
           }

           var mensaje = ValidacionCliente(data);
           if(!mensaje.boleano){
               alert(mensaje.mensaje);
               return false;
           }
            $("#nuevo_"+Modulo).show();
      	    FuncionesGeneral.PublicEditar(Modulo,data,id_registro);
            FuncionesGeneral.template(Modulo,Funcionalidad.consultar,"#consultar");
            var registros = FuncionesGeneral.Consultar(Modulo);
            FuncionesGeneral.CargarDatos(Modulo,registros);
            FuncionesGeneral.Regresar(Modulo);
    });

	$(document).on("click","#guardar_"+Modulo,function(){
           var data = $("#clientes").serializeArray();
           var mensaje = Validaciones.publicValidacionGeneral(data);
           if(!mensaje.boleano){
               alert(mensaje.mensaje);
               return false;
           }

           var mensaje = ValidacionCliente(data);
           if(!mensaje.boleano){
               alert(mensaje.mensaje);
               return false;
           }
            FuncionesGeneral.InsertarRegistro(Modulo,data);
            FuncionesGeneral.template(Modulo,Funcionalidad.consultar,"#consultar");
            var registros = FuncionesGeneral.Consultar(Modulo);
            FuncionesGeneral.CargarDatos(Modulo,registros);
            FuncionesGeneral.Regresar(Modulo);
	          $("#nuevo_"+Modulo).show(); 
            event.preventDefault();

      });
  $(document).on("click",".cliente_eliminar",function(event){
       event.preventDefault();
       var arreglo = event.currentTarget.id.split("_");
       var id = arreglo[1];
       if(confirm("Estas Seguro que deseas eliminar este registro")){
          FuncionesGeneral.PublicEliminar(Modulo,id);
       }
  });

  $(document).on("click",'.cliente_editar',function(index){
       var arreglo = index.currentTarget.id.split("_");
       var id = arreglo[1];
       if(confirm("Estas Seguro que deseas editar este registro")){
          FuncionesGeneral.PublicDatosEditar(Modulo,id);
          $("#nuevo_"+Modulo).hide();
       }
       index.preventDefault();    
  });

  $(document).on("click",'#cancelar_'+Modulo, function(index){
       if(confirm("Estas seguro que desea salir de "+Modulo)){
             $("#nuevo_"+Modulo).show();
             FuncionesGeneral.Regresar(Modulo);                       
       }

       index.preventDefault();
  });

});

function ValidacionCliente(valor){
  var mensaje = {};

  for(indice in valor){
    if(valor[indice].name == "numero"){
          if( isNaN(valor[indice].value) ) {
            return mensaje = {boleano: false, mensaje: "No es posible continuar, el campo '"+valor[indice].name+"' debe ser numerico."};
          } 
    }
    else if(valor[indice].name == "rfc"){
    
    }else{
        if(!isNaN(valor[indice].value)){
            return mensaje = {boleano: false, mensaje: "No es posible continuar, el campo '"+valor[indice].name+"' debe ser texto."};
        }
    }
  }
    return mensaje = {boleano: true}
}