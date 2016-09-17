var Modulo = "articulos";
var Funcionalidad = {consultar: "consultar",eliminar: "eliminar",agregar: "agregar",busqueda: "busqueda",editar: "editar"};
var UltimoFolio = 0;
$( document ).ready(function() {

  FuncionesGeneral.template(Modulo,Funcionalidad.consultar,"#consultar");
  FuncionesGeneral.template(Modulo,Funcionalidad.agregar,"#agregar");
  $("#agregar_"+Modulo).hide();
    var registros = FuncionesGeneral.Consultar(Modulo);
    FuncionesGeneral.CargarDatos(Modulo,registros);

    $(document).on("click","#nuevo_"+Modulo,function(event){
      FuncionesGeneral.ActualizaFolio(Modulo,"codigo");
      $("#nuevo_"+Modulo).hide();
      $("#consultar_"+Modulo).hide();
      $("#agregar_"+Modulo).show();
      event.preventDefault();
    });

     $(document).on("click","#editar_"+Modulo,function(event){
      event.preventDefault();
      var data = $("#articulos").serializeArray();
       var mensaje = Validaciones.publicValidacionGeneral(data);
           if(!mensaje.boleano){
               alert(mensaje.mensaje);
               return false;
           }
       var mensaje = ValidacionArticulo(data);
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

	$(document).on("click","#guardar_"+Modulo,function(event){
           var data = $("#articulos").serializeArray();
           var mensaje = Validaciones.publicValidacionGeneral(data);
           if(!mensaje.boleano){
               alert(mensaje.mensaje);
               return false;
           }
           var mensaje = ValidacionArticulo(data);
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

  $(document).on("click",".articulo_eliminar",function(index){
       var arreglo = index.currentTarget.id.split("_");
       var id = arreglo[1];
       if(confirm("Estas Seguro que deseas eliminar este registro")){
          FuncionesGeneral.PublicEliminar(Modulo,id);
       }
       index.preventDefault();
  });

   $(document).on("click",'.articulo_editar',function(index){
       var arreglo = index.currentTarget.id.split("_");
       var id = arreglo[1];
       if(confirm("Estas Seguro que deseas editar este registro")){
          FuncionesGeneral.PublicDatosEditar(Modulo,id);
          $("#nuevo_"+Modulo).hide();
       }
       index.preventDefault();    
  });


   $(document).on("click",'#cancelar_'+Modulo,function(index){
       if(confirm("Estas seguro que desea salir de "+Modulo)){
            $("#nuevo_"+Modulo).show();
            FuncionesGeneral.Regresar(Modulo); 

       }
      event.preventDefault();
  });

});


function ValidacionArticulo(valor){
  var mensaje = {};

  for(indice in valor){
    if(valor[indice].name == "precio" || valor[indice].name == "existencia" || valor[indice].name == "codigo"){
         if( isNaN(valor[indice].value) ) {
            return mensaje = {boleano: false, mensaje: "No es posible continuar, el campo '"+valor[indice].name+"' debe ser numerico."};
          } 
    }else{
        if(!isNaN(valor[indice].value)){
            return mensaje = {boleano: false, mensaje: "No es posible continuar, el campo '"+valor[indice].name+"' debe ser texto."};
        }
    }
  }
    return mensaje = {boleano: true}
}