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
        this.esNumerico = function(){return this.esEntero() || this.esChar() || this.esDouble();}
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

        this.generar3D=function(entorno)
        {
            return this.valor.toString();
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
        this.generar3D=function(entorno)
        {
            return this.valor%1 > 0 ? this.valor.toString(): this.valor.toString() + '.00';
        }        
    }
}

class ExpString
{
    constructor(linea,columna,valor){                
        this.linea=linea;
        this.columna=columna;
        this.valor = valor;
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

            Utils.imprimirConsola(t0+'=H;// Inicio de la nueva cadena\n');            

            var array = Array.from(this.valor);
            array.forEach(caracter =>
            {
                Utils.imprimirConsola('heap[(int)H]='+ caracter.charCodeAt() +'; // ' + caracter+'\n'); // Caracter a
                Utils.imprimirConsola('H=H+1; // Reservando espacio \n');                
                
            });                          
            //Agregar caracter de final de cadena
            Utils.imprimirConsola('heap[(int)H]='+ Utils.obtenerFinCadena() +'; // Fin de cadena. \n'); // Caracter a
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
        this.valor = valor;
        this.tipo = new Tipo(TipoPrimitivo.CHAR);

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
            return this.valor.charCodeAt().toString();
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

        this.generar3D = function(entorno)
        {
            var nodoString = new ExpString(linea, columna, "null");
            var inicioCadena = nodoString.generar3D(entorno);
            return inicioCadena;
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

        this.generar3D = function(entorno)
        {
            return this.valor? '1':'0';
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

class Concatenar
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
           
            /**
             * Aquí falta verificar. El auxiliar mencionó en una clase que esta operación
             * Convertía ambos operandos a cadena. Hay que confirmar eso.
             */
            return new Tipo(TipoPrimitivo.STRING);        
        }        

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '&','Error de tipos en operación concatenación. '+this.expresionI.getTipo(entorno).getNombreTipo()+' & '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            return valorI.toString() + valorD.toString();        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var tipoI = this.expresionI.getTipo(entorno);
            var tipoD = this.expresionD.getTipo(entorno);
            
            if(tipo.esError())
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, '&','Error de tipos en operación concatenación. '+this.expresionI.getTipo(entorno).getNombreTipo()+' & '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;                
            }



            if(tipoI.esCadena())
            {
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                if(tipoD.esCadena())
                {             
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorI+';\n');
                    Utils.imprimirConsola(t2+'='+t0+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t2+']='+valorD+';\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t3+'=stack[(int)'+t0+']; // Valor de retorno.\n');                    
                    return t3;
                }else
                if(tipoD.esEntero())
                {

                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    var t4 =Utils.generarTemporal();       
                    var t5 =Utils.generarTemporal();
                    var t6 =Utils.generarTemporal();                    
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorD+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('IntToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    Utils.imprimirConsola(t3+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t4+'='+t3+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t4+']='+valorI+'; // Paso cadena 1\n');
                    Utils.imprimirConsola(t5+'='+t3+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t5+']='+t2+'; // Paso cadena 2\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t6+'=stack[(int)'+t3+']; // Valor de retorno.\n');  
                    return t6;
                }
                else if (tipoD.esDouble())
                {
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    var t4 =Utils.generarTemporal();       
                    var t5 =Utils.generarTemporal();
                    var t6 =Utils.generarTemporal();                    
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorD+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('DoubleToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    Utils.imprimirConsola(t3+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t4+'='+t3+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t4+']='+valorI+'; // Paso cadena 1\n');
                    Utils.imprimirConsola(t5+'='+t3+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t5+']='+t2+'; // Paso cadena 2\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t6+'=stack[(int)'+t3+']; // Valor de retorno.\n');  
                    return t6;                    
                }
                else if (tipoD.esChar())
                {
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    var t4 =Utils.generarTemporal();       
                    var t5 =Utils.generarTemporal();
                    var t6 =Utils.generarTemporal();                    
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorD+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('CharToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    Utils.imprimirConsola(t3+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t4+'='+t3+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t4+']='+valorI+'; // Paso cadena 1\n');
                    Utils.imprimirConsola(t5+'='+t3+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t5+']='+t2+'; // Paso cadena 2\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t6+'=stack[(int)'+t3+']; // Valor de retorno.\n');  
                    return t6;                     
                }
                else if (tipoD.esBoolean())
                {
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    var t4 =Utils.generarTemporal();       
                    var t5 =Utils.generarTemporal();
                    var t6 =Utils.generarTemporal();                    
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorD+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('BooleanToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    Utils.imprimirConsola(t3+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t4+'='+t3+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t4+']='+valorI+'; // Paso cadena 1\n');
                    Utils.imprimirConsola(t5+'='+t3+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t5+']='+t2+'; // Paso cadena 2\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t6+'=stack[(int)'+t3+']; // Valor de retorno.\n');  
                    return t6;
                }   
                else if (tipoD.esNulo())
                {
                    var NodoStringNulo = new ExpString(0,0,"null");                    
                    valorD = NodoStringNulo.generar3D(null);                    
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorI+';\n');
                    Utils.imprimirConsola(t2+'='+t0+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t2+']='+valorD+';\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t3+'=stack[(int)'+t0+']; // Valor de retorno.\n');                    
                    return t3;                    
                }                 
                
            }// Completo
            else
            { // Tenemos que convertir el valorI a string.------------------------------------------>

                var valorI = this.expresionI.generar3D(entorno); 
                if (tipoI.esNulo())
                {
                    var NodoStringNulo = new ExpString(0,0,"null");                    
                    valorI = NodoStringNulo.generar3D(null);                  
                }else                             
                if(tipoI.esEntero())
                {

                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorI+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('IntToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    valorI = t2;
                }
                else if (tipoI.esDouble())
                {
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();                                  
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorI+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('DoubleToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');
                    valorI = t2;
                }
                else if (tipoI.esChar())
                {
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();                                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorI+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('CharToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    valorI = t2;                    
                }
                else if (tipoI.esBoolean())
                {
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();                   
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorI+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('BooleanToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    valorI = t2;
                }
                else if (tipoI.esNulo())
                {
                    var NodoStringNulo = new ExpString(0,0,"null");                    
                    valorI = NodoStringNulo.generar3D(null);
                }                

                // valor derecho
                var valorD = this.expresionD.generar3D(entorno);
                if(tipoD.esCadena())
                {             
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorI+';\n');
                    Utils.imprimirConsola(t2+'='+t0+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t2+']='+valorD+';\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t3+'=stack[(int)'+t0+']; // Valor de retorno.\n');                    
                    return t3;
                }else
                if(tipoD.esEntero())
                {

                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    var t4 =Utils.generarTemporal();       
                    var t5 =Utils.generarTemporal();
                    var t6 =Utils.generarTemporal();                    
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorD+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('IntToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    Utils.imprimirConsola(t3+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t4+'='+t3+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t4+']='+valorI+'; // Paso cadena 1\n');
                    Utils.imprimirConsola(t5+'='+t3+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t5+']='+t2+'; // Paso cadena 2\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t6+'=stack[(int)'+t3+']; // Valor de retorno.\n');  
                    return t6;
                }
                else if (tipoD.esDouble())
                {
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    var t4 =Utils.generarTemporal();       
                    var t5 =Utils.generarTemporal();
                    var t6 =Utils.generarTemporal();                    
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorD+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('DoubleToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    Utils.imprimirConsola(t3+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t4+'='+t3+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t4+']='+valorI+'; // Paso cadena 1\n');
                    Utils.imprimirConsola(t5+'='+t3+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t5+']='+t2+'; // Paso cadena 2\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t6+'=stack[(int)'+t3+']; // Valor de retorno.\n');  
                    return t6;                    
                }
                else if (tipoD.esChar())
                {
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    var t4 =Utils.generarTemporal();       
                    var t5 =Utils.generarTemporal();
                    var t6 =Utils.generarTemporal();                    
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorD+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('CharToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    Utils.imprimirConsola(t3+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t4+'='+t3+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t4+']='+valorI+'; // Paso cadena 1\n');
                    Utils.imprimirConsola(t5+'='+t3+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t5+']='+t2+'; // Paso cadena 2\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t6+'=stack[(int)'+t3+']; // Valor de retorno.\n');  
                    return t6;                     
                }
                else if (tipoD.esBoolean())
                {
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    var t4 =Utils.generarTemporal();       
                    var t5 =Utils.generarTemporal();
                    var t6 =Utils.generarTemporal();                    
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorD+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('BooleanToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    Utils.imprimirConsola(t3+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t4+'='+t3+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t4+']='+valorI+'; // Paso cadena 1\n');
                    Utils.imprimirConsola(t5+'='+t3+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t5+']='+t2+'; // Paso cadena 2\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t6+'=stack[(int)'+t3+']; // Valor de retorno.\n');  
                    return t6;
                }    
                else if (tipoD.esNulo())
                {
                    var NodoStringNulo = new ExpString(0,0,"null");                    
                    valorD = NodoStringNulo.generar3D(null);                    
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();
                    var t3 =Utils.generarTemporal();
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1; // Dirección del primer parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+valorI+';\n');
                    Utils.imprimirConsola(t2+'='+t0+'+2;// Dirección del segundo parámetro\n');
                    Utils.imprimirConsola('stack[(int)'+t2+']='+valorD+';\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_Concatenar_Cadenas();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola(t3+'=stack[(int)'+t0+']; // Valor de retorno.\n');                    
                    return t3;                    
                }                             
            }

        }
    }
}


class PotenciaString
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
           
            if(tipoI.esCadena() || tipoD.esNumerico())
            {
                return new Tipo(TipoPrimitivo.STRING);
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
                var repeticiones = parseInt(valorD);
                var cadena = '';
                for(var i = 0; i<repeticiones; i++)
                {
                    cadena +=valorI.toString();                     
                }
                return cadena;
            }        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valorI = this.expresionI.generar3D(entorno);
            var valorD = this.expresionD.generar3D(entorno);
            
            var t0 = Utils.generarTemporal();

            if(tipo.esCadena())
            {
                var repeticiones = valorD;   
                var cadena = valorI;
                
                var t0 = Utils.generarTemporal();
                var t1 = Utils.generarTemporal();
                var t2 = Utils.generarTemporal();
                var t3 = Utils.generarTemporal();
                var t4 = Utils.generarTemporal();
                var t5 = Utils.generarTemporal();
                var t6 = Utils.generarTemporal();
                var L0 = Utils.generarEtiqueta();                
                var L2 = Utils.generarEtiqueta();
                var L3 = Utils.generarEtiqueta();
                var L4 = Utils.generarEtiqueta();
                var L5 = Utils.generarEtiqueta();

                Utils.imprimirConsola(t0+'='+repeticiones+'-1;//Manejo de repeticiones\n');
                repeticiones=t0;
                Utils.imprimirConsola('if('+repeticiones+'< 0) goto '+L0+'; // Verificar tamaño de la repeticion\n');
                Utils.imprimirConsola('goto '+L2+';// Mayor de 0\n');
                Utils.imprimirConsola(L0+':\n');
                var nodoCadena=  new ExpString(0,0,"\nERROR, NO SE PUEDE REPETIR UN CADENA UN NÚMERO NEGATIVO DE VECES.\n");
                var inicioCadena= nodoCadena.generar3D(entorno);
                Utils.imprimirConsola(t1+'='+inicioCadena+';// Cadena vacia por error\n');
                Utils.imprimirConsola('goto '+L3+';\n');
                Utils.imprimirConsola(L2+'://Preparando para concatenar\n');
                Utils.imprimirConsola(t2+'=0;// Contador\n');
                Utils.imprimirConsola(t1+'='+cadena+';// Inicio de cadena\n');
                Utils.imprimirConsola(L3+':\n');
                Utils.imprimirConsola('if('+t2+'<'+repeticiones+') goto '+L4+';//Otra concatenacion\n');
                Utils.imprimirConsola('goto '+L5+';//Fin de la caden\n');
                Utils.imprimirConsola(L4+':\n');
                Utils.imprimirConsola(t3+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                Utils.imprimirConsola(t4+'='+t3+'+1;//Direccion cadena 1\n');
                Utils.imprimirConsola('stack[(int)'+t4+']='+cadena+';// Paso cadena como primer parametro\n');
                Utils.imprimirConsola(t5+'='+t3+'+2;//Direccion cadena 1\n');
                Utils.imprimirConsola('stack[(int)'+t5+']='+t1+';// Paso cadena como segundo parametro\n');
                Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';// Cambio de entorno\n');
                Utils.imprimirConsola('Nativa_Concatenar_Cadenas();// Llamar funcion de concatenacion\n');
                Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';// Retomar entorno\n');
                Utils.imprimirConsola(t6+'='+t3+'+0;//Direccion retorno\n');
                Utils.imprimirConsola(t1+'=stack[(int)'+t6+'];// Inicio de la nueva cadena\n');
                Utils.imprimirConsola(t2+'='+t2+'+1;// Aumento de contador\n');
                Utils.imprimirConsola('goto '+L3+';//Otra iteracion\n');
                Utils.imprimirConsola(L5+':// Fin cadena\n');
                return t1;
            }
        }
    }
}

class Ternario
{
    constructor(linea, columna, condicion, expresionI, expresionD )
    {
        this.linea = linea;
        this.columna = columna;
        this.condicion = condicion;
        this.expresionI = expresionI;
        this.expresionD = expresionD;

        this.getTipo = function(entorno)
        {
            // Verificar este manejo de tipo
            return this.expresionI.getTipo(entorno);
        }

        this.getValor = function(entorno)
        {
            var tipoCondicion = this.condicion.getTipo(entorno);

            if(!tipoCondicion.esBoolean())
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, '?','Error expresión ternaria. Se esperaba una condición booleana. Recibida ' + tipoCondicion.getNombreTipo());
                return;
            }
            var valorCondicion = this.condicion.getValor(entorno);
            if(valorCondicion)
            {
                return this.expresionI.getValor(entorno);
            }
            else
            {
                return this.expresionD.getValor(entorno);
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoCondicion = this.condicion.getTipo(entorno);

            if(!tipoCondicion.esBoolean())
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, '?','Error expresión ternaria. Se esperaba una condición booleana. Recibida ' + tipoCondicion.getNombreTipo());
                return;
            }
            var valorCondicion = this.condicion.generar3D(entorno);
            //Agregar verificación
            if(Utils.tenemosEtiquetas(valorCondicion))
            {
                
                
                var t0 = Utils.generarTemporal();
                var LSalida = Utils.generarTemporal();

                // Hay que ver qué hacemos cuando el retorno es un boolean
                Utils.imprimirConsola(valorCondicion.LV+':\n');
                var valorI = this.expresionI.generar3D(entorno);
                Utils.imprimirConsola(t0+'='+valorI+';\n');
                Utils.imprimirConsola('goto '+LSalida+';\n');                
                Utils.imprimirConsola(valorCondicion.LF+':\n');
                var valorD = this.expresionD.generar3D(entorno);
                Utils.imprimirConsola(t0+'='+valorD+';\n');
                Utils.imprimirConsola(LSalida+':\n');
                return t0;
            }
            else
            {
                //Generar etiquetas
            }
           
        }

    }
}

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
                return new Tipo(TipoPrimitivo.ERROR);
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

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valorI = this.expresionI.generar3D(entorno);
            var valorD = this.expresionD.generar3D(entorno);
            
            var t0 = Utils.generarTemporal();

            if(tipo.esDouble())
            {
                Utils.imprimirConsola(t0+'='+valorI+'+'+valorD+';\n');
                return t0;
            }
            if(tipo.esEntero())
            {
                Utils.imprimirConsola(t0+'='+valorI+'+'+valorD+';\n');
                return t0;
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
            if(tipo.esDouble())
            {
                return parseFloat(valorI) -parseFloat(valorD);
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) -parseInt(valorD);
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            
            var t0 = Utils.generarTemporal();

            if(tipo.esDouble())
            {
                Utils.imprimirConsola(t0+'='+valorI+'-'+valorD+';\n');
                return t0;
            }
            if(tipo.esEntero())
            {
                Utils.imprimirConsola(t0+'='+valorI+'-'+valorD+';\n');
                return t0;
            }                            
        } 
        
/*        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valorI = this.expresionI.generar3D(entorno);
            var valorD = this.expresionD.generar3D(entorno);
            
            var t0 = Utils.generarTemporal();

            if(tipo.esDouble())
            {
                Utils.imprimirConsola(t0+'='+valorI+'-'+valorD+';\n');
                return t0;
            }
            if(tipo.esEntero())
            {
                Utils.imprimirConsola(t0+'='+valorI+'-'+valorD+';\n');
                return t0;
            } 
        }        
*/
    }
}


class Menos
{
    constructor(linea, columna, expresionI)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresionI = expresionI;        
        this.getTipo = function(entorno)
        {
            var tipoI = expresionI.getTipo(entorno);            
           
            if(tipoI.esDouble())
            {
                return new Tipo(TipoPrimitivo.DOUBLE);
            }

            if(tipoI.esEntero() || tipoI.esChar())
            {
                return new Tipo(TipoPrimitivo.INT);
            }
            return new Tipo(TipoPrimitivo.ERROR);        
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '-','Error de tipos en operación menos.  - '+ this.expresionI.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);            
            if(tipo.esDouble())
            {
                return parseFloat(valorI) *-1;
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) *-1;
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valorI = this.expresionI.getValor(entorno);                                
            if(tipo.esDouble())
            {
                var t0 = Utils.generarTemporal();
                Utils.imprimirConsola(t0+'='+valorI+'* -1;\n');
                return t0;
            }
            if(tipo.esEntero())
            {
                var t0 = Utils.generarTemporal();
                Utils.imprimirConsola(t0+'='+valorI+'* -1;\n');
                return t0;
            }                            
        } 
               
    }
}

