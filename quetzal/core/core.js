var TipoPrimitivo;
(function (TipoPrimitivo) {
    TipoPrimitivo[TipoPrimitivo["NULO"] = 0] = "NULO";
    TipoPrimitivo[TipoPrimitivo["INT"] = 1] = "INT";
    TipoPrimitivo[TipoPrimitivo["DOUBLE"] = 2] = "DOUBLE";
    TipoPrimitivo[TipoPrimitivo["CHAR"] = 3] = "CHAR";
    TipoPrimitivo[TipoPrimitivo["STRING"] = 4] = "STRING";
    TipoPrimitivo[TipoPrimitivo["BOOL"] = 5] = "BOOL";
    TipoPrimitivo[TipoPrimitivo["STRUCT"] = 6] = "STRUCT";
})(TipoPrimitivo || (TipoPrimitivo = {}));




/* Entorno */
class Simbolo
{
    constructor(linea, columna, id, tipo, valor)
    {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.tipo = tipo;
        this.valor = valor;

        this.getTipo = function()
        {
            return this.tipo;
        }

        this.getValor =function()
        {
            return this.valor;
        }
    }
}

class Entorno
{
    constructor(padre)
    {
        this.padre = padre;
        this.tabla = new Map();

        this.getSimbolo= function(id)
        {
            var simbolo = this.tabla['id'];
            // Falta implementar busqueda en profundidad.
            if (simbolo ==null  || simbolo == undefined)
            {
                console.log('Error, simbolo '+ id+' no encontrado en entorno actual.');
            }
            return simbolo;
        }

        this.registrarSimbolo = function(simbolo)
        {
            var simboloTmp = this.tabla[simbolo.id];
            if (simboloTmp !=null  && simboloTmp != undefined)
            {
                console.log('Error. Ya existe un simbolo con el nombre '+ id+' en el entorno actual.');
                return;
            }     
            this.tabla.append(simbolo);
        }
    }
}


/*Expresiones*/

class Entero
{
    constructor(linea,columna,valor){                
        this.linea=linea;
        this.columna=columna;
        this.valor = valor;        
        this.tipo = TipoPrimitivo.INT;

        this.getTipo=function()
        {
            return this.tipo;
        }

        this.getValor=function(entorno)
        {
            return this.valor;
        }
    }
}

/*Instrucciones---------------------------------------->*/

class Bloque
{
    constructor(linea, columna)
    {
        this.linea = linea;
        this.columna = columna;
        this.instrucciones = new Array;

        this.ejecutar=function(entorno)
        {
            this.instrucciones.forEach(function (instruccion) 
            {
                instruccion.ejecutar(entorno);
            });
        }

        this.registrarInstruccion = function(instruccion)
        {
            this.instrucciones.push(instruccion);
        }
    }
}


class Print
{
    constructor(linea,columna,expresion){                
        this.linea=linea;
        this.columna=columna;
        this.expresion = expresion;

        this.ejecutar=function(entorno)
        {
            var tipo = this.expresion.getTipo(entorno);
            /*
            Verificar el tipo de valor que se va a obtener
            1. Arreglo
            2. Instancia de un struct
            3. Nulo
             */
            var valor = this.expresion.getValor(entorno);
            // Si no es lo anterior, se imprime el valor.
            Utils.imprimirConsola(valor);           
        }
    }
}

class Println
{
    constructor(linea,columna,expresion){                
        this.linea=linea;
        this.columna=columna;
        this.expresion = expresion;

        this.ejecutar=function(entorno)
        {
            var tipo = this.expresion.getTipo(entorno);
            /*
            Verificar el tipo de valor que se va a obtener
            1. Arreglo
            2. Instancia de un struct
            3. Nulo
             */
            var valor = this.expresion.getValor(entorno);
            // Si no es lo anterior, se imprime el valor.            
            Utils.imprimirConsola('\n'+valor);
        }
    }
}