var TipoError;
(function (TipoError) {
    TipoError[TipoError["LEXICO"] = 1] = "LEXICO";
    TipoError[TipoError["SINTACTICO"] = 2] = "SINTACTICO";
    TipoError[TipoError["SEMANTICO"] = 3] = "SEMANTICO";
})(TipoError || (TipoError = {}));

class error
{
    constructor(linea, columna, id, descripcion, archivo="")
    {            
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.descripcion = descripcion;
        this.archivo = archivo;        
        // Calculo de timestapm
        var hoy = new Date();
        var fecha = hoy.getFullYear()+'-'+(hoy.getMonth()+1)+'-'+hoy.getDate();
        var hora = hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();
        this.fecha = fecha+' '+hora;                

        this.setTipoLexico = function()
        {
            this.tipo = TipoError.LEXICO;
        }

        this.setTipoSintactico = function()
        {
            this.tipo = TipoError.SINTACTICO;
        }

        this.setTipoSemantico = function()
        {
            this.tipo = TipoError.SEMANTICO;
        }

        this.getCadenaTipo = function()
        {
            switch(this.tipo)
            {
                case TipoError.LEXICO:
                    return "Léxico";
                case TipoError.SINTACTICO:
                    return "Sintáctico";
                case TipoError.SEMANTICO:
                    return "Semántico";
            }	            
        }
    }
}

class Utilidades
{
    constructor()
    {
        this.listaErrores = new Array;
        this.consolaSalida = new Array;
        this.contadorTemporales = 0;
        this.contadorEtiquetas =0;

        this.registrarErrorLexico=function(linea, columna, id, descripcion, archivo)
        {
            var nuevoError = new error(linea, columna, id, descripcion, archivo);
            nuevoError.setTipoLexico();
            this.listaErrores.push(nuevoError);
        }

        this.registrarErrorSintactico=function(linea, columna, id, descripcion, archivo)
        {
            var nuevoError = new error(linea, columna, id, descripcion, archivo);
            nuevoError.setTipoSintactico();
            this.listaErrores.push(nuevoError);
        }

        this.registrarErrorSemantico=function(linea, columna, id, descripcion, archivo)
        {
            var nuevoError = new error(linea, columna, id, descripcion, archivo);
            nuevoError.setTipoSemantico();
            this.listaErrores.push(nuevoError);
        } 
        
        this.imprimirConsola = function(valor)
        {
            this.consolaSalida.push(valor.toString());
        }

        this.getCadenaSalida = function()
        {
            var cadenaSalida = '';
            this.consolaSalida.forEach(function(linea){
                cadenaSalida = cadenaSalida == ''? (linea):(cadenaSalida+linea);
            });
            return cadenaSalida;
        }


        this.getCadenaSalida3D = function()
        {
            var cadenaSalida = '';

            cadenaSalida += '#include <stdio.h> //Importar para el uso de Printf\n';
            cadenaSalida += 'float heap[100000];\n';
            cadenaSalida += 'float stack[100000];\n';
            cadenaSalida += 'float H = 0.00;\n';
            cadenaSalida += 'float P = 0.00;\n';
    
            cadenaSalida += 'float t0';
            for(var i = 1; i < Utils.contadorTemporales ; i++)
            {
                cadenaSalida += ', t'+i.toString();
            }
            cadenaSalida += ';// temporales\n';            

            
            this.consolaSalida.forEach(function(linea){
                cadenaSalida = cadenaSalida == ''? (linea):(cadenaSalida+linea);
            });
            return cadenaSalida;
        }


        this.getErrores = function()
        {
            return this.listaErrores;
        }

        this.LimpiarTodo = function()
        {
            this.listaErrores = new Array;
            this.consolaSalida = new Array;
            this.contadorEtiquetas=0;
            this.contadorTemporales = 0;          
        }
        
        this.generarTemporal = function()
        {
            var temporal = 't'+this.contadorTemporales;
            this.contadorTemporales += 1;
            return temporal;
        }

        this.genenerarEtiqueta = function()
        {
            var etiqueta = 'L'+this.contadorEtiquetas;
            this.contadorEtiquetas += 1;
            return etiqueta;
        } 
        
        
    }
}


var Utils = new Utilidades();