class Multiplicacion
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
                Utils.registrarErrorSemantico(this.linea, this.columna, '*','Error de tipos en operación multiplicación. '+this.expresionI.getTipo(entorno).getNombreTipo()+' * '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esDouble())
            {
                return parseFloat(valorI) *parseFloat(valorD);
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) *parseInt(valorD);
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valorI = this.expresionI.generar3D(entorno);
            var valorD = this.expresionD.generar3D(entorno);
            
            var t0 = Utils.generarTemporal();

            if(tipo.esDouble())
            {
                Utils.imprimirConsola(t0+'='+valorI+'*'+valorD+';\n');
                return t0;
            }
            if(tipo.esEntero())
            {
                Utils.imprimirConsola(t0+'='+valorI+'*'+valorD+';\n');
                return t0;
            } 
        }          
    }
}

class Division
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
                Utils.registrarErrorSemantico(this.linea, this.columna, '/','Error de tipos en operación división. '+this.expresionI.getTipo(entorno).getNombreTipo()+' / '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esDouble())
            {
                return parseFloat(valorI) /parseFloat(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) /parseInt(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valorI = this.expresionI.generar3D(entorno);
            var valorD = this.expresionD.generar3D(entorno);
            
            var t0 = Utils.generarTemporal();

            if(tipo.esDouble() || tipo.esEntero())
            {
                var L1 = Utils.generarEtiqueta();
                var L2 = Utils.generarEtiqueta();
                var L3 = Utils.generarEtiqueta();
                Utils.imprimirConsola('if('+valorD+'==0) goto '+L1+'; // Error dividendo\n');
                Utils.imprimirConsola('goto '+L2+';//correcto\n');
                Utils.imprimirConsola(L1+':\n');
                var nodoString = new ExpString(this.linea, this.columna, "Error. El dividendo no puede ser igual a 0.");
                var inicioCadena = nodoString.generar3D(entorno);
                Utils.generarCodigoParaImprimirLn(inicioCadena, entorno);
                Utils.imprimirConsola(t0+'=0;//correcto\n');
                Utils.imprimirConsola('goto '+L3+';//Salida\n');
                Utils.imprimirConsola(L2+':\n');
                Utils.imprimirConsola(t0+'='+valorI+'/'+valorD+';\n');
                Utils.imprimirConsola(L3+':\n');                        
                return t0;
            }                          
        }        
    }
}


