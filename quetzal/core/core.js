var TipoPrimitivo;
(function (TipoPrimitivo) {
    TipoPrimitivo[TipoPrimitivo["NULO"] = 0] = "NULO";
    TipoPrimitivo[TipoPrimitivo["INT"] = 1] = "INT";
    TipoPrimitivo[TipoPrimitivo["DOUBLE"] = 2] = "DOUBLE";
    TipoPrimitivo[TipoPrimitivo["BOOL"] = 3] = "BOOL";
    TipoPrimitivo[TipoPrimitivo["CHAR"] = 4] = "CHAR";
    TipoPrimitivo[TipoPrimitivo["STRING"] = 5] = "STRING";    
    TipoPrimitivo[TipoPrimitivo["STRUCT"] = 6] = "ARREGLO";
    TipoPrimitivo[TipoPrimitivo["STRUCT"] = 7] = "STRUCT";
    TipoPrimitivo[TipoPrimitivo["ERROR"] = 10] = "ERROR";    
    TipoPrimitivo[TipoPrimitivo["VOID"] = 11] = "VOID";  
})(TipoPrimitivo || (TipoPrimitivo = {}));



class Tipo
{
    constructor(tipo, nombre ="")
    {
        this.tipo = tipo; // Tiene que ser un tipo primitivo
        this.nombre = ""
        
        this.esNulo =   function(){ return this.tipo == TipoPrimitivo.NULO;}
        this.esEntero = function(){ return this.tipo == TipoPrimitivo.INT;}
        this.esDouble = function(){ return this.tipo == TipoPrimitivo.DOUBLE;}
        this.esBoolean = function(){ return this.tipo == TipoPrimitivo.BOOL;}
        this.esChar = function(){ return this.tipo == TipoPrimitivo.CHAR;}
        this.esCadena = function(){ return this.tipo == TipoPrimitivo.STRING;}                
        this.esArreglo = function(){ return this.tipo == TipoPrimitivo.ARREGLO;}  
        this.esStruct = function(){ return this.tipo == TipoPrimitivo.STRUCT;} 
        this.esError = function(){ return this.tipo == TipoPrimitivo.ERROR;} 
        this.esStructNombre = function(id){ return this.tipo ==  TipoPrimitivo.STRUCT && this.nombre==id; }

        this.getNombreTipo = function()
        {
            switch(this.tipo)
            {
                case TipoPrimitivo.NULO:
                    return "Nulo";
                case TipoPrimitivo.INT:
                    return "int";
                case TipoPrimitivo.DOUBLE:
                    return "double";
                case TipoPrimitivo.BOOL:
                    return "boolean";
                case TipoPrimitivo.CHAR:
                    return "char";
                case TipoPrimitivo.STRING:
                    return "String";
                case TipoPrimitivo.ARREGLO:
                    return "Array";
                case TipoPrimitivo.ERROR:
                    return "Error";                    
                case TipoPrimitivo.STRUCT:
                    return this.nombre;
            }
            return this.nombre;
        }
    }
}



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

