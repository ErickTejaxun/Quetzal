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

        this.getErrores = function()
        {
            return this.listaErrores;
        }

        this.LimpiarTodo = function()
        {
            this.listaErrores = new Array;
            this.consolaSalida = new Array;            
        }        
    }
}


var Utils = new Utilidades();