class Modulo
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
                Utils.registrarErrorSemantico(this.linea, this.columna, '%','Error de tipos en operación módulo. '+this.expresionI.getTipo(entorno).getNombreTipo()+' / '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esDouble())
            {
                return parseFloat(valorI) /parseFloat(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) /parseInt(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valorI = this.expresionI.generar3D(entorno);
            var valorD = this.expresionD.generar3D(entorno);
            
            var t0 = Utils.generarTemporal();

            if(tipo.esDouble())
            {
                //Utils.imprimirConsola(t0+'='+valorI+'%'+valorD+';\n');
                Utils.imprimirConsola(t0+'=fmod('+valorI+', '+valorD+');\n')
                return t0;
            }
            if(tipo.esEntero())
            {
                //Utils.imprimirConsola(t0+'='+valorI+'%'+valorD+';\n');
                Utils.imprimirConsola(t0+'=fmod('+valorI+', '+valorD+');\n')
                return t0;
            } 
        }        
    }
}


class Potencia
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
           
            if(tipoI.esDouble() || tipoD.esDouble())
            {
                return new Tipo(TipoPrimitivo.DOUBLE);
            }

            if(tipoI.esEntero() || tipoI.esChar())
            {
                if(tipoD.esEntero() || tipoD.esChar())
                {
                    return new Tipo(TipoPrimitivo.DOUBLE);
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
                Utils.registrarErrorSemantico(this.linea, this.columna, '%','Error de tipos en operación módulo. '+this.expresionI.getTipo(entorno).getNombreTipo()+' / '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esDouble())
            {
                return parseFloat(valorI) /parseFloat(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) /parseInt(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valorI = this.expresionI.generar3D(entorno);
            var valorD = this.expresionD.generar3D(entorno);
            
            var t0 = Utils.generarTemporal();

            if(tipo.esNumerico())
            {
                //Utils.imprimirConsola(t0+'='+valorI+'%'+valorD+';\n');
                Utils.imprimirConsola(t0+'=pow('+valorI+', '+valorD+');\n')
                return t0;
            }
        }        
    }
}


class RaizCuadrada
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;        
        this.getTipo = function(entorno)
        {
            var tipo = expresion.getTipo(entorno);            
           
            if(tipo.esNumerico())
            {
                return new Tipo(TipoPrimitivo.DOUBLE);
            }
            return new Tipo(TipoPrimitivo.ERROR);        
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '%','Error de tipos en operación módulo. '+this.expresionI.getTipo(entorno).getNombreTipo()+' / '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esDouble())
            {
                return parseFloat(valorI) /parseFloat(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) /parseInt(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valor = this.expresion.generar3D(entorno);            
            
            var t0 = Utils.generarTemporal();

            if(tipo.esNumerico())
            {
                //Utils.imprimirConsola(t0+'='+valorI+'%'+valorD+';\n');
                Utils.imprimirConsola(t0+'=sqrt('+valor+');\n')
                return t0;
            }
        }        
    }
}