class Variable
{
    constructor(linea, columna, id, tipo, valor)
    {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.tipo = tipo;
        this.valor = valor;
        this.rol = 'VARIABLE';

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


class SimboloFuncion
{
    constructor(linea, columna, id, tipo, listaParametrosFormales, bloqueInstrucciones)
    {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.tipo = tipo;
        this.listaParametrosFormales = listaParametrosFormales;
        this.bloqueInstrucciones = bloqueInstrucciones;
        this.rol = 'FUNCION';

        this.getTipo = function()
        {
            return this.tipo;
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
            var simbolo = this.tabla.get(id);
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
            this.tabla.set(simbolo.id,simbolo);
        }

        this.getTamanioEntorno = function()
        {
            return this.tabla.size;
        }

        this.getStringTamanioEntorno = function()
        {
            return this.tabla.size.toString();
        }        
    }
}


class Raiz 
{
    constructor(linea, columna, bloqueInstrucciones)
    {
        this.linea = linea;
        this.columna = columna;
        this.bloqueInstrucciones = bloqueInstrucciones;

        this.ejecutar = function(entorno)
        {
            // Primero hacemos lo de afuera y luego ejecutamos el main            
            this.bloqueInstrucciones.instrucciones.forEach(function (instruccion) 
            {
                instruccion.ejecutar(entorno);               
            });


            // De último ejecutamos la función main
            var LLamadaMain = new Llamada(this.linea, this.columna, "main",null);
            LLamadaMain.getValor(entorno);

        }

        this.generar3D = function(entorno)
        {
            // Primero generamos lo del entorno global 
            // Y de ultimo generamos el codigo para la funcion main


            Utils.generarNativas();

            this.bloqueInstrucciones.instrucciones.forEach(function (instruccion) 
            {
                if (instruccion instanceof Funcion)
                {
                    if(instruccion.id!='main')
                    {
                        instruccion.generar3D(entorno);
                    }
                }
                else
                {
                    instruccion.generar3D(entorno);
                }                
            });


            // De último ejecutamos la función main
            this.bloqueInstrucciones.instrucciones.forEach(function (instruccion) 
            {
                if (instruccion instanceof Funcion)
                {
                    if(instruccion.id=='main')
                    {                        
                        instruccion.generar3D(entorno);                        
                    }
                }             
            });            
        }
    }
}


/*Expresiones ------------------------------------------------------------>*/

/*Expresiones Literales------------------------------------------------> */
class Entero
{
    constructor(linea,columna,valor){                
        this.linea=linea;
        this.columna=columna;
        this.valor = valor;        
        this.tipo = new Tipo(TipoPrimitivo.INT);

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

class Double
{
    constructor(linea,columna,valor){                
        this.linea=linea;
        this.columna=columna;
        this.valor = valor;        
        this.tipo = new Tipo(TipoPrimitivo.DOUBLE);

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


class ExpString
{
    constructor(linea,columna,valor){                
        this.linea=linea;
        this.columna=columna;
        this.valor = valor.substring(1,valor.length-1);     
        this.tipo = new Tipo(TipoPrimitivo.STRING);

        this.getTipo=function()
        {
            return this.tipo;
        }

        this.getValor=function(entorno)
        {
            return this.valor;
        }

        this.generar3D = function(entorno)
        {
            /*
            t0=H; // Inicio de la cadena
            t1=H; // Puntero caracter
            heap[t1]= 32; // Caracter a
            H=H+1; // Reservando espacio
            t1=t1+1;
            heap[t1] = 33; // Caracter b
             */

            var t0 = Utils.generarTemporal();
            var t1 = Utils.generarTemporal();

            Utils.imprimirConsola(t0+'=H;// Inicio de la nueva cadena\n');
            Utils.imprimirConsola(t1+'=H;// puntero\n');

            var array = Array.from(this.valor);
            array.forEach(caracter =>
            {
                Utils.imprimirConsola('heap[(int)'+t1+']='+ caracter.charCodeAt() +'; // ' + caracter+'\n'); // Caracter a
                Utils.imprimirConsola('H=H+1; // Reservando espacio \n');
                Utils.imprimirConsola(t1+'='+t1+'+1; // Actualizando puntero \n');
                
            });              
            
            //Agregar caracter de final de cadena
            Utils.imprimirConsola('heap[(int)'+t1+']='+ Utils.obtenerFinCadena() +'; // Fin de cadena. \n'); // Caracter a
            Utils.imprimirConsola('H=H+1; // Reservando espacio \n');           

            return t0;

        }
    }
}


class Caracter
{
    constructor(linea,columna,valor){                
        this.linea=linea;
        this.columna=columna;
        this.valor = valor.substring(1,valor.length-1);      
        this.tipo = new Tipo(TipoPrimitivo.CHAR);

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


class Nulo
{
    constructor(linea,columna){                
        this.linea=linea;
        this.columna=columna;
        this.valor = null;        
        this.tipo = new Tipo(TipoPrimitivo.NULO);

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


class ExpBooleana
{
    constructor(linea,columna,valor){                
        this.linea=linea;
        this.columna=columna;
        this.valor = valor;        
        this.tipo = new Tipo(TipoPrimitivo.BOOL);

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

// Variables
class ExpVariable 
{
    constructor(linea, columna, id)
    {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        
        this.getTipo= function()
        {
            // Implementar busqueda de tipo del símbolo si existe
            return this.tipo;
        }

        this.getValor= function()
        {
            // Implementar busqueda de tipo del símbolo si existe
            return this.valor;
        }        
    }
}


class TipoDe
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            return new Tipo(TipoPrimitivo.STRING);
        }
        
        this.getValor = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            return tipoExpresion.getNombreTipo();
        }
    }
}

/*Expresiones Aritmeticas------------------------------------------------> */

class Suma
{
    constructor(linea, columna, expresionI, expresionD)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresionI = expresionI;
        this.expresionD = expresionD;

        this.getTipo = function(entorno)
        {
            var tipoI = expresionI.getTipo(entorno);
            var tipoD = expresionD.getTipo(entorno);
           
            if(tipoI.esCadena() || tipoD.esCadena())
            {
                return new Tipo(TipoPrimitivo.STRING);
            }
            if(tipoI.esDouble() || tipoD.esDouble())
            {
                return new Tipo(TipoPrimitivo.DOUBLE);
            }

            if(tipoI.esEntero() || tipoI.esChar())
            {
                if(tipoD.esEntero() || tipoD.esChar())
                {
                    return new Tipo(TipoPrimitivo.INT);
                }
            }
            return new Tipo(TipoPrimitivo.ERROR);        
        }        

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '+','Error de tipos en operación suma. '+this.expresionI.getTipo(entorno).getNombreTipo()+' + '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esCadena())
            {
                return valorI.toString() + valorD.toString();
            }
            if(tipo.esDouble())
            {
                return parseFloat(valorI) +parseFloat(valorD);
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) +parseInt(valorD);
            }            
        }
    }
}


class Resta
{
    constructor(linea, columna, expresionI, expresionD)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresionI = expresionI;
        this.expresionD = expresionD;
        this.getTipo = function(entorno)
        {
            var tipoI = expresionI.getTipo(entorno);
            var tipoD = expresionD.getTipo(entorno);
           
            if(tipoI.esCadena() || tipoD.esCadena())
            {
                return new Tipo(TipoPrimitivo.STRING);
            }
            if(tipoI.esDouble() || tipoD.esDouble())
            {
                return new Tipo(TipoPrimitivo.DOUBLE);
            }

            if(tipoI.esEntero() || tipoI.esChar())
            {
                if(tipoD.esEntero() || tipoD.esChar())
                {
                    return new Tipo(TipoPrimitivo.INT);
                }
            }
            return new Tipo(TipoPrimitivo.ERROR);        
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '-','Error de tipos en operación resta. '+this.expresionI.getTipo(entorno).getNombreTipo()+' - '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esCadena())
            {
                return valorI.toString() + valorD.toString();
            }
            if(tipo.esDouble())
            {
                return parseFloat(valorI) +parseFloat(valorD);
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) +parseInt(valorD);
            }            
        }
    }
}

class Llamada
{
    constructor(linea, columna, id, parametros)
    {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.parametros = parametros;

        this.getValor = function(entorno)
        {
            var idBuscado = id ; 
            //

            var funcionBuscada = entorno.getSimbolo(this.id);
            if(funcionBuscada != null || funcionBuscada!= undefined)
            {
                var nuevoEntorno = new Entorno(null);// Cambiar null por global.
                funcionBuscada.bloqueInstrucciones.ejecutar(entorno);
            }
        }

        this.getTipo = function(entorno)
        {

        }
    }
}

/*Instrucciones---------------------------------------->*/





class Funcion 
{
    constructor(linea, columna, tipo, id, parametrosFormales, bloqueInstrucciones)
    {
        this.linea = linea;
        this.columna = columna;
        this.tipo = tipo;
        this.id = id;
        this.parametrosFormales = parametrosFormales;
        this.bloqueInstrucciones = bloqueInstrucciones;

        this.ejecutar= function(entorno)
        {
            // Codigo para guardar esta funcion en el entorno actual. 
            var nuevaFuncion = new SimboloFuncion(this.id, this.columna, this.id, this.tipo, this.parametrosFormales, this.bloqueInstrucciones);            
            entorno.registrarSimbolo(nuevaFuncion);        
        }

        this.generar3D = function(entorno)
        {
            // Codigo para codigo del método. 
            Utils.imprimirConsola('\n\nvoid '+this.id+'() {\n');
            this.bloqueInstrucciones.generar3D(entorno);
            Utils.imprimirConsola('}//Fin main\n');                       
        }
    }
}

class Parametro
{
    /**Este nodo AST lo que hará es una declaracion
     * En el nuevo entorno que se induzca cuando se llama la funcion
     */
    constructor(linea, columna, tipo/* Instancia de clase Tipo */, id)
    {
        this.linea = linea;
        this.columna = columna;
        this.tipo = tipo ;
        this.id = id;
        this.valor = null; // Este valor se tiene que setear al llamar la funcion

        this.ejecutar = function(entorno)
        {
            /* Codigo para crear variable*/

        }

        this.generar3D = function(entorno)
        {
            /*Codigo para generar la instanciación y seteo de variable */
        }
    }
}

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
                if (instruccion instanceof Llamada)
                {
                    instruccion.getValor(entorno);
                }
                else
                {
                    instruccion.ejecutar(entorno);
                }
                
            });
        }

        this.registrarInstruccion = function(instruccion)
        {
            if(instruccion != null)
            {
                this.instrucciones.push(instruccion);
            }           
        }
         
        this.generar3D=function(entorno)
        {
            this.instrucciones.forEach(function (instruccion) 
            {
                instruccion.generar3D(entorno);
            });
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
            if(valor != undefined)
            {
                Utils.imprimirConsola(valor);
            }            
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
            if(valor != undefined)
            {
                Utils.imprimirConsola('\n'+valor);
            }                                    
        }


        this.generar3D = function(entorno)
        {
            var valorExpresion = this.expresion.generar3D(entorno);
            var t0 = Utils.generarTemporal();
            var t1 = Utils.generarTemporal();
            Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulacion de cambio de entorno\n');
            Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
            Utils.imprimirConsola('stack[(int)'+t1+']='+valorExpresion+';//Paso parametro\n');
            Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
            Utils.imprimirConsola('Nativa_ImpresionLn();\n');
            Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Retomar entorno\n');
        }        
    }
}