class Seno
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;        
        this.getTipo = function(entorno)
        {
            var tipo = expresion.getTipo(entorno);            
           
            if(tipo.esNumerico())
            {
                return new Tipo(TipoPrimitivo.DOUBLE);
            }
            return new Tipo(TipoPrimitivo.ERROR);        
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '%','Error de tipos en operación módulo. '+this.expresionI.getTipo(entorno).getNombreTipo()+' / '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esDouble())
            {
                return parseFloat(valorI) /parseFloat(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) /parseInt(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valor = this.expresion.generar3D(entorno);            
            
            var t0 = Utils.generarTemporal();

            if(tipo.esNumerico())
            {
                //Utils.imprimirConsola(t0+'='+valorI+'%'+valorD+';\n');
                Utils.imprimirConsola(t0+'=sin('+valor+');\n')
                return t0;
            }
        }        
    }
}



class Coseno
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;        
        this.getTipo = function(entorno)
        {
            var tipo = expresion.getTipo(entorno);            
           
            if(tipo.esNumerico())
            {
                return new Tipo(TipoPrimitivo.DOUBLE);
            }
            return new Tipo(TipoPrimitivo.ERROR);        
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '%','Error de tipos en operación módulo. '+this.expresionI.getTipo(entorno).getNombreTipo()+' / '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esDouble())
            {
                return parseFloat(valorI) /parseFloat(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) /parseInt(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valor = this.expresion.generar3D(entorno);            
            
            var t0 = Utils.generarTemporal();

            if(tipo.esNumerico())
            {
                //Utils.imprimirConsola(t0+'='+valorI+'%'+valorD+';\n');
                Utils.imprimirConsola(t0+'=cos('+valor+');\n')
                return t0;
            }
        }        
    }
}


class Tangente
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;        
        this.getTipo = function(entorno)
        {
            var tipo = expresion.getTipo(entorno);            
           
            if(tipo.esNumerico())
            {
                return new Tipo(TipoPrimitivo.DOUBLE);
            }
            return new Tipo(TipoPrimitivo.ERROR);        
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '%','Error de tipos en operación módulo. '+this.expresionI.getTipo(entorno).getNombreTipo()+' / '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            if(tipo.esDouble())
            {
                return parseFloat(valorI) /parseFloat(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) /parseInt(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }                        
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            var valor = this.expresion.generar3D(entorno);            
            
            var t0 = Utils.generarTemporal();

            if(tipo.esNumerico())
            {
                //Utils.imprimirConsola(t0+'='+valorI+'%'+valorD+';\n');
                Utils.imprimirConsola(t0+'=tan('+valor+');\n')
                return t0;
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


/*Expresiones Relacionales------------------------------------------------> */

class Igualdad
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

            //TODO: verificar igual de arreglos
            if(tipoI.esNulo() || tipoI.esArreglo() || tipoI.esStruct() || tipoI.esError() || tipoI.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }
            if(tipoD.esNulo() || tipoD.esArreglo() || tipoD.esStruct() || tipoD.esError() || tipoD.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }

            return new Tipo(TipoPrimitivo.BOOL);
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '==','Error de tipos en operación igualdad. '+this.expresionI.getTipo(entorno).getNombreTipo()+' + '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var tipoI = expresionI.getTipo(entorno);
            var tipoD = expresionD.getTipo(entorno);

            //TODO:validar las cadenas o caracteres
            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);

            return parseFloat(valorI) === parseFloat(valorD);
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '==','Error de tipos en operación igualdad. '+this.expresionI.getTipo(entorno).getNombreTipo()+' == '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }
            var tipoI = this.expresionI.getTipo(entorno);
            var tipoD = this.expresionI.getTipo(entorno);

            if(tipoI.esNumerico() && tipoD.esNumerico())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                
                Utils.imprimirConsola('if('+valorI+'=='+valorD+') goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
            else if(tipoI.esBoolean() && tipoD.esBoolean())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                
                Utils.imprimirConsola('if('+valorI+'=='+valorD+') goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
            else if(tipoI.esCadena() && tipoD.esCadena())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                

                //Temporales
                var t0 = Utils.generarTemporal();
                var t1 = Utils.generarTemporal();
                var t2 = Utils.generarTemporal();
                var t3 = Utils.generarTemporal();
                var t4 = Utils.generarTemporal();

                Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulacion de cambio de entorno\n');
                Utils.imprimirConsola(t1+'='+t0+'+1; //Direccion Cadena 1\n');
                Utils.imprimirConsola('stack[(int)'+t1+'] = '+valorI+'; // Pasando primer cadena\n');
                Utils.imprimirConsola(t2+'='+t0+'+2; //Direccion Cadena 2\n');
                Utils.imprimirConsola('stack[(int)'+t2+'] = '+valorD+'; // Pasando segunda cadena\n');
                Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                Utils.imprimirConsola('Nativa_Comparar_Cadenas();\n');
                Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Retomar de entorno\n');
                Utils.imprimirConsola(t3+'='+t0+'+0; //Direccion retorno\n');
                Utils.imprimirConsola(t4+'=stack[(int)'+t3+']; //Valor de retorno\n');
                Utils.imprimirConsola('if('+t4+'==1) goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
        }
    }
}

class Diferenciacion
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

            //TODO: verificar igual de arreglos
            if(tipoI.esNulo() || tipoI.esArreglo() || tipoI.esStruct() || tipoI.esError() || tipoI.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }
            if(tipoD.esNulo() || tipoD.esArreglo() || tipoD.esStruct() || tipoD.esError() || tipoD.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }

            return new Tipo(TipoPrimitivo.BOOL);
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '!=','Error de tipos en operación diferencia. '+this.expresionI.getTipo(entorno).getNombreTipo()+' + '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var tipoI = expresionI.getTipo(entorno);
            var tipoD = expresionD.getTipo(entorno);

            //TODO:validar las cadenas o caracteres
            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);

            return parseFloat(valorI) != parseFloat(valorD);
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '!=','Error de tipos en operación desigualdad. '+this.expresionI.getTipo(entorno).getNombreTipo()+' != '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }
            var tipoI = this.expresionI.getTipo(entorno);
            var tipoD = this.expresionI.getTipo(entorno);

            if(tipoI.esNumerico() && tipoD.esNumerico())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                
                Utils.imprimirConsola('if('+valorI+'!='+valorD+') goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
            else if(tipoI.esBoolean() && tipoD.esBoolean())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                
                Utils.imprimirConsola('if('+valorI+'!='+valorD+') goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
            else if(tipoI.esCadena() && tipoD.esCadena())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                

                //Temporales
                var t0 = Utils.generarTemporal();
                var t1 = Utils.generarTemporal();
                var t2 = Utils.generarTemporal();
                var t3 = Utils.generarTemporal();
                var t4 = Utils.generarTemporal();

                Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+'; // Simulacion de cambio de entorno\n');
                Utils.imprimirConsola(t1+'='+t0+'+1; //Direccion Cadena 1\n');
                Utils.imprimirConsola('stack[(int)'+t1+'] = '+valorI+'; // Pasando primer cadena\n');
                Utils.imprimirConsola(t2+'='+t0+'+2; //Direccion Cadena 2\n');
                Utils.imprimirConsola('stack[(int)'+t2+'] = '+valorD+'; // Pasando segunda cadena\n');
                Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                Utils.imprimirConsola('Nativa_Comparar_Cadenas();\n');
                Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Retomar de entorno\n');
                Utils.imprimirConsola(t3+'='+t0+'+0; //Direccion retorno\n');
                Utils.imprimirConsola(t4+'=stack[(int)'+t3+']; //Valor de retorno\n');
                Utils.imprimirConsola('if('+t4+'==0) goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
        }
    }
}

class MayorQue
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

            //TODO: verificar igual de arreglos
            if(tipoI.esNulo() || tipoI.esArreglo() || tipoI.esStruct() || tipoI.esError() || tipoI.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }
            if(tipoD.esNulo() || tipoD.esArreglo() || tipoD.esStruct() || tipoD.esError() || tipoD.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }

            return new Tipo(TipoPrimitivo.BOOL);
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '>','Error de tipos en operación mayor que. '+this.expresionI.getTipo(entorno).getNombreTipo()+' + '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var tipoI = expresionI.getTipo(entorno);
            var tipoD = expresionD.getTipo(entorno);

            //TODO:validar las cadenas o caracteres
            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);

            return parseFloat(valorI) > parseFloat(valorD);
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '>','Error de tipos en operación mayor que. '+this.expresionI.getTipo(entorno).getNombreTipo()+' > '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }
            var tipoI = this.expresionI.getTipo(entorno);
            var tipoD = this.expresionI.getTipo(entorno);

            if(tipoI.esNumerico() && tipoD.esNumerico())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                
                Utils.imprimirConsola('if('+valorI+'>'+valorD+') goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
        }
    }
}

class MenorQue
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

            //TODO: verificar igual de arreglos
            if(tipoI.esNulo() || tipoI.esArreglo() || tipoI.esStruct() || tipoI.esError() || tipoI.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }
            if(tipoD.esNulo() || tipoD.esArreglo() || tipoD.esStruct() || tipoD.esError() || tipoD.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }

            return new Tipo(TipoPrimitivo.BOOL);
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '<','Error de tipos en operación menor que. '+this.expresionI.getTipo(entorno).getNombreTipo()+' + '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var tipoI = expresionI.getTipo(entorno);
            var tipoD = expresionD.getTipo(entorno);

            //TODO:validar las cadenas o caracteres
            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);

            return parseFloat(valorI) < parseFloat(valorD);
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '<','Error de tipos en operación menor que. '+this.expresionI.getTipo(entorno).getNombreTipo()+' < '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }
            var tipoI = this.expresionI.getTipo(entorno);
            var tipoD = this.expresionI.getTipo(entorno);

            if(tipoI.esNumerico() && tipoD.esNumerico())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                
                Utils.imprimirConsola('if('+valorI+'<'+valorD+') goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
        }
    }
}

class MayorIgual
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

            //TODO: verificar igual de arreglos
            if(tipoI.esNulo() || tipoI.esArreglo() || tipoI.esStruct() || tipoI.esError() || tipoI.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }
            if(tipoD.esNulo() || tipoD.esArreglo() || tipoD.esStruct() || tipoD.esError() || tipoD.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }

            return new Tipo(TipoPrimitivo.BOOL);
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '>=','Error de tipos en operación mayor igual que. '+this.expresionI.getTipo(entorno).getNombreTipo()+' + '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var tipoI = expresionI.getTipo(entorno);
            var tipoD = expresionD.getTipo(entorno);

            //TODO:validar las cadenas o caracteres
            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);

            return parseFloat(valorI) >= parseFloat(valorD);
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '>=','Error de tipos en operación mayor o igual que. '+this.expresionI.getTipo(entorno).getNombreTipo()+' >= '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }
            var tipoI = this.expresionI.getTipo(entorno);
            var tipoD = this.expresionI.getTipo(entorno);

            if(tipoI.esNumerico() && tipoD.esNumerico())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                
                Utils.imprimirConsola('if('+valorI+'>='+valorD+') goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
        }
    }
}

class MenorIgual
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

            //TODO: verificar igual de arreglos
            if(tipoI.esNulo() || tipoI.esArreglo() || tipoI.esStruct() || tipoI.esError() || tipoI.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }
            if(tipoD.esNulo() || tipoD.esArreglo() || tipoD.esStruct() || tipoD.esError() || tipoD.esStructNombre())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }

            return new Tipo(TipoPrimitivo.BOOL);
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '<=','Error de tipos en operación menor igual que. '+this.expresionI.getTipo(entorno).getNombreTipo()+' + '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            var tipoI = expresionI.getTipo(entorno);
            var tipoD = expresionD.getTipo(entorno);

            //TODO:validar las cadenas o caracteres
            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);

            return parseFloat(valorI) <= parseFloat(valorD);
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '<=','Error de tipos en operación menor o igual que. '+this.expresionI.getTipo(entorno).getNombreTipo()+' <= '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }
            var tipoI = this.expresionI.getTipo(entorno);
            var tipoD = this.expresionI.getTipo(entorno);

            if(tipoI.esNumerico() && tipoD.esNumerico())
            {
                this.LV = Utils.generarEtiqueta();
                this.LF = Utils.generarEtiqueta();
                var valorI = this.expresionI.generar3D(entorno);
                var valorD = this.expresionD.generar3D(entorno);
                
                Utils.imprimirConsola('if('+valorI+'<='+valorD+') goto '+this.LV+'; \n');
                Utils.imprimirConsola('goto '+this.LF+'; \n');
                return this;
            }
        }
    }
}



/*Expresiones Logicas------------------------------------------------> */

class AndLog
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

            //TODO: verificar validaciones
            if(!tipoI.esBoolean() || !tipoD.esBoolean())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }

            return new Tipo(TipoPrimitivo.BOOL);
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '&&','Error de tipos en operación and. '+this.expresionI.getTipo(entorno).getNombreTipo()+' + '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            //var tipoI = expresionI.getTipo(entorno);
            //var tipoD = expresionD.getTipo(entorno);

            //TODO:validar las cadenas o caracteres
            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);

            return Boolean(valorI) && Boolean(valorD);
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '&&','Error de tipos en operación lógica and. '+this.expresionI.getTipo(entorno).getNombreTipo()+' && '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }            
            
            var valorI = this.expresionI.generar3D(entorno);                    
            if(Utils.tenemosEtiquetas(valorI))
            {
                Utils.imprimirConsola(valorI.LV+':\n');
                var valorD = this.expresionD.generar3D(entorno);
                if(Utils.tenemosEtiquetas(valorD))
                {
                    this.LV = valorD.LV;
                    this.LF = valorD.LF + ':\n'+ valorI.LF;
                }
                else
                {
                    this.LV = Utils.generarEtiqueta();
                    var LF = Utils.generarEtiqueta();
                    Utils.imprimirConsola('if('+valorD+'==1) goto '+this.LV+';//Verdadero\n');
                    Utils.imprimirConsola('goto '+LF+';//Falso\n');
                    this.LF = valorI.LF + ':\n'+ LF;
                }
            }
            else
            {

                var LV = Utils.generarEtiqueta();
                var LF = Utils.generarEtiqueta();
                Utils.imprimirConsola('if('+valorI+'==1) goto '+LV+';//Verdadero\n');
                Utils.imprimirConsola('goto '+LF+';//Falso\n');
                Utils.imprimirConsola(LV+':\n');
                var valorD = this.expresionD.generar3D(entorno);

                if(Utils.tenemosEtiquetas(valorD))
                {
                    this.LV = valorD.LV;
                    this.LF = LF + ':\n'+ valorD.LF;
                }
                else
                {
                    this.LV = Utils.generarEtiqueta();                    
                    Utils.imprimirConsola('if('+valorD+'==1) goto '+this.LV+';//Verdadero\n');
                    Utils.imprimirConsola('goto '+LF+';//Falso\n');
                    this.LF = LF;
                }                
                
            }
            return this;            
        }
    }
}

class OrLog
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

            //TODO: verificar validaciones
            if(!tipoI.esBoolean() || !tipoD.esBoolean())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }

            return new Tipo(TipoPrimitivo.BOOL);
        }

        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '||','Error de tipos en operación or. '+this.expresionI.getTipo(entorno).getNombreTipo()+' + '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }

            //var tipoI = expresionI.getTipo(entorno);
            //var tipoD = expresionD.getTipo(entorno);

            //TODO:validar las cadenas o caracteres
            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);

            return Boolean(valorI) || Boolean(valorD);
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '||','Error de tipos en operación lógica OR. '+this.expresionI.getTipo(entorno).getNombreTipo()+' || '+ this.expresionD.getTipo(entorno).getNombreTipo());
                return;
            }            
            var valorI = this.expresionI.generar3D(entorno);                        
            if(Utils.tenemosEtiquetas(valorI))
            {
                Utils.imprimirConsola(valorI.LF+':\n');
                var valorD = this.expresionD.generar3D(entorno);
                if(Utils.tenemosEtiquetas(valorD))
                {
                    this.LV = valorD.LV + ':\n'+ valorI.LV;
                    this.LF = valorD.LF;
                }
                else
                {
                    var LV = Utils.generarEtiqueta();
                    this.LF = Utils.generarEtiqueta();
                    Utils.imprimirConsola('if('+valorD+'==1) goto '+LV+';//Verdadero\n');
                    Utils.imprimirConsola('goto '+this.LF+';//Falso\n');                    
                    this.LV = valorI.LV + ':\n' + LV;
                }
            }
            else
            {

                var LV = Utils.generarEtiqueta();
                var LF = Utils.generarEtiqueta();
                Utils.imprimirConsola('if('+valorI+'==1) goto '+LV+';//Verdadero\n');
                Utils.imprimirConsola('goto '+LF+';//Falso\n');
                Utils.imprimirConsola(LV+':\n');
                var valorD = this.expresionD.generar3D(entorno);

                if(Utils.tenemosEtiquetas(valorD))
                {
                    this.LV = LV +':\n'+valorD.LV;
                    this.LF = valorD.LF;
                }
                else
                {
                    this.LV = Utils.generarEtiqueta();                    
                    Utils.imprimirConsola('if('+valorD+'==1) goto '+this.LV+';//Verdadero\n');
                    Utils.imprimirConsola('goto '+LF+';//Falso\n');
                    this.LF = LF;
                    this.LV = LV +':\n' + this.LV;
                }                
                
            }
            return this;            
        }
    }
}

class NotLog
{
    constructor(linea, columna, expresionI)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresionI = expresionI;

        this.getTipo = function(entorno)
        {
            var tipoI = expresionI.getTipo(entorno);

            //TODO: verificar validaciones
            if(!tipoI.esBoolean())
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }

            return new Tipo(TipoPrimitivo.BOOL);
        }


        this.getValor= function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                //Registramos el error
                Utils.registrarErrorSemantico(this.linea, this.columna, '!','Error de tipos en operación de negacion. '+this.expresionI.getTipo(entorno).getNombreTipo());
                return;
            }

            //var tipoI = expresionI.getTipo(entorno);

            //TODO:validar las cadenas o caracteres
            var valorI = this.expresionI.getValor(entorno);

            return !Boolean(valorI);
        }

        this.generar3D = function(entorno)
        {
            var tipo = this.getTipo(entorno);
            if(tipo.esError())
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, '!','Error de tipos en operación de negacion. '+this.expresionI.getTipo(entorno).getNombreTipo());
                return;
            }   
            
            var valorI = this.expresionI.generar3D(entorno);
            if(Utils.tenemosEtiquetas(valorI))
            {
                this.LF = valorI.LV;
                this.LV = valorI.LF;
                return this;
            }
            else
            {
                this.LF = Utils.generarEtiqueta();
                this.LV = Utils.generarEtiqueta();
                Utils.imprimirConsola('if('+valorI+'==1) goto '+this.LF+';//Falso\n');
                Utils.imprimirConsola('goto '+this.LV+';//Verdadero\n');
                return this;
            }

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
            Utils.imprimirConsola('return;\n');
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
        
        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);

            if(tipoExpresion.esNulo())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                Utils.generarCodigoParaImprimir(valorExpresion,entorno);               
            }  
            else
            if(tipoExpresion.esEntero())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                Utils.imprimirConsola('printf("%d", (int)'+valorExpresion+'); // Imprimir entero\n');                
            }
            else
            if(tipoExpresion.esDouble())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                Utils.imprimirConsola('printf("%f",'+valorExpresion+'); // Imprimir double\n');                
            }   
            else 
            if(tipoExpresion.esBoolean())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                var t3 = Utils.generarTemporal();
                var L1 = Utils.generarEtiqueta();
                var L2 = Utils.generarEtiqueta();
                var L3 = Utils.generarEtiqueta();  
                var t0 = Utils.generarTemporal();                              
                Utils.imprimirConsola('if ('+valorExpresion+'==1) goto '+L1+'; // Valor Verdadero\n');
                Utils.imprimirConsola('goto '+L2+'; // Valor falso\n');
                Utils.imprimirConsola(L1+':\n');
                var nodoStringVerdadero = new ExpString(this.linea, this.columna,"true"); 
                var cadenaStringVerdadero = nodoStringVerdadero.generar3D(entorno);
                Utils.imprimirConsola(t3+'='+cadenaStringVerdadero+'; // Inicio cadena\n');
                Utils.imprimirConsola('goto '+L3+'; // Salida\n');
                Utils.imprimirConsola(L2+':\n');
                var nodoStringFalso = new ExpString(this.linea, this.columna,"false");
                var cadenaStringFalso = nodoStringFalso.generar3D(entorno);
                Utils.imprimirConsola(t0+'='+cadenaStringFalso+'; // Inicio cadena\n');
                Utils.imprimirConsola(L3+':\n');
                var inicioCadena = nodoStringVerdadero.generar3D(entorno);
                t0 = Utils.generarTemporal();
                var t1 = Utils.generarTemporal();                
                Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulacion de cambio de entorno\n');
                Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                Utils.imprimirConsola('stack[(int)'+t1+']='+t3+';//Paso parametro\n');
                Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                Utils.imprimirConsola('Nativa_Impresion();\n');
                Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Retomar entorno\n');
            }            
            else
            if(tipoExpresion.esChar())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                Utils.imprimirConsola('printf("%c", '+valorExpresion+'); // Imprimir caracter\n');                 
            }            
            else            
            if(tipoExpresion.esCadena())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                var t0 = Utils.generarTemporal();
                var t1 = Utils.generarTemporal();
                Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulacion de cambio de entorno\n');
                Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                Utils.imprimirConsola('stack[(int)'+t1+']='+valorExpresion+';//Paso parametro\n');
                Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                Utils.imprimirConsola('Nativa_Impresion();\n');
                Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Retomar entorno\n');
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
            var tipoExpresion = this.expresion.getTipo(entorno);

            if(tipoExpresion.esNulo())
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
            else
            if(tipoExpresion.esEntero())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                Utils.imprimirConsola('printf("%d", (int)'+valorExpresion+'); // Imprimir entero\n'); 
                Utils.imprimirConsola('printf("%c", 10); // Imprimir salto\n');               
            }
            else
            if(tipoExpresion.esDouble())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                Utils.imprimirConsola('printf("%f",'+valorExpresion+'); // Imprimir double\n');    
                Utils.imprimirConsola('printf("%c", 10); // Imprimir salto\n');            
            }   
            else 
            if(tipoExpresion.esBoolean())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                if(Utils.tenemosEtiquetas(valorExpresion))
                {         
                    var LSalida = Utils.generarEtiqueta();          
                    Utils.imprimirConsola(valorExpresion.LV+':\n');
                    var cadenaVerdadero = new ExpString(this.linea, this.columna, "true\n");
                    var inicioCadena = cadenaVerdadero.generar3D(entorno);
                    Utils.generarCodigoParaImprimir(inicioCadena, entorno);                    
                    Utils.imprimirConsola('goto '+LSalida+'; // Salida\n ');
                    Utils.imprimirConsola(valorExpresion.LF+':\n');
                    var cadenaFalso = new ExpString(this.linea, this.columna, "false\n");
                    inicioCadena = cadenaFalso.generar3D(entorno);
                    Utils.generarCodigoParaImprimir(inicioCadena, entorno);
                    Utils.imprimirConsola(LSalida+':\n');
                }                
                else
                {
                    var t3 = Utils.generarTemporal();                
                    var L1 = Utils.generarEtiqueta();
                    var L2 = Utils.generarEtiqueta();
                    var L3 = Utils.generarEtiqueta();
                    var t0 = Utils.generarTemporal();
                    Utils.imprimirConsola('if ('+valorExpresion+'==1) goto '+L1+'; // Valor Verdadero\n');
                    Utils.imprimirConsola('goto '+L2+'; // Valor falso\n');
                    Utils.imprimirConsola(L1+':\n');
                    var nodoStringVerdadero = new ExpString(this.linea, this.columna,"true");   
                    var cadenaStringVerdadero = nodoStringVerdadero.generar3D(entorno);           
                    Utils.imprimirConsola(t3+'='+cadenaStringVerdadero+'; // Inicio cadena\n');
                    Utils.imprimirConsola('goto '+L3+'; // Salida\n');
                    Utils.imprimirConsola(L2+':\n');
                    var nodoStringFalso = new ExpString(this.linea, this.columna,"false");
                    var cadenaStringFalso = nodoStringFalso.generar3D(entorno); 
                    Utils.imprimirConsola(t3+'='+cadenaStringFalso+'; // Inicio cadena\n');
                    Utils.imprimirConsola(L3+':\n');
                    var inicioCadena = nodoStringVerdadero.generar3D(entorno);
                    t0 = Utils.generarTemporal();
                    var t1 = Utils.generarTemporal();
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulacion de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+t3+';//Paso parametro\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_ImpresionLn();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Retomar entorno\n');
                }
            }            
            else
            if(tipoExpresion.esChar())
            {
                var valorExpresion = this.expresion.generar3D(entorno);
                Utils.imprimirConsola('printf("%c", '+valorExpresion+'); // Imprimir caracter\n');   
                Utils.imprimirConsola('printf("%c", 10); // Imprimir salto\n');              
            }            
            else            
            if(tipoExpresion.esCadena())
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
}

