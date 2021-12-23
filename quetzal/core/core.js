var TipoPrimitivo;
(function (TipoPrimitivo) {
    TipoPrimitivo[TipoPrimitivo["NULO"] = 0] = "NULO";
    TipoPrimitivo[TipoPrimitivo["INT"] = 1] = "INT";
    TipoPrimitivo[TipoPrimitivo["DOUBLE"] = 2] = "DOUBLE";
    TipoPrimitivo[TipoPrimitivo["BOOL"] = 3] = "BOOL";
    TipoPrimitivo[TipoPrimitivo["CHAR"] = 4] = "CHAR";
    TipoPrimitivo[TipoPrimitivo["STRING"] = 5] = "STRING";    
    TipoPrimitivo[TipoPrimitivo["ARREGLO"] = 6] = "ARREGLO";
    TipoPrimitivo[TipoPrimitivo["STRUCT"] = 7] = "STRUCT";
    TipoPrimitivo[TipoPrimitivo["ERROR"] = 10] = "ERROR";    
    TipoPrimitivo[TipoPrimitivo["VOID"] = 11] = "VOID";  
})(TipoPrimitivo || (TipoPrimitivo = {}));

class Tipo
{
    constructor(tipo, nombre ="")
    {
        this.tipo = tipo; // Tiene que ser un tipo primitivo
        this.nombre = nombre;
        
        this.esNulo =   function(){ return this.tipo == TipoPrimitivo.NULO;}
        this.esEntero = function(){ return this.tipo == TipoPrimitivo.INT;}
        this.esDouble = function(){ return this.tipo == TipoPrimitivo.DOUBLE;}
        this.esBoolean = function(){ return this.tipo == TipoPrimitivo.BOOL;}
        this.esChar = function(){ return this.tipo == TipoPrimitivo.CHAR;}
        this.esCadena = function(){ return this.tipo == TipoPrimitivo.STRING;}                
        this.esArreglo = function(){ return this.tipo == TipoPrimitivo.ARREGLO;}  
        this.esStruct = function(){ return this.tipo == TipoPrimitivo.STRUCT;} 
        this.esError = function(){ return this.tipo == TipoPrimitivo.ERROR;} 
        this.esNumerico = function() { return this.esEntero() || this.esDouble() || this.esChar(); }
        this.esStructNombre = function(id){ return this.tipo ==  TipoPrimitivo.STRUCT && this.nombre==id; }

        this.esIgual =function(tipo)
        { 
            return this.tipo==tipo.tipo || 
            (this.esNumerico() && tipo.esNumerico());
        }
        
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
        this.rol = '';
        this.arregloTamanio = 0;

        this.getTipo = function()
        {
            return this.tipo;
        }

        this.getValor =function()
        {
            return this.valor;
        }

        this.getPosicion = function(){ return this.posicion.toString();}
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
        this.posicion =0;

        this.getTipo = function()
        {
            return this.tipo;
        }

        this.getValor =function()
        {
            return this.valor;
        }
        this.getPosicion = function(){ return this.posicion.toString();}
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
        this.entorno = null;

        this.getTipo = function()
        {
            return this.tipo;
        }

        this.setEntornoFuncion = function(entorno)
        {
            this.entorno =entorno;
        }

    }    
}

class Entorno
{
    constructor(padre, guardar=true)
    {
        
        this.padre = padre;
        this.tabla = new Map();
        this.contador = 1;

        this.getSimbolo= function(id)
        {
            var simbolo = this.tabla.get(id);
            if(simbolo != null)
            {
                return simbolo;
            }

            var entornoActual = this;
            while(entornoActual != null)
            {
                simbolo = entornoActual.tabla.get(id);
                // Falta implementar busqueda en profundidad.
                if (simbolo ==null  || simbolo == undefined)
                {
                    //console.log('Error, simbolo '+ id+' no encontrado en entorno actual.');
                    // Si no existe pasamos al entorno superior
                    entornoActual = entornoActual.padre;
                    continue;                    
                }
                return simbolo;
            }
            return null;            

        }

        this.getEntornoGlobal = function()
        {            
            var entornoActual = this;
            while(entornoActual.padre != null)
            {
                entornoActual = entornoActual.padre;
            }     
            return entornoActual;                   
        }

        this.registrarSimbolo = function(simbolo)
        {
            var simboloTmp = this.tabla[simbolo.id];
            if (simboloTmp !=null  && simboloTmp != undefined)
            {
                console.log('Error. Ya existe un simbolo con el nombre '+ id+' en el entorno actual.');
                return;
            }     
            simbolo.posicion = this.contador;
            this.contador++;
            this.tabla.set(simbolo.id,simbolo);
        }

        this.getTamanioEntorno = function()
        {
            return this.tabla.size+1;
        }

        this.getStringTamanioEntorno = function()
        {
            return (this.tabla.size+1).toString();
        }  
        
        if(guardar)
        {
            Utils.registrarEntorno(this);
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

        this.graficar = function()
        {

        }


        this.ejecutar = function(entorno)
        {
            // Primero hacemos lo de afuera y luego ejecutamos el main            
            this.bloqueInstrucciones.instrucciones.forEach(function (instruccion) 
            {
                instruccion.ejecutar(entorno);
            });


            // De último ejecutamos la función main
            var LLamadaMain = new Llamada(this.linea, this.columna, "main",new Array /**Lista de parametros */);
            LLamadaMain.getValor(entorno);

        }

        this.generar3D = function(entorno)
        {
            // Primero generamos lo del entorno global 
            // Y de ultimo generamos el codigo para la funcion main


            Utils.generarNativas();

            Utils.imprimirConsola('void INIT_global_variables(){\n');
            this.bloqueInstrucciones.instrucciones.forEach(function (instruccion) 
            {
                if (!(instruccion instanceof Funcion))
                {
                    instruccion.generar3D(entorno);                    
                }              
            }); 
            Utils.imprimirConsola('return;\n');
            Utils.imprimirConsola('}\n');
            Utils.imprimirConsola('\n\n\n');
            


            this.bloqueInstrucciones.instrucciones.forEach(function (instruccion) 
            {
                if (instruccion instanceof Funcion)
                {
                    if(instruccion.id != 'main')
                    {
                        instruccion.generar3D(entorno);
                    }                    
                }              
            });  
                
            
            this.bloqueInstrucciones.instrucciones.forEach(function (instruccion) 
            {
                if (instruccion instanceof Funcion)
                {
                    if(instruccion.id == 'main')
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


        /*Vamos a ver como obtener arreglo */
        var partes = this.valor.split('$');
        if(partes.length>1)
        {
            var raizExpresion = "";
            for(var index = 0; index < partes.length; index++)
            {
                var parte = partes[index];  
                if(index == 0)
                {
                    raizExpresion = new ExpString(this.linea, this.columna, parte);                    
                }
                else
                {                          
                    var partesSubCadena = parte.split(" ");
                    if(partesSubCadena.length>1)
                    {
                        var cadeExpresion = partesSubCadena[0];
                        var cadenaTemporal = "";
                        try 
                        {
                            var raiz = expresiones.parse(cadeExpresion);    
                            if(raiz != null)
                            {
                                raizExpresion = new Concatenar(this.linea, this.columna, raizExpresion, raiz);
                            }
                            for(var i = 1;i < partesSubCadena.length; i++)
                            {
                                cadenaTemporal = cadenaTemporal + " " + partesSubCadena[i];                                
                            }                            
                            raizExpresion = new Concatenar(this.linea, this.columna, raizExpresion, new ExpString(this.linea, this.columna,cadenaTemporal));
                        } catch (error) 
                        {

                        }                        
                    }
                    else
                    {
                        var cadeExpresion = partesSubCadena[0];
                        var cadenaTemporal = "";
                        try 
                        {
                            var raiz = expresiones.parse(cadeExpresion);    
                            if(raiz != null)
                            {
                                raizExpresion = new Concatenar(this.linea, this.columna, raizExpresion, raiz);
                            }
                            for(var i = 1;i < partesSubCadena.length; i++)
                            {
                                cadenaTemporal = cadenaTemporal + " " + partesSubCadena[i];                                
                            }                            
                            raizExpresion = new Concatenar(this.linea, this.columna, raizExpresion, new ExpString(this.linea, this.columna,cadenaTemporal));
                        } catch (error) 
                        {

                        }                          
                    }
                }            
            }  
            return raizExpresion;          
        }



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
            return this.valor.charCodeAt();
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
        
        this.getTipo= function(entorno)
        {
            // Implementar busqueda de tipo del símbolo si existe
            var varBuscada = entorno.getSimbolo(this.id);
            if(varBuscada!= null && varBuscada!= undefined)
            {
                return varBuscada.tipo;
            } 
            return new Tipo(TipoPrimitivo.ERROR);
        }

        this.getValor= function(entorno)
        {
            // Implementar busqueda de tipo del símbolo si existe
            if(!this.getTipo(entorno).esError())
            {
                var varBuscada = entorno.getSimbolo(this.id);
                if(varBuscada!= null && varBuscada!= undefined)
                {
                    return varBuscada.valor;
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Variable','No se ha encontrado la variable '+this.id +' en el entorno actual.');
                } 
            } 
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'Variable','No se ha encontrado la variable '+this.id +' en el entorno actual.');
            }                        
        } 
        
        this.generar3D = function(entorno)
        {
            if(!this.getTipo(entorno).esError())
            {
                var varBuscada = entorno.getSimbolo(this.id);
                if(varBuscada!= null && varBuscada!= undefined)
                {
                    //return varBuscada.valor;
                    var t0 = Utils.generarTemporal();
                    var t1 = Utils.generarTemporal();
                    var variableLocal = entorno.tabla.get(this.id);                    
                    if(variableLocal == null || variableLocal == undefined)
                    {
                        var t2 = Utils.generarTemporal();
                        Utils.imprimirConsola(t2+'=0;// Simulación cambio a entorno global\n');
                        Utils.imprimirConsola(t0+'='+t2+'+'+varBuscada.posicion.toString()+';//Direccion variable '+this.id+'\n');
                        Utils.imprimirConsola(t1+'=stack[(int)'+t0+'];\n');                           
                    }
                    else
                    {
                        Utils.imprimirConsola(t0+'=P+'+varBuscada.posicion.toString()+';//Direccion variable '+this.id+'\n');
                        Utils.imprimirConsola(t1+'=stack[(int)'+t0+'];\n');   
                    }                         
                    return t1;
                } 
            }            
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
        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);            
            var NodoStringTipo = new ExpString(this.linea, this.columna, tipoExpresion.getNombreTipo());
            var inicioCadena = NodoStringTipo.generar3D(entorno);
            return inicioCadena;
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

            var tipoI = this.expresionI.getTipo(entorno);
            var tipoD = this.expresionD.getTipo(entorno);

            var valorI = this.expresionI.getValor(entorno);
            var valorD = this.expresionD.getValor(entorno);
            
            if(tipoI.esChar()){ valorI = String.fromCharCode(valorI.charCodeAt()); }
            if(tipoD.esChar()){ valorD = String.fromCharCode(valorD.charCodeAt()); }
            return String(valorI)  + String(valorD) + "";
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
                    if(Utils.tenemosEtiquetas(valorD))
                    {
                        var t100 = Utils.generarTemporal();
                        var LS = Utils.generarEtiqueta();
                        Utils.imprimirConsola(valorD.LV+':\n');
                        Utils.imprimirConsola(t100+'=1;\n');
                        Utils.imprimirConsola('goto '+LS+';\n');
                        Utils.imprimirConsola(valorD.LF+':\n');
                        Utils.imprimirConsola(t100+'=0;\n');
                        Utils.imprimirConsola(LS+':\n');
                        var t0 =Utils.generarTemporal();       
                        var t1 =Utils.generarTemporal();
                        var t2 =Utils.generarTemporal();
                        var t3 =Utils.generarTemporal();
                        var t4 =Utils.generarTemporal();       
                        var t5 =Utils.generarTemporal();
                        var t6 =Utils.generarTemporal();                    
                        
                        Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                        Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                        Utils.imprimirConsola('stack[(int)'+t1+']='+t100+'; // Paso valor parametro 1\n');                    
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
                    else
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

                    if(Utils.tenemosEtiquetas(valorI))
                    {
                        var t100 = Utils.generarTemporal();
                        var LS = Utils.generarEtiqueta();
                        Utils.imprimirConsola(valorI.LV+':\n');
                        Utils.imprimirConsola(t100+'=1;\n');
                        Utils.imprimirConsola('goto '+LS+';\n');
                        Utils.imprimirConsola(valorI.LF+':\n');
                        Utils.imprimirConsola(t100+'=0;\n');
                        Utils.imprimirConsola(LS+':\n');

                        var t0 =Utils.generarTemporal();       
                        var t1 =Utils.generarTemporal();
                        var t2 =Utils.generarTemporal();                   
                        
                        Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                        Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                        Utils.imprimirConsola('stack[(int)'+t1+']='+t100+'; // Paso valor parametro 1\n');                    
                        Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                        Utils.imprimirConsola('BooleanToString_Nativa();\n');
                        Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                        Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                        valorI = t2;
                    }                    
                    else
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
            if(this.expresionI.getTipo(entorno).esIgual(this.expresionD.getTipo(entorno)))
            {
                return this.expresionI.getTipo(entorno);
            }
            Utils.registrarErrorSemantico(this.linea, this.columna, '?','Error expresión ternaria. Tipos diferentes' + tipoCondicion.getNombreTipo());
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
                var L1 = Utils.generarEtiqueta();
                var L2 = Utils.generarEtiqueta();
                //Generar etiquetas
                Utils.imprimirConsola('if('+valorCondicion+'==1) goto '+L1+'; // Ternario\n');
                Utils.imprimirConsola('goto '+L2+';\n');

                var t0 = Utils.generarTemporal();                
                var LSalida = Utils.generarTemporal();
                // Hay que ver qué hacemos cuando el retorno es un boolean
                Utils.imprimirConsola(L1+':\n');
                var valorI = this.expresionI.generar3D(entorno);
                Utils.imprimirConsola(t0+'='+valorI+';\n');
                Utils.imprimirConsola('goto '+LSalida+';\n');                
                Utils.imprimirConsola(L2+':\n');
                var valorD = this.expresionD.generar3D(entorno);
                Utils.imprimirConsola(t0+'='+valorD+';\n');
                Utils.imprimirConsola(LSalida+':\n');
                return t0;                

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
                return parseFloat(valorI) % parseFloat(valorD);
                // Hay que verificar si el dividendo es diferente a 0
            }
            if(tipo.esEntero())
            {
                return parseInt(valorI) % parseInt(valorD);
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
                return Math.pow(parseFloat(valorI), parseFloat(valorD));
                // Hay que verificar si el dividendo es diferente a 0
            }
            if(tipo.esEntero())
            {
                return Math.pow(parseInt(valorI), parseInt(valorD));
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
           
            if(tipo.esEntero() || tipo.esDouble())
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
                Utils.registrarErrorSemantico(this.linea, this.columna, 'sqrt','Error de tipos en raiz cuadrada. '+ this.expresion.getTipo(entorno).getNombreTipo());
                return;
            }

            var valor = this.expresion.getValor(entorno);

            if (valor != null || valor != undefined || !isNaN(valor)){
                return Math.sqrt(valor);
            }else{
                return 0;
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

            if(tipo.esEntero() || tipo.esDouble())
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
                Utils.registrarErrorSemantico(this.linea, this.columna, 'seno','Error de tipos en seno. '+ this.expresion.getTipo(entorno).getNombreTipo());
                return;
            }

            var valor = this.expresion.getValor(entorno);

            if (valor != null || valor != undefined || !isNaN(valor)){
                return Math.sin(valor);
            }else{
                return 0;
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

            if(tipo.esEntero() || tipo.esDouble())
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
                Utils.registrarErrorSemantico(this.linea, this.columna, 'cos','Error de tipos en coseno. '+ this.expresion.getTipo(entorno).getNombreTipo());
                return;
            }

            var valor = this.expresion.getValor(entorno);

            if (valor != null || valor != undefined || !isNaN(valor)){
                return Math.cos(valor);
            }else{
                return 0;
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

            if(tipo.esEntero() || tipo.esDouble())
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
                Utils.registrarErrorSemantico(this.linea, this.columna, 'tang','Error de tipos en tangente. '+ this.expresion.getTipo(entorno).getNombreTipo());
                return;
            }

            var valor = this.expresion.getValor(entorno);

            if (valor != null || valor != undefined || !isNaN(valor)){
                return Math.tan(valor);
            }else{
                return 0;
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

        this.getTipo = function(entorno)
        {
            var idBuscado = this.id ; 
            //
            this.parametros.forEach(parametro => {
                var tipoParametro = parametro.getTipo(entorno);
                idBuscado += '_' + tipoParametro.getNombreTipo();
            });

            var funcionBuscada = entorno.getSimbolo(idBuscado);
            if(funcionBuscada != null || funcionBuscada!= undefined)
            {
                return funcionBuscada.tipo;
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'Función ' + this.id,'No se ha encontrado la definición de la función '+ idBuscado);
                return;                
            }
        }

        this.getValor = function(entorno)
        {
            var idBuscado = this.id ; 
            //
            this.parametros.forEach(parametro => {
                var tipoParametro = parametro.getTipo(entorno);
                idBuscado += '_' + tipoParametro.getNombreTipo();
            });

            var funcionBuscada = entorno.getSimbolo(idBuscado);
            if(funcionBuscada != null || funcionBuscada!= undefined)
            {
                var nuevoEntorno = entorno;
                if(funcionBuscada!='main')
                {
                    nuevoEntorno = new Entorno(entorno.getEntornoGlobal());
                }                
                
                /* Ahora tenemos que crear los parametros en este nuevo entorno */
                /* Aquí los parametros actuales son una lista de Expresiones */
                var indiceArreglo = 0;
                for( indiceArreglo =0 ; indiceArreglo < this.parametros.length ; indiceArreglo++)
                {
                    var parametro = funcionBuscada.listaParametrosFormales[indiceArreglo];
                    var expresionActual = this.parametros[indiceArreglo];
                    //parametro.ejecutar(nuevoEntorno);
                    
                    var simboloTmp = nuevoEntorno.getSimbolo(parametro.id);
                    if(simboloTmp == null || simboloTmp == undefined)
                    {
                        var valorInicial = expresionActual.getValor(entorno);
                        var nuevoVariable = new Simbolo(parametro.linea, parametro.columna,parametro.id, parametro.tipo, valorInicial);
                        nuevoEntorno.registrarSimbolo(nuevoVariable);                        
                    }
                    else
                    {
                        Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración','Ya se ha declarado una variable llamada '+id +'.');
                    }                                        
                }              
                var posibleRetorno = funcionBuscada.bloqueInstrucciones.ejecutar(nuevoEntorno);
                if(posibleRetorno!= null)
                {
                    if(posibleRetorno instanceof Retorno)
                    {
                        if(posibleRetorno.expresion==null)
                        {
                            return;
                        }
                        else
                        {
                            var valorRetorno = posibleRetorno.expresion.getValor(nuevoEntorno);
                            return valorRetorno;                            
                        }
                    }
                }
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'Función ' + this.id,'No se ha encontrado la definición de la función '+ idBuscado);
                return;                
            }
        }   
        
        this.generar3D = function(entorno)
        {
            var idBuscado = this.id ; 
            //
            this.parametros.forEach(parametro => {
                var tipoParametro = parametro.getTipo(entorno);
                idBuscado += '_' + tipoParametro.getNombreTipo();
            });

            var funcionBuscada = entorno.getSimbolo(idBuscado);
            if(funcionBuscada != null || funcionBuscada!= undefined)
            {
                var nuevoEntorno = funcionBuscada.entorno;
                var indiceArreglo = 0;
                var t0 = Utils.generarTemporal();
                Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulacion de cambio de entorno\n');
                for( indiceArreglo =0 ; indiceArreglo < this.parametros.length ; indiceArreglo++)
                {
                    var parametro = funcionBuscada.listaParametrosFormales[indiceArreglo];
                    var simboloParametro = nuevoEntorno.getSimbolo(parametro.id);
                    var expresionActual = this.parametros[indiceArreglo];
                    var valorInicial= expresionActual.generar3D(entorno);
                    //parametro.ejecutar(nuevoEntorno);
                    
                    var simboloTmp = nuevoEntorno.getSimbolo(parametro.id);
                    if(simboloTmp != null || simboloTmp != undefined)
                    {                                                
                        // Pasar valor en tresdirecciones
                        var t1 = Utils.generarTemporal();
                        Utils.imprimirConsola(t1+'='+t0+'+'+simboloParametro.getPosicion()+'; //Posicion parametros '+parametro.id+'\n');
                        Utils.imprimirConsola('stack[(int)'+t1+']='+valorInicial+';\n');                        
                    }
                    else
                    {
                        Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración','No se ha encontrado la variable '+id +'.');
                    }                                        
                } 
                Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';//Cambio de entorno\n');
                Utils.imprimirConsola(idBuscado+'();\n');
                Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';//Retomar de entorno\n');
                var t2 = Utils.generarTemporal();
                Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];//Valor de retorno\n');
                return t2;
                //funcionBuscada.bloqueInstrucciones.generar3D(nuevoEntorno);
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'Función ' + this.id,'No se ha encontrado la definición de la función '+ idBuscado);
                return;                
            }
        }         
    }
}


class PosicionCadena
{
    constructor(linea, columna, expresion, expresionPosicion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
        this.expresionPosicion = expresionPosicion;

        this.getTipo = function(entorno)
        {
            return new Tipo(TipoPrimitivo.CHAR);
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var cadena = this.expresion.getValor(entorno);
                var tipoExpresionPosicion = this.expresionPosicion.getTipo(entorno);
                if(tipoExpresionPosicion.esNumerico())
                {
                    var posicion = parseInt(this.expresionPosicion.getValor(entorno));
                    return cadena.charAt(posicion);
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'caracterOfPosition ', 'Se esperaba un valor de tipo númerico para la posición y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                    return;                    
                }
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'caracterOfPosition ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var inicioCadena = this.expresion.generar3D(entorno);
                var tipoExpresionPosicion = this.expresionPosicion.getTipo(entorno);
                if(tipoExpresionPosicion.esNumerico())
                {                                        
                    var posicion = this.expresionPosicion.generar3D(entorno);
                    var t0 = Utils.generarTemporal();
                    var t1 = Utils.generarTemporal();
                    Utils.imprimirConsola(t0+'='+inicioCadena+'+'+posicion+';\n');
                    Utils.imprimirConsola(t1+'=heap[(int)'+t0+'];\n');
                    return t1;
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'caracterOfPosition ', 'Se esperaba un valor de tipo númerico para la posición y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                    return;                    
                }
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'caracterOfPosition ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }
    }
}

class PorcionCadena
{
    constructor(linea, columna, expresion, expresionPosicion, expresionPosicion2)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
        this.expresionPosicion = expresionPosicion;
        this.expresionPosicion2 = expresionPosicion2;

        this.getTipo = function(entorno)
        {
            return new Tipo(TipoPrimitivo.STRING);
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var cadena = this.expresion.getValor(entorno);
                var tipoExpresionPosicion = this.expresionPosicion.getTipo(entorno);
                var tipoExpresionPosicion2 = this.expresionPosicion2.getTipo(entorno);

                if(tipoExpresionPosicion.esNumerico() && tipoExpresionPosicion2.esNumerico())
                {
                    var posicion = parseInt(this.expresionPosicion.getValor(entorno));
                    var posicion2 = parseInt(this.expresionPosicion2.getValor(entorno));

                    return cadena.substring(posicion, posicion2+1);
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'subString ', 'Se esperaba un valor de tipo númerico para la posición y se ha recibido uno de tipo '+tipoExpresionPosicion.getNombreTipo()+','+tipoExpresionPosicion2.getNombreTipo());
                    return;
                }
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'subString ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var cadena = this.expresion.generar3D(entorno);
                var tipoExpresionPosicion = this.expresionPosicion.getTipo(entorno);
                var tipoExpresionPosicion2 = this.expresionPosicion2.getTipo(entorno);

                if(tipoExpresionPosicion.esNumerico() && tipoExpresionPosicion2.esNumerico())
                {
                    var posicion = this.expresionPosicion.generar3D(entorno);
                    var posicion2 = this.expresionPosicion2.generar3D(entorno);
                    var t2 = Utils.generarTemporal();
                    var t3 = Utils.generarTemporal();
                    var t0 = Utils.generarTemporal();
                    var t1 = Utils.generarTemporal();


                    var L0 = Utils.generarEtiqueta();
                    var L1 = Utils.generarEtiqueta();
                    var L2 = Utils.generarEtiqueta();
                    
                    Utils.imprimirConsola(t2+'='+posicion+';\n');
                    Utils.imprimirConsola(t3+'='+posicion2+';\n');
                    Utils.imprimirConsola(t0+'=H; // Inicio nueva subcadena\n');
                    Utils.imprimirConsola(L0+'://Verificar posicion\n');
                    Utils.imprimirConsola('if('+t2+'<='+t3+') goto '+L1+';\n');
                    Utils.imprimirConsola('goto '+L2+';//Salida\n');
                    Utils.imprimirConsola(L1+'://Iteracion para recolección\n');
                    Utils.imprimirConsola(t1+'=heap[(int)'+t2+'];// Caracter actual\n');
                    Utils.imprimirConsola('heap[(int)H]='+t1+'; //Pasando caracter\n');
                    Utils.imprimirConsola('H=H+1; // Reservando espacio\n');
                    Utils.imprimirConsola(t2+'='+t2+'+1;//Siguiente caracter\n');
                    Utils.imprimirConsola('goto '+L0+';\n');
                    Utils.imprimirConsola(L2+'://Fin iteracion. Agregamos fin cadena\n');
                    Utils.imprimirConsola('heap[(int)H]='+Utils.obtenerFinCadena()+'; //Fin cadena\n');
                    Utils.imprimirConsola('H=H+1; // Reservando espacio\n');
                    Utils.imprimirConsola('\n');
                    return t0;                    
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'subString ', 'Se esperaba un valor de tipo númerico para la posición y se ha recibido uno de tipo '+tipoExpresionPosicion.getNombreTipo()+','+tipoExpresionPosicion2.getNombreTipo());
                    return;
                }
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'subString ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }    
        }
    }
}

class LengthCadena
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            return new Tipo(TipoPrimitivo.INT);
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var cadena = this.expresion.getValor(entorno);
                return cadena.length;
            }            
            else
            {
                var valor = this.expresion.getValor(entorno);
                if(valor instanceof Array)
                {
                    return valor.length;
                }
                else if (valor instanceof Simbolo)
                {
                    if(valor.valor instanceof Array)
                    {
                        return valor.valor.length;
                    }
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'length ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                    return;
                }
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var inicioCadena = this.expresion.generar3D(entorno);
                var punteroCaracter = inicioCadena;
                var t0 = Utils.generarTemporal();
                var t1 = Utils.generarTemporal();
                var L0 = Utils.generarEtiqueta();
                var L1 = Utils.generarEtiqueta();
                var L2 = Utils.generarEtiqueta();
                Utils.imprimirConsola(t0+'=0; //Iniciando contador de caracteres\n');                
                Utils.imprimirConsola(L0+'://Verificacion\n');
                Utils.imprimirConsola(t1+'=heap[(int)'+punteroCaracter+']; //Iniciando contador de caracteres\n');
                Utils.imprimirConsola('if('+t1+'!='+Utils.obtenerFinCadena()+') goto '+L1+';\n');
                Utils.imprimirConsola('goto '+L2+';\n');
                Utils.imprimirConsola(L1+'://Actualizar contador\n');
                Utils.imprimirConsola(punteroCaracter+'='+punteroCaracter+'+1; //Siguiente caracter\n');
                Utils.imprimirConsola(t0+'='+t0+'+1; //Actualizar contador\n');
                Utils.imprimirConsola('goto '+L0+';\n');
                Utils.imprimirConsola(L2+'://Fin conteo\n');                
                return t0;
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'length ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }
    }
}

class UpperCadena
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
            if(tipoExpresion.esCadena())
            {
                var cadena = this.expresion.getValor(entorno);
                return cadena.toUpperCase();
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'length ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var cadena = this.expresion.generar3D(entorno);
                var t0=Utils.generarTemporal()
                var t1=Utils.generarTemporal()
                var t2=Utils.generarTemporal()
                var t3=Utils.generarTemporal()        
                Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulación de cambio de entorno\n');
                Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                Utils.imprimirConsola('stack[(int)'+t1+']='+cadena+';//Paso de parametro 1\n');
                Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';// Cambio de entorno\n');
                Utils.imprimirConsola('uppercase_Nativa();\n');
                Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';// Retomar entorno\n');
                Utils.imprimirConsola(t2+'='+t0+'+0;// Direccion retorno\n');
                Utils.imprimirConsola(t3+'=stack[(int)'+t2+'];// Valor de retorno\n');
                return t3;                               
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'length ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }
    }
}

class LowerCadena
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
            if(tipoExpresion.esCadena())
            {
                var cadena = this.expresion.getValor(entorno);
                return cadena.toLowerCase();
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'length ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var cadena = this.expresion.generar3D(entorno);
                var t0=Utils.generarTemporal()
                var t1=Utils.generarTemporal()
                var t2=Utils.generarTemporal()
                var t3=Utils.generarTemporal()        
                Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulación de cambio de entorno\n');
                Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                Utils.imprimirConsola('stack[(int)'+t1+']='+cadena+';//Paso de parametro 1\n');
                Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';// Cambio de entorno\n');
                Utils.imprimirConsola('lowercase_Nativa();\n');
                Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';// Retomar entorno\n');
                Utils.imprimirConsola(t2+'='+t0+'+0;// Direccion retorno\n');
                Utils.imprimirConsola(t3+'=stack[(int)'+t2+'];// Valor de retorno\n');
                return t3;
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'length ', 'Se esperaba un valor de tipo String y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }
    }
}

class NativaToInt
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            return new Tipo(TipoPrimitivo.INT);
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esNumerico())
            {
                var valor = this.expresion.getValor(entorno);
                if (valor != null || valor != undefined || !isNaN(valor)){
                    return parseInt(valor);
                }else{
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'toInt ', 'Se esperaba un valor de tipo flotante y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esNumerico())
            {
                var valor = this.expresion.generar3D(entorno);
                if (valor != null || valor != undefined || !isNaN(valor))
                {
                    var t0 = Utils.generarTemporal();
                    Utils.imprimirConsola(t0+'=(int)'+valor+';// Casteo a entero\n');
                    return t0;
                }
                else
                {
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'toInt ', 'Se esperaba un valor de tipo flotante y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }
    }
}

class NativaToString
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
            if(tipoExpresion != null || tipoExpresion != undefined)
            {
                var valor = this.expresion.getValor(entorno);
                if (valor != null || valor != undefined || !isNaN(valor)){
                    //return "\""+String(valor)+"\"";
                    return String(valor);
                }else{
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'toString ', 'Se esperaba un valor diferente a null o undefined');
                return;
            }
        }

        this.generar3D = function(entorno)
        {
            //Cast to string 

            var tipoI = this.expresion.getTipo(entorno);
            var valorI = this.expresion.generar3D(entorno);             
            if (tipoI.esNulo())
            {
                /*var NodoStringNulo = new ExpString(0,0,"null");                    
                valorI = NodoStringNulo.generar3D(null);
                return valorI;                  
                */
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
                return valorI;
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
                return valorI;
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
                return valorI;                   
            }
            else if (tipoI.esBoolean())
            {
                if(Utils.tenemosEtiquetas(valorI))
                {
                    var t100 = Utils.generarTemporal();
                    var LS = Utils.generarEtiqueta();
                    Utils.imprimirConsola(valorI.LV+':\n');
                    Utils.imprimirConsola(t100+'=1;\n');
                    Utils.imprimirConsola('goto '+LS+';\n');
                    Utils.imprimirConsola(valorI.LF+':\n');
                    Utils.imprimirConsola(t100+'=0;\n');
                    Utils.imprimirConsola(LS+':\n');
                    var t0 =Utils.generarTemporal();       
                    var t1 =Utils.generarTemporal();
                    var t2 =Utils.generarTemporal();                   
                    
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';// Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+t100+'; // Paso valor parametro 1\n');                    
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola('BooleanToString_Nativa();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';\n');
                    Utils.imprimirConsola(t2+'=stack[(int)'+t0+'];// Obtener valor de retorno.\n');                    
                    valorI = t2;
                    return valorI;

                }
                else
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
                    return valorI;
                }

            }     
            // Falta arreglos e instancias        
        }
    }
}

class NativaToDouble
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            return new Tipo(TipoPrimitivo.DOUBLE);
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esEntero())
            {
                var valor = this.expresion.getValor(entorno);
                if (valor != null || valor != undefined || !isNaN(valor)){
                    return valor.toFixed(2)
                }else{
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'toDouble ', 'Se esperaba un valor de tipo entero y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esNumerico())
            {
                var valor = this.expresion.generar3D(entorno);
                if (valor != null || valor != undefined || !isNaN(valor))
                {
                    var t0 = Utils.generarTemporal();
                    Utils.imprimirConsola(t0+'=(float)'+valor+';// Casteo a entero\n');
                    return t0;                    
                }
                else
                {
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'toDouble ', 'Se esperaba un valor de tipo entero y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }
    }
}

class ParseInt
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            return new Tipo(TipoPrimitivo.INT);
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var valor = this.expresion.getValor(entorno);
                if (valor != null || valor != undefined || !isNaN(valor)){
                    return parseInt(valor);
                }else{
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'int.parse ', 'Se esperaba un valor de tipo cadena y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var valor = this.expresion.generar3D(entorno);
                if (valor != null || valor != undefined || !isNaN(valor))
                {
                    var cadena = valor;
                    var t0=Utils.generarTemporal()
                    var t1=Utils.generarTemporal()
                    var t2=Utils.generarTemporal()
                    var t3=Utils.generarTemporal()        
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+cadena+';//Paso de parametro 1\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';// Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_StringtoInt();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';// Retomar entorno\n');
                    Utils.imprimirConsola(t2+'='+t0+'+0;// Direccion retorno\n');
                    Utils.imprimirConsola(t3+'=stack[(int)'+t2+'];// Valor de retorno\n');
                    return t3;
                }else{
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'int.parse ', 'Se esperaba un valor de tipo cadena y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }
    }
}

class ParseDouble
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            return new Tipo(TipoPrimitivo.DOUBLE);
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var valor = this.expresion.getValor(entorno);
                if (valor != null || valor != undefined || !isNaN(valor)){
                    return Number.parseFloat(valor);
                }else{
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'double.parse ', 'Se esperaba un valor de tipo cadena y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var valor = this.expresion.generar3D(entorno);
                if (valor != null || valor != undefined || !isNaN(valor))
                {
                    var cadena = valor;
                    var t0=Utils.generarTemporal()
                    var t1=Utils.generarTemporal()
                    var t2=Utils.generarTemporal()
                    var t3=Utils.generarTemporal()        
                    Utils.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulación de cambio de entorno\n');
                    Utils.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
                    Utils.imprimirConsola('stack[(int)'+t1+']='+cadena+';//Paso de parametro 1\n');
                    Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+';// Cambio de entorno\n');
                    Utils.imprimirConsola('Nativa_StringtoDouble();\n');
                    Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+';// Retomar entorno\n');
                    Utils.imprimirConsola(t2+'='+t0+'+0;// Direccion retorno\n');
                    Utils.imprimirConsola(t3+'=stack[(int)'+t2+'];// Valor de retorno\n');
                    return t3;                                        
                }else{
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'double.parse ', 'Se esperaba un valor de tipo cadena y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }
    }
}

class ParseBool
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            return new Tipo(TipoPrimitivo.BOOL);
        }

        this.generar3D = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var valor = this.expresion.getValor(entorno);
                if (valor != null || valor != undefined || !isNaN(valor))
                {
                    var cadenaTrue = new ExpString(this.linea, this.columna, "1");                    

                    this.LV = Utils.generarEtiqueta();
                    this.LF = Utils.generarEtiqueta();
                    var valorI = cadenaTrue.generar3D(entorno);
                    var valorD = this.expresion.generar3D(entorno);
                    
    
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

                }else{
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'boolean.parse ', 'Se esperaba un valor de tipo cadena y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esCadena())
            {
                var valor = this.expresion.getValor(entorno);
                if (valor != null || valor != undefined || !isNaN(valor))
                {

                    if(valor == 1){
                        return true;
                    }else{
                        return false;
                    }

                }else
                {
                    return 0;
                }

            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'boolean.parse ', 'Se esperaba un valor de tipo cadena y se ha recibido uno de tipo '+tipoExpresion.getNombreTipo());
                return;
            }
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

            //return parseFloat(valorI) === parseFloat(valorD);
            return valorI == valorD;
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

                if(Utils.tenemosEtiquetas(valorI))
                {
                    var t100 = Utils.generarTemporal();
                    var LS = Utils.generarEtiqueta();
                    Utils.imprimirConsola(valorI.LV+':\n');
                    Utils.imprimirConsola(t100+'=1;\n');
                    Utils.imprimirConsola('goto '+LS+';\n');
                    Utils.imprimirConsola(valorI.LF+':\n');
                    Utils.imprimirConsola(t100+'=0;\n');
                    Utils.imprimirConsola(LS+':\n');  
                    valorI = t100;                  
                }
                if(Utils.tenemosEtiquetas(valorD))
                {
                    var t100 = Utils.generarTemporal();
                    var LS = Utils.generarEtiqueta();
                    Utils.imprimirConsola(valorD.LV+':\n');
                    Utils.imprimirConsola(t100+'=1;\n');
                    Utils.imprimirConsola('goto '+LS+';\n');
                    Utils.imprimirConsola(valorD.LF+':\n');
                    Utils.imprimirConsola(t100+'=0;\n');
                    Utils.imprimirConsola(LS+':\n');
                    valorD = t100;
                }                 
                
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
            return  valorI != valorD;
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
                if(Utils.tenemosEtiquetas(valorI))
                {
                    var t100 = Utils.generarTemporal();
                    var LS = Utils.generarEtiqueta();
                    Utils.imprimirConsola(valorI.LV+':\n');
                    Utils.imprimirConsola(t100+'=1;\n');
                    Utils.imprimirConsola('goto '+LS+';\n');
                    Utils.imprimirConsola(valorI.LF+':\n');
                    Utils.imprimirConsola(t100+'=0;\n');
                    Utils.imprimirConsola(LS+':\n');  
                    valorI = t100;                  
                }
                if(Utils.tenemosEtiquetas(valorD))
                {
                    var t100 = Utils.generarTemporal();
                    var LS = Utils.generarEtiqueta();
                    Utils.imprimirConsola(valorD.LV+':\n');
                    Utils.imprimirConsola(t100+'=1;\n');
                    Utils.imprimirConsola('goto '+LS+';\n');
                    Utils.imprimirConsola(valorD.LF+':\n');
                    Utils.imprimirConsola(t100+'=0;\n');
                    Utils.imprimirConsola(LS+':\n');
                    valorD = t100;
                }
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

            //return parseFloat(valorI) > parseFloat(valorD);
            return valorI > valorD;
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

            //return parseFloat(valorI) < parseFloat(valorD);
            return valorI < valorD;
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

            //return parseFloat(valorI) >= parseFloat(valorD);
            return valorI >= valorD;
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

            //return parseFloat(valorI) <= parseFloat(valorD);
            return valorI <= valorD;
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



class AccesoArreglo
{
    constructor(linea, columna, expresion, listaIndices )
    {
        this.linea=linea;
        this.columna=columna;
        this.expresion = expresion;
        this.listaIndices=listaIndices;

        this.getTipo = function(entorno)
        {
            return this.expresion.getTipo(entorno);
        }

        this.getValor = function(entorno)
        {
            if(this.listaIndices instanceof Array)
            // Esto significa que está de la forma id [x][y][z]
            {
                //var tipoExpresion = this.expresion.getTipo(entorno);
                var valorExpresion = this.expresion.getValor(entorno);
                if(valorExpresion instanceof Array)
                {
                    // a[0][2][3];
                    var indiceExpresion = 0;
                    for(indiceExpresion =0 ; indiceExpresion < this.listaIndices.length; indiceExpresion++)
                    {
                        var expresionActual = this.listaIndices[indiceExpresion];
                        var tipoIndice = expresionActual.getTipo(entorno);
                        if(tipoIndice.esNumerico())
                        {
                            var valorIndice = expresionActual.getValor(entorno);
                            if(valorIndice>=0)
                            {
                                if(valorIndice<=(valorExpresion.length-1))
                                {
                                                                        
                                    return  valorExpresion[valorIndice].valor;
                                }
                                else
                                {
                                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso vector','Indice mayor al tamaño del arreglo.');
                                    return;                                 
                                }
                            }
                            else
                            {
                                Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso vector','No es posible usar indices negativos.');
                                return;                            
                            }
                        }   
                        else
                        {
                            Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso vector','Se esperaba una expresion númerica.');
                            return;
                        }
                    }
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso vector','La expresion no corresponde a un arreglo');
                    return;
                }
            }
            else
            // Significa que buscamos un framgento
            {
                var limites = this.listaIndices.getValor(entorno);                              
                var index = limites.limiteInferior; 
                var valorExpresion = this.expresion.getValor(entorno);
                limites.limiteSuperior = limites.limiteSuperior == -1 ? valorExpresion.length-1:limites.limiteSuperior;               
                if(limites.limiteInferior<0)
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','El limite inferior tiene que ser mayor a 0.');
                    index = 0;
                }                                               
                if(limites.limiteSuperior>valorExpresion.length)
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','Limite superior excedido. Máximo ' + this.expresion.length +'. Recibido '+limites.limiteSuperior);
                    superior = this.expresion.length-1;
                }                        
                var superior = limites.limiteSuperior ==-1 ?  this.expresion.length-1 : limites.limiteSuperior;
                var subArreglo = new Array;
                var valorExpresion = this.expresion.getValor(entorno);
                for(index = index; index <= superior ; index++)
                {
                    subArreglo.push(valorExpresion[index]);
                }                
                //console.log(subArreglo);
                return subArreglo;
            }
        }        
        


        this.generar3D = function(entorno)
        {
            if(this.listaIndices instanceof Array)
            // Esto significa que está de la forma id [x][y][z]
            {
                //var tipoExpresion = this.expresion.getTipo(entorno);
                //var valorExpresion = this.expresion.getValor(entorno);
                if(this.expresion instanceof ExpVariable)
                {
                    var id = this.expresion.id;
                    var simboloBuscado = entorno.getSimbolo(id);
                    if(simboloBuscado.rol == 'ARREGLO')
                    {
                        var simboloLocal = entorno.tabla.get(id);
                        var Pinicial = 'P';
                        if(simboloLocal == null)
                        {
                            // Esto significa que la vriable no es local.
                            Pinicial = '0';                            
                        }

                        var t0 = Utils.generarTemporal();
                        //Utils.imprimirConsola(t0+'=P+'+simboloBuscado.posicion+'; // Dirección arreglo '+id+'\n');
                        Utils.imprimirConsola(t0+'='+Pinicial+'+'+simboloBuscado.posicion+'; // Dirección arreglo '+id+'\n');
                        Utils.imprimirConsola(t0+'=stack[(int)'+t0+'];// Direccion inicio arreglo en heap\n');
                        var indiceExpresion = 0;
                        for(indiceExpresion =0 ; indiceExpresion < this.listaIndices.length; indiceExpresion++)
                        {
                            var expresionActual = this.listaIndices[indiceExpresion];
                            var tipoIndice = expresionActual.getTipo(entorno);
                            if(tipoIndice.esNumerico())
                            {
                                var t1 = Utils.generarTemporal();
                                var t2 = Utils.generarTemporal();                                
                                var L0 = Utils.generarEtiqueta();
                                var L1 = Utils.generarEtiqueta();
                                var L2 = Utils.generarEtiqueta();
                                var L3 = Utils.generarEtiqueta();
                                var L4 = Utils.generarEtiqueta();
                                var valorIndice = expresionActual.generar3D(entorno);
                                Utils.imprimirConsola('if('+valorIndice+'>=0) goto '+L0+'; // Verificamos si el indice no es un negativo\n');
                                Utils.imprimirConsola('goto '+L2+';\n');
                                Utils.imprimirConsola(L0+':\n');
                                Utils.imprimirConsola('if('+valorIndice+'<'+simboloBuscado.arregloTamanio+') goto '+L1+'; // Verificamos que el indice no salga\n');
                                Utils.imprimirConsola('goto '+L4+';\n');
                                Utils.imprimirConsola(L1+':\n');
                                Utils.imprimirConsola(t1+'='+t0+'+'+valorIndice+';\n');
                                Utils.imprimirConsola(t2+'=heap[(int)'+t1+'];\n');                                
                                Utils.imprimirConsola('goto '+L3+'; // Salida\n');
                                Utils.imprimirConsola(L2+':\n');
                                var NodoMensaje = new ExpString(this.linea, this.columna, "No se aceptan indices negativos");
                                var inicioCadena = NodoMensaje.generar3D(entorno);
                                Utils.imprimirConsola(t2+'='+Utils.obtenerFinCadena()+';\n');
                                Utils.imprimirConsola('goto '+L3+'; // Salida\n');                                
                                Utils.imprimirConsola(L4+':\n');
                                var NodoMensaje = new ExpString(this.linea, this.columna, "Indice fuera del arreglo . Linea "+this.linea );
                                var inicioCadena = NodoMensaje.generar3D(entorno);                                
                                Utils.generarCodigoParaImprimirLn(inicioCadena,entorno);                                
                                Utils.imprimirConsola(t2+'='+Utils.obtenerFinCadena()+';\n');
                                Utils.imprimirConsola(L3+':\n');
                                return t2;
                            }   
                            else
                            {
                                Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso vector','Se esperaba una expresion númerica.');
                                return;
                            }
                        }

                    }
                    else
                    {
                        Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso vector','La variable '+id +' no es un arreglo.');
                        return;    
                    }
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso vector','La expresion no corresponde a un arreglo');
                    return;
                }
            }
            else
            // Significa que buscamos un framgento
            {
                var limites = this.listaIndices.getValor(entorno);                              
                var index = limites.limiteInferior; 
                var valorExpresion = this.expresion.getValor(entorno);
                limites.limiteSuperior = limites.limiteSuperior == -1 ? valorExpresion.length-1:limites.limiteSuperior;               
                if(limites.limiteInferior<0)
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','El limite inferior tiene que ser mayor a 0.');
                    index = 0;
                }                                               
                if(limites.limiteSuperior>valorExpresion.length)
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','Limite superior excedido. Máximo ' + this.expresion.length +'. Recibido '+limites.limiteSuperior);
                    superior = this.expresion.length-1;
                }                        
                var superior = limites.limiteSuperior ==-1 ?  this.expresion.length-1 : limites.limiteSuperior;
                var subArreglo = new Array;
                var valorExpresion = this.expresion.getValor(entorno);
                for(index = index; index <= superior ; index++)
                {
                    subArreglo.push(valorExpresion[index]);
                }                
                //console.log(subArreglo);
                return subArreglo;
            }
        }        
    }
}


class Aumento
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esEntero())
            {
                return tipoExpresion;
            }
            else
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.getTipo(entorno);
            if(!tipoExpresion.esError())
            {
                if(expresion instanceof ExpVariable)
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    var variableBuscada = entorno.getSimbolo(expresion.id);
                    variableBuscada.valor++;
                    return variableBuscada.valor;
                }
                else
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    return valorExpresion + 1;                    
                }

            }
            else
            {
                var tipo = this.expresion.getTipo(entorno);
                Utils.registrarErrorSemantico(this.linea, this.columna, '++','Se esperaba un tipo entero.'+ tipo.getNombreTipo());
                return 0; 
            }

        }

        this.ejecutar = function(entorno)
        {
            var tipoExpresion = this.getTipo(entorno);
            if(!tipoExpresion.esError())
            {
                if(expresion instanceof ExpVariable)
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    var variableBuscada = entorno.getSimbolo(expresion.id);
                    variableBuscada.valor++;
                    return variableBuscada.valor;
                }
                else
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    return valorExpresion + 1;
                }

            }
            else
            {
                var tipo = this.expresion.getTipo(entorno);
                Utils.registrarErrorSemantico(this.linea, this.columna, '++','Se esperaba un tipo entero.'+ tipo.getNombreTipo());
                return 0;
            }

        }
    }
}



class Decremento
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            var tipoExpresion = this.expresion.getTipo(entorno);
            if(tipoExpresion.esEntero())
            {
                return tipoExpresion;
            }
            else
            {
                return new Tipo(TipoPrimitivo.ERROR);
            }
        }

        this.getValor = function(entorno)
        {
            var tipoExpresion = this.getTipo(entorno);
            if(!tipoExpresion.esError())
            {
                if(expresion instanceof ExpVariable)
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    var variableBuscada = entorno.getSimbolo(expresion.id);
                    variableBuscada.valor--;
                    return variableBuscada.valor;
                }
                else
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    return valorExpresion - 1;                    
                }

            }
            else
            {
                var tipo = this.expresion.getTipo(entorno);
                Utils.registrarErrorSemantico(this.linea, this.columna, '++','Se esperaba un tipo entero.'+ tipo.getNombreTipo());
                return 0; 
            }

        }

        this.ejecutar = function(entorno)
        {
            var tipoExpresion = this.getTipo(entorno);
            if(!tipoExpresion.esError())
            {
                if(expresion instanceof ExpVariable)
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    var variableBuscada = entorno.getSimbolo(expresion.id);
                    variableBuscada.valor--;
                    return variableBuscada.valor;
                }
                else
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    return valorExpresion - 1;
                }

            }
            else
            {
                var tipo = this.expresion.getTipo(entorno);
                Utils.registrarErrorSemantico(this.linea, this.columna, '++','Se esperaba un tipo entero.'+ tipo.getNombreTipo());
                return 0;
            }

        }
    }
}


class Limites
{
    constructor(linea, columna, inicio, final)
    {
        this.linea = linea;
        this.columna = columna;
        this.inicio = inicio;
        this.final = final;

        this.getValor = function(entorno)
        {
            var limiteInferior = 0;
            var limiteFinal = -1;
            if(this.inicio != null)
            {
                var tipoInicio = this.inicio.getTipo(entorno);
                if(tipoInicio.esEntero())
                {
                    var valorInicio = this.inicio.getValor(entorno);
                    limiteInferior = valorInicio;
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Arreglo','Se espera un valor de tipo entero como límite inferior.');
                }
            }
            if(this.final != null)
            {
                var tipoFinal = this.final.getTipo(entorno);
                if(tipoFinal.esEntero())
                {
                    var valorFinal = this.final.getValor(entorno);
                    limiteFinal = valorFinal;
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Arreglo','Se espera un valor de tipo entero como límite superior.');
                }
            }            
            this.limiteInferior = limiteInferior;
            this.limiteSuperior = limiteFinal;
            return this;
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
            var idFuncion = this.id;
            this.parametrosFormales.forEach(parametro => {
                idFuncion += '_'+ parametro.tipo.getNombreTipo();
            });
            var nuevaFuncion = new SimboloFuncion(this.linea, this.columna, idFuncion, this.tipo, this.parametrosFormales, this.bloqueInstrucciones);            
            entorno.registrarSimbolo(nuevaFuncion);        
        }
        

        this.generar3D = function(entorno)
        {

            var idFuncion = this.id;
            this.parametrosFormales.forEach(parametro => {
                idFuncion += '_'+ parametro.tipo.getNombreTipo();
            });
            var nuevaFuncion = new SimboloFuncion(this.linea, this.columna, idFuncion, this.tipo, this.parametrosFormales, this.bloqueInstrucciones);            
            entorno.registrarSimbolo(nuevaFuncion);  

            // Codigo para codigo del método. 
            var EtiquetaSalida = Utils.generarEtiqueta();
            Utils.EtiquetaSalida = EtiquetaSalida;
            Utils.imprimirConsola('\n\nvoid '+idFuncion+'() {\n');
            if(this.id=='main')
            {
                Utils.imprimirConsola('INIT_global_variables();\n');
                Utils.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno del global a actual\n');
            }
            /*Antes de ejecutar las instrucciones tenemos que almacenar los parámetros en el entorno*/
            var entornoActual = new Entorno(entorno.getEntornoGlobal());
            this.parametrosFormales.forEach(parametro => {
                var simboloTmp = entornoActual.getSimbolo(parametro.id);
                if(simboloTmp== null || simboloTmp== undefined)
                {
                    var nuevoParametro = new Simbolo(parametro.linea, parametro.columna, parametro.id, parametro.tipo, null);
                    entornoActual.registrarSimbolo(nuevoParametro);
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración parametros','Ya se ha declarado un parámetro/variable con el nombre '+parametro.id);                    
                }
            });
            this.bloqueInstrucciones.generar3D(entornoActual);
            Utils.imprimirConsola(EtiquetaSalida+'://Salida\n');
            if(this.id=='main')
            {
                Utils.imprimirConsola('//for(int i =0; i<300; i++){\n');
                Utils.imprimirConsola('//printf("%d\t%d\t%c %c", i, (int)heap[i],(int)heap[i],10);}\n');
            }            
            Utils.imprimirConsola('return;\n');
            Utils.imprimirConsola('}//Fin main\n');  
            // Por último guardamos el entorno actual en el símbolo funcion
            nuevaFuncion.setEntornoFuncion(entornoActual);
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
            var arrayId = new Array;
            arrayId.push(this.id);
            var nodoDeclaracionParametro = new Declaracion(this.linea, this.columna, this.tipo,arrayId, this.valor );
            nodoDeclaracionParametro.ejecutar(entorno);
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
            var index = 0;
            for(index = 0 ; index < this.instrucciones.length; index++)
            {
                var instruccion = this.instrucciones[index];
                if (instruccion instanceof Llamada)
                {
                    instruccion.getValor(entorno);
                }
                else
                {                    
                    if(instruccion instanceof Retorno)
                    {
                        return instruccion;
                    }else if(instruccion instanceof BreakInst){

                        return instruccion;
                    }else if (instruccion instanceof ContinueInst){

                        return instruccion;
                    }else{
                        var posibleRetorno = instruccion.ejecutar(entorno);                    
                        if(posibleRetorno!= null && posibleRetorno!= undefined)
                        {
                            if(posibleRetorno instanceof Retorno)
                            {
                                return posibleRetorno;
                            }else if(posibleRetorno instanceof BreakInst){

                                return posibleRetorno;
                            }else if (posibleRetorno instanceof ContinueInst){

                                return posibleRetorno;
                            }
                        }
                    }
                }                
            }
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
                Utils.imprimirConsola('printf("%c", (int) '+valorExpresion+'); // Imprimir caracter\n');                 
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
                var cadena = '\n';
                if(valor instanceof Array)
                {
                    cadena = cadena + this.recogerArreglo(entorno, valor);                    
                }
                else
                if(valor instanceof Simbolo)
                {
                    if(valor.valor instanceof Array)
                    {
                        cadena = cadena + this.recogerArreglo(entorno, valor.valor);                        
                    }                    
                    else
                    {
                        cadena = cadena + valor.valor.toString();
                    }
                }
                else
                {
                     cadena = cadena +  valor;
                }                
                Utils.imprimirConsola(cadena);
            }                                    
        }

        this.recogerArreglo = function(entorno, arreglo)
        {
            var cadena = "[";
            var index = 0;
            for(index = 0; index < arreglo.length; index++)
            {
                var item = arreglo[index];
                if(item instanceof Array)
                {
                    if(cadena == '[')
                    {
                        cadena = cadena + this.recogerArreglo(entorno, item);
                    }
                    else
                    {
                        cadena = cadena + ',' + this.recogerArreglo(entorno, item);
                    }                    
                }else
                if(item instanceof Simbolo)
                {
                    var valorActual = item.valor;
                    if(valorActual instanceof Array)
                    {
                        if(cadena == '[')
                        {
                            cadena = cadena + this.recogerArreglo(entorno, valorActual);
                        }
                        else
                        {
                            cadena = cadena + ',' + this.recogerArreglo(entorno, valorActual);
                        }   
                    }
                    else
                    {
                        if(cadena == '[')
                        {
                            cadena = cadena + valorActual;
                        }
                        else
                        {
                            cadena = cadena + ',' + valorActual;
                        }                    
                    }
                }                
                else
                {
                    if(cadena == '[')
                    {
                        cadena = cadena + item;
                    }
                    else
                    {
                        cadena = cadena + ',' + item;
                    }                    
                }
            }
            cadena = cadena + "]";
            return cadena;
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
                Utils.imprimirConsola('printf("%c", (int) '+valorExpresion+'); // Imprimir caracter\n');   
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


class Declaracion
{
    constructor(linea, columna, tipo, listaId, expresion)
    {
        this.linea = linea; 
        this.columna = columna;
        this.tipo = tipo;
        this.listaId = listaId;
        this.expresion = expresion;

        this.ejecutar = function(entorno)
        {
                       
            if(this.expresion != null)
            {
                var tipoExpresion = this.expresion.getTipo(entorno); 
                var valorExpresion = this.expresion.getValor(entorno);            
                if(tipoExpresion.esIgual(this.tipo))
                {
                    this.listaId.forEach( id =>
                        {
                            //var simboloTmp = entorno.getSimbolo(id);
                            var simboloTmp = entorno.tabla.get(id);
                            if(simboloTmp == null || simboloTmp == undefined)
                            {
                                var nuevoVariable = new Simbolo(this.linea, this.columna, id, this.tipo, valorExpresion);
                                entorno.registrarSimbolo(nuevoVariable);
                            }
                            else
                            {
                                Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración','Ya se ha declarado una variable llamada '+id +'.');
                            }
                        });
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración','Se esperaba una valor de tipo '+this.tipo.getNombreTipo());
                }
            }
            else
            {                
                this.listaId.forEach( id =>
                    {
                        var simboloTmp = entorno.getSimbolo(id);
                        if(simboloTmp == null || simboloTmp == undefined)
                        {
                            var valorInicial = '';
                            if(this.tipo.esCadena())
                            {
                                valorInicial = null;
                            }
                            else if (this.tipo.esNumerico())
                            {
                                valorInicial = 0;
                            }
                            else if (this.tipo.esBoolean())
                            {
                                valorInicial = 0; // Falso por defecto
                            }
                            var nuevoVariable = new Simbolo(this.linea, this.columna, id, this.tipo, valorInicial);
                            entorno.registrarSimbolo(nuevoVariable);                        
                        }
                        else
                        {
                            Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración','Ya se ha declarado una variable llamada '+id +'.');
                        }
                    });                
            }            
        }

        this.generar3D = function(entorno)
        {
                       
            if(this.expresion != null)
            {
                var tipoExpresion = this.expresion.getTipo(entorno); 
                var valorExpresion = this.expresion.generar3D(entorno);            
                if(tipoExpresion.esIgual(this.tipo))
                {
                    this.listaId.forEach( id =>
                        {
                            if(id=='val4')
                            {
                                console.log("Mensaje");
                            }
                            var simboloTmp = entorno.tabla.get(id);
                            if(simboloTmp == null || simboloTmp == undefined)
                            {
                                var nuevoVariable = new Simbolo(this.linea, this.columna, id, this.tipo, null);
                                entorno.registrarSimbolo(nuevoVariable);

                                var t0 = Utils.generarTemporal();

                                Utils.imprimirConsola(t0+'=P+'+nuevoVariable.posicion.toString()+'; //Direccion local variable '+id+'\n');
                                if(tipoExpresion.esBoolean())
                                {
                                    if(Utils.tenemosEtiquetas(valorExpresion))
                                    {
                                        var t100 = Utils.generarTemporal();
                                        var LS = Utils.generarEtiqueta();
                                        Utils.imprimirConsola(valorExpresion.LV+':\n');
                                        Utils.imprimirConsola(t100+'=1;\n');
                                        Utils.imprimirConsola('goto '+LS+';\n');
                                        Utils.imprimirConsola(valorExpresion.LF+':\n');
                                        Utils.imprimirConsola(t100+'=0;\n');
                                        Utils.imprimirConsola(LS+':\n');
                                        valorExpresion = t100;
                                    }
                                }
                                Utils.imprimirConsola('stack[(int)'+t0+']='+valorExpresion+';\n');                                
                            }
                            else
                            {
                                Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración','Ya se ha declarado una variable llamada '+id +'.');
                            }
                        });
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración','Se esperaba una valor de tipo '+tipoExpresion.getNombreTipo());
                }
            }
            else
            {
                this.listaId.forEach( id =>
                    {
                        var simboloTmp = entorno.getSimbolo(id);
                        if(simboloTmp == null || simboloTmp == undefined)
                        {
                            var valorInicial = 0;
                            if(this.tipo.esCadena())
                            {
                                valorInicial = Utils.obtenerFinCadena();
                            }
                            else if (this.tipo.esNumerico())
                            {
                                valorInicial = 0;
                            }
                            else if (this.tipo.esBoolean())
                            {
                                valorInicial = 0; // Falso por defecto
                            }
                            var nuevoVariable = new Simbolo(this.linea, this.columna, id, this.tipo, null);
                            entorno.registrarSimbolo(nuevoVariable);

                            var t0 = Utils.generarTemporal();
                            Utils.imprimirConsola(t0+'=P+'+nuevoVariable.posicion.toString()+'; // Direccion '+id+'\n');
                            Utils.imprimirConsola('stack[(int)'+t0+']='+valorInicial+';//Valor variable '+id+'\n');
                        }
                        else
                        {
                            Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración','Ya se ha declarado una variable llamada '+id +'.');
                        }
                    });                
            }
        }

    }
}


class Asignacion 
{
    constructor(linea, columna, id, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion = expresion;

        this.ejecutar = function(entorno)
        {
            // Primero buscamos la variable 
            var VarBuscada = entorno.getSimbolo(this.id);
            if(VarBuscada== null || VarBuscada== undefined)
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'Asignación','La variable '+id +' no ha sido declarada anteriormente.');
                return;
            }
            else
            {   
                var tipoExpresion = this.expresion.getTipo(entorno);
                if(tipoExpresion.esIgual(VarBuscada.tipo))
                {
                    // Si son iguales no hay problema
                    var valorExpresion = this.expresion.getValor(entorno);
                    VarBuscada.valor = valorExpresion;                 

                }
                else if (VarBuscada.tipo.esNumerico() && tipoExpresion.esNumerico())
                {
                    // Verificar si los tipos son compatibles
                    var valorExpresion = this.expresion.getValor(entorno);
                    VarBuscada.valor = valorExpresion;
                }
                else
                {
                    // Error tipos no coinciden
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Asignación','Variable '+id +'. Se esperaba un valor de tipo '+VarBuscada.tipo.getNombreTipo());
                    return;                    
                }
            }
        }

        this.generar3D = function(entorno)
        {
            // Primero buscamos la variable 
            var VarBuscada = entorno.getSimbolo(this.id);
            if(VarBuscada== null || VarBuscada== undefined)
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'Asignación','La variable '+id +' no ha sido declarada anteriormente.');
                return;
            }
            else
            {   
                var tipoExpresion = this.expresion.getTipo(entorno);
                if(tipoExpresion.esIgual(VarBuscada.tipo))
                {
                    // Si son iguales no hay problema
                    var valorExpresion = this.expresion.generar3D(entorno);
                    var variableLocal = entorno.tabla.get(this.id);
                    if(VarBuscada.tipo.esBoolean())
                    {
                        if(Utils.tenemosEtiquetas(valorExpresion))
                        {
                            var t100 = Utils.generarTemporal();
                            var LS = Utils.generarEtiqueta();
                            Utils.imprimirConsola(valorExpresion.LV+':\n');
                            Utils.imprimirConsola(t100+'=1;\n');
                            Utils.imprimirConsola('goto '+LS+';\n');
                            Utils.imprimirConsola(valorExpresion.LF+':\n');
                            Utils.imprimirConsola(t100+'=0;\n');
                            Utils.imprimirConsola(LS+':\n');
                            valorExpresion = t100;
                        }
                    }
                    if(variableLocal != null)
                    {
                        var t0 = Utils.generarTemporal();
                        Utils.imprimirConsola(t0+'=P+'+VarBuscada.posicion.toString()+';\n');
                        Utils.imprimirConsola('stack[(int)'+t0+']='+valorExpresion+';\n');
                    }
                    else
                    {
                        /*var t0 = Utils.generarTemporal();
                        var t1 = Utils.generarTemporal();
                        Utils.imprimirConsola(t1+'=P-'+entorno.getStringTamanioEntorno()+';// Simular cambio de entorno global\n');
                        Utils.imprimirConsola(t0+'='+VarBuscada.posicion.toString()+';\n');*/
                        Utils.imprimirConsola('stack[(int)'+VarBuscada.posicion.toString()+']='+valorExpresion+';\n');
                    }

                }
                else if (VarBuscada.tipo.esNumerico() && tipoExpresion.esNumerico())
                {
                    // Verificar si los tipos son compatibles
                    var valorExpresion = this.expresion.generar3D(entorno);

                    if(variableLocal != null)
                    {
                        var t0 = Utils.generarTemporal();
                        Utils.imprimirConsola(t0+'=P+'+VarBuscada.posicion.toString()+';\n');
                        Utils.imprimirConsola('stack[(int)'+t0+']='+valorExpresion+';\n'); 
                    }
                    else
                    {
                        var t0 = Utils.generarTemporal();
                        var t1 = Utils.generarTemporal();
                        Utils.imprimirConsola(t1+'=P-'+entorno.getStringTamanioEntorno()+';// Simular cambio de entorno global\n');                        
                        Utils.imprimirConsola(t0+'='+t1+'+'+VarBuscada.posicion.toString()+';\n');
                        Utils.imprimirConsola('stack[(int)'+t0+']='+valorExpresion+';\n'); 
                    }                    
                }
                else
                {
                    // Error tipos no coinciden
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Asignación','Variable '+id +'. Se esperaba un valor de tipo '+VarBuscada.tipo.getNombreTipo());
                    return;                    
                }
            }
        }
    }
}

class Retorno
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.ejecutar = function(entorno)
        {
            return this;
        }

        this.generar3D = function(entorno)
        {
            var valor = this.expresion.generar3D(entorno);
            Utils.imprimirConsola('stack[(int)P] = '+valor+';\n');
            Utils.imprimirSaltoSalida();
        }
    }
}


class Si
{
    constructor(linea, columna, condicion, bloque, sinosi)
    {
        this.linea = linea;
        this.columna = columna;
        this.condicion = condicion;
        this.bloque = bloque;
        this.sinosi = sinosi;

        this.ejecutar = function(entorno)
        {
            var tipoCondicion = this.condicion.getTipo(entorno);
            if(tipoCondicion.esBoolean())
            {
                var valorCondicion = this.condicion.getValor(entorno);
                if(valorCondicion)
                {
                    return this.bloque.ejecutar(entorno);
                }
                else
                {
                    if(this.sinosi != null && this.sinosi != undefined)
                    {
                        return this.sinosi.ejecutar(entorno);
                    }
                }
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'IF','Se espera en la condición una expresión de tipo boolean. Se ha recibido un '+tipoCondicion.getNombreTipo());
                return;
            }
        }
        this.generar3D = function(entorno)
        {
            var valorCondicion = this.condicion.generar3D(entorno);
            var tipoCondicion = this.condicion.getTipo(entorno);
            if(tipoCondicion.esBoolean())
            {
                if(Utils.tenemosEtiquetas(valorCondicion))
                {
                    var LSalida = Utils.generarEtiqueta();
                    Utils.imprimirConsola(valorCondicion.LV+':\n');
                    this.bloque.generar3D(entorno);
                    Utils.imprimirConsola('goto '+LSalida+';\n');
                    Utils.imprimirConsola(valorCondicion.LF+':\n');
                    if(this.sinosi != null && this.sinosi != undefined)
                    {
                        this.sinosi.generar3D(entorno);
                    }
                    Utils.imprimirConsola(LSalida+':\n');
                }
                else
                {
                    this.LV = Utils.generarTemporal();
                    this.LF = Utils.generarTemporal();
                    var LSalida = Utils.generarEtiqueta();
                    Utils.imprimirConsola('if('+valorCondicion+'==1) goto '+this.LV+';\n');
                    Utils.imprimirConsola('goto '+this.LF+';\n');

                    Utils.imprimirConsola(this.LV+':\n');
                    this.bloque.generar3D(entorno);
                    Utils.imprimirConsola('goto '+LSalida+';\n');
                    Utils.imprimirConsola(this.LF+':\n');
                    if(this.sinosi != null && this.sinosi != undefined)
                    {
                        this.sinosi.generar3D(entorno);
                    }
                    Utils.imprimirConsola(LSalida+':\n');

                }
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'IF','Se espera en la condición una expresión de tipo boolean. Se ha recibido un '+tipoCondicion.getNombreTipo());
                return;                
            }

        }
    }
}


class SwitchInst
{
    constructor(linea, columna, expresion, lista_cases, default_inst)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
        this.lista_cases = lista_cases;
        this.default_inst = default_inst;

        this.ejecutar = function(entorno)
        {
            var condicion = this.expresion.getValor(entorno);

            if(condicion != null && condicion != undefined){

                var hay_break = false;
                var continuar = false;

                var index = 0;
                for(index = 0 ; index < this.lista_cases.length; index++){
                    var caso = this.lista_cases[index];
                    caso.condicion = condicion;
                    caso.continuar = continuar;

                    var resultado = caso.ejecutar(entorno);

                    continuar = caso.continuar; //ya coincidio pero no habia break

                    if(resultado != null){//coincide
                        if(resultado instanceof BreakInst){
                            hay_break = true;
                            break;
                        }else if(resultado instanceof Return){
                            return resultado;
                        }
                    }
                    //no coincide
                }

                if(!hay_break){//ejecuta default
                    return this.default_inst.ejecutar(entorno);
                }


            }else{
                Utils.registrarErrorSemantico(this.linea, this.columna, 'instruccion switch','error al obtener el valor de la expresion','');
                return;
            }

        }

        this.generar3D = function(entorno)
        {
        }
    }
}

class CaseInst
{
    constructor(linea, columna, expresion, bloque)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
        this.bloque = bloque;

        this.condicion = null;
        this.continuar = false;

        this.ejecutar = function(entorno)
        {
            var valor_case = this.expresion.getValor(entorno);
            if(this.condicion == valor_case || this.continuar){
                this.continuar = true;
                return this.bloque.ejecutar(entorno); //Break, Return
            }else{
                return null;
            }

        }

        this.generar3D = function(entorno)
        {
        }
    }
}

class BreakInst
{
    constructor(linea, columna)
    {
        this.linea = linea;
        this.columna = columna;

        this.ejecutar = function(entorno)
        {
            return this;
        }

        this.generar3D = function(entorno)
        {
        }
    }
}

class DefaultInst
{
    constructor(linea, columna, bloque)
    {
        this.linea = linea;
        this.columna = columna;
        this.bloque = bloque;

        this.ejecutar = function(entorno)
        {
            return this.bloque.ejecutar(entorno);
        }

        this.generar3D = function(entorno)
        {
        }
    }
}

class ContinueInst{
    constructor(linea, columna)
    {
        this.linea = linea;
        this.columna = columna;

        this.ejecutar = function(entorno)
        {
            return this;
        }

        this.generar3D = function(entorno)
        {
        }
    }
}

class WhileInst
{
    constructor(linea, columna, expresion, bloque)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
        this.bloque = bloque;

        this.ejecutar = function(entorno)
        {
            var condicion = this.expresion.getValor(entorno);
            var tipo = this.expresion.getTipo(entorno);

            if(tipo.esBoolean()){
                while(condicion){
                    var resultado = this.bloque.ejecutar(entorno);
                    if(resultado != null && resultado != undefined){
                        if(resultado instanceof BreakInst){
                            break;
                        }else if(resultado instanceof Retorno){
                            return  resultado;
                        }else if(resultado instanceof ContinueInst){

                            condicion = this.expresion.getValor(entorno);
                            continue;
                        }
                    }
                    condicion = this.expresion.getValor(entorno);
                }

            }else{
                Utils.registrarErrorSemantico(this.linea, this.columna, 'instruccion while','Se esperaba una expresion booleana','');
                return;
            }
        }

        this.generar3D = function(entorno)
        {
        }
    }
}

class DoWhileInst
{
    constructor(linea, columna, bloque, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.bloque = bloque;
        this.expresion = expresion;

        this.ejecutar = function(entorno)
        {
            var condicion = this.expresion.getValor(entorno);
            var tipo = this.expresion.getTipo(entorno);

            if(tipo.esBoolean()){

                do{
                    var resultado = this.bloque.ejecutar(entorno);
                    if(resultado != null && resultado != undefined){
                        if(resultado instanceof BreakInst){
                            break;
                        }else if(resultado instanceof Retorno){
                            return  resultado;
                        }else if(resultado instanceof ContinueInst){
                            condicion = this.expresion.getValor(entorno);
                            continue;
                        }
                    }
                    condicion = this.expresion.getValor(entorno);
                }while(condicion);

            }else{
                Utils.registrarErrorSemantico(this.linea, this.columna, 'instruccion while','Se esperaba una expresion booleana','');
                return;
            }
        }

        this.generar3D = function(entorno)
        {
        }
    }
}

class ForInst
{
    constructor(linea, columna, declarion_asignacion, condicion, aumento_disminucion, bloque)
    {
        this.linea = linea;
        this.columna = columna;
        this.declarion_asignacion = declarion_asignacion;
        this.condicion = condicion;
        this.aumento_disminucion = aumento_disminucion;
        this.bloque = bloque;

        this.ejecutar = function(entorno)
        {
            var nuevoEntorno = new Entorno(entorno);
            this.declarion_asignacion.ejecutar(nuevoEntorno);
            var tipoCondicion = this.condicion.getTipo(nuevoEntorno);
            if(!tipoCondicion.esBoolean())
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'For','La condición debe ser de tipo boolean. Recibido '+tipoCondicion.getNombreTipo());
                return;
            }

            var valorCondicion = this.condicion.getValor(nuevoEntorno);
            while(valorCondicion)
            {
                var entornoTemporal = new Entorno(nuevoEntorno,false);
                // Induce un nuevo entorno ? 
                var posibleRetorno = this.bloque.ejecutar(entornoTemporal);
                if(posibleRetorno!= null && posibleRetorno!= undefined)
                {
                    if(posibleRetorno instanceof Retorno)
                    {
                        return posibleRetorno;
                    }else if(posibleRetorno instanceof BreakInst){
                        break;
                    }else if(posibleRetorno instanceof ContinueInst){
                        this.aumento_disminucion.getValor(entornoTemporal);
                        valorCondicion = this.condicion.getValor(entornoTemporal);
                        continue;
                    }

                }                
                this.aumento_disminucion.getValor(nuevoEntorno);
                valorCondicion = this.condicion.getValor(nuevoEntorno);                
            }
        }
        this.generar3D = function(entorno)
        {

        }
    }
}

class For2Inst
{
    constructor(linea, columna, id, expresion, bloque)
    {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion = expresion;
        this.bloque = bloque;

        this.ejecutar = function(entorno)
        {
            if(!(this.expresion instanceof Array))
            {
                var valorExpresion = this.expresion.getValor(entorno);                
            }            
            else
            {
                valorExpresion = this.expresion;
            }
            if (valorExpresion instanceof Array)
            {
                var index = 0 ;                        
                for(index = 0; index < valorExpresion.length; index++)
                {
                    var expresionActual = valorExpresion[index];
                    var valorActual = expresionActual.valor;
                    var tipoActual = expresionActual.tipo;
                    var nuevaVariable = new Simbolo(this.linea, this.columna, this.id, tipoActual,valorActual);
                    var nuevoEntorno = new Entorno(entorno);
                    nuevoEntorno.registrarSimbolo(nuevaVariable);
                    var posibleRetorno = this.bloque.ejecutar(nuevoEntorno);
                    if(posibleRetorno!= null && posibleRetorno!= undefined)
                    {
                        if(posibleRetorno instanceof Retorno)
                        {
                            return posibleRetorno;
                        }else if(posibleRetorno instanceof BreakInst){
                            break;
                        }else if(posibleRetorno instanceof ContinueInst){
                            /*
                            TODO: falta esta parte
                            continue;
                             */
                        }
                    }                    
                }
            } 
            else
            //if(this.expresion instanceof ExpString)
            {                
                if(this.expresion.getTipo(entorno).esCadena())
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    if (valorExpresion instanceof Array)
                    {
                        var index = 0 ;                        
                        for(index = 0; index < valorExpresion.length; index++)
                        {
                            var expresionActual = valorExpresion[index];
                            var valorActual = expresionActual.valor;
                            var tipoActual = expresionActual.tipo;
                            var nuevaVariable = new Simbolo(this.linea, this.columna, this.id, tipoActual,valorActual);
                            var nuevoEntorno = new Entorno(entorno);
                            nuevoEntorno.registrarSimbolo(nuevaVariable);
                            var posibleRetorno = this.bloque.ejecutar(nuevoEntorno);
                            if(posibleRetorno!= null && posibleRetorno!= undefined)
                            {
                                if(posibleRetorno instanceof Retorno)
                                {
                                    return posibleRetorno;
                                }else if(posibleRetorno instanceof BreakInst){
                                    break;
                                }else if(posibleRetorno instanceof ContinueInst){
                                    /*
                                    continue;
                                     */
                                }
                            }                    
                        }
                    } 
                    else
                    {
                        var arregloCaracteres = valorExpresion.split("");
                        var index = 0;
                        for(index = 0 ; index < arregloCaracteres.length; index++)
                        {
                            var valorActual = arregloCaracteres[index];
                            var nuevaVariable = new Simbolo(this.linea, this.columna, this.id, new Tipo(TipoPrimitivo.CHAR),valorActual.charCodeAt().toString());
                            var nuevoEntorno = new Entorno(entorno);
                            nuevoEntorno.registrarSimbolo(nuevaVariable);
                            var posibleRetorno = this.bloque.ejecutar(nuevoEntorno);
                            if(posibleRetorno!= null && posibleRetorno!= undefined)
                            {
                                if(posibleRetorno instanceof Retorno)
                                {
                                    return posibleRetorno;
                                }else if(posibleRetorno instanceof BreakInst){
                                    break;
                                }else if(posibleRetorno instanceof ContinueInst){
                                    /*
                                    continue;
                                     */
                                }
                            }
                        }
                    }
                }
            }                       
        }

        this.generar3D = function(entorno)
        {
        }
    }
}


class For3Inst
{
    constructor(linea, columna, id, expresion, limites, bloque)
    {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.expresion = expresion;
        this.bloque = bloque;
        this.limites = limites;

        this.ejecutar = function(entorno)
        {

            if (this.expresion instanceof Array)
            {                
                var limites = this.limites.getValor(entorno);                
                var index = limites.limiteInferior; 
                if(limites.limiteInferior<0)
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','El limite inferior tiene que ser mayor a 0.');
                    index = 0;
                }                                               
                if(limites.limiteSuperior>valorExpresion.length)
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','Limite superior excedido. Máximo ' + this.expresion.length +'. Recibido '+limites.limiteSuperior);
                    superior = this.expresion.length-1;
                }                        
                var superior = limites.limiteSuperior ==-1 ?  this.expresion.length-1 : limites.limiteSuperior;
                for(index = index; index <= superior ; index++)
                {
                    var expresionActual = this.expresion[index];
                    var valorActual = expresionActual.getValor(entorno);
                    var tipoActual = expresionActual.getTipo(entorno);
                    var nuevaVariable = new Simbolo(this.linea, this.columna, this.id, tipoActual,valorActual);
                    var nuevoEntorno = new Entorno(entorno);
                    nuevoEntorno.registrarSimbolo(nuevaVariable);
                    var posibleRetorno = this.bloque.ejecutar(nuevoEntorno);
                    if(posibleRetorno!= null && posibleRetorno!= undefined)
                    {
                        if(posibleRetorno instanceof Retorno)
                        {
                            return posibleRetorno;
                        }
                    }                    
                }
            } 
            else            
            {   
                var valorExpresion = this.expresion.getValor(entorno);
                if(this.expresion.getTipo(entorno).esCadena())
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    if (valorExpresion instanceof Array)
                    {
                        var limites = this.limites.getValor(entorno);                
                        var index = limites.limiteInferior; 
                        if(limites.limiteInferior<0)
                        {
                            Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','El limite inferior tiene que ser mayor a 0.');
                            index = 0;
                        }                                               
                        if(limites.limiteSuperior>valorExpresion.length)
                        {
                            Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','Limite superior excedido. Máximo ' + valorExpresion.length +'. Recibido '+limites.limiteSuperior);
                            superior = valorExpresion.length-1;
                        }                        
                        var superior = limites.limiteSuperior ==-1 ?  valorExpresion.length-1 : limites.limiteSuperior;
                        for(index = index; index <= superior ; index++)
                        {
                            var expresionActual = valorExpresion[index];
                            var valorActual = expresionActual.valor;
                            var tipoActual = expresionActual.tipo;
                            var nuevaVariable = new Simbolo(this.linea, this.columna, this.id, tipoActual,valorActual);
                            var nuevoEntorno = new Entorno(entorno);
                            nuevoEntorno.registrarSimbolo(nuevaVariable);
                            var posibleRetorno = this.bloque.ejecutar(nuevoEntorno);
                            if(posibleRetorno!= null && posibleRetorno!= undefined)
                            {
                                if(posibleRetorno instanceof Retorno)
                                {
                                    return posibleRetorno;
                                }
                            }                    
                        }
                    } 
                    else
                    {
                        var arregloCaracteres = valorExpresion.split("");
                        var limites = this.limites.getValor(entorno);                
                        var index = limites.limiteInferior; 
                        if(limites.limiteInferior<0)
                        {
                            Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','El limite inferior tiene que ser mayor a 0.');
                            index = 0;
                        }                                               
                        if(limites.limiteSuperior>valorExpresion.length)
                        {
                            Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','Limite superior excedido. Máximo ' + valorExpresion.length +'. Recibido '+limites.limiteSuperior);
                            superior = valorExpresion.length-1;
                        }                        
                        var superior = limites.limiteSuperior ==-1 ?  valorExpresion.length-1 : limites.limiteSuperior;
                        for(index = index; index <= superior ; index++)
                        {
                            var valorActual = arregloCaracteres[index];
                            var nuevaVariable = new Simbolo(this.linea, this.columna, this.id, new Tipo(TipoPrimitivo.CHAR),valorActual.charCodeAt().toString());
                            var nuevoEntorno = new Entorno(entorno);
                            nuevoEntorno.registrarSimbolo(nuevaVariable);
                            var posibleRetorno = this.bloque.ejecutar(nuevoEntorno);
                            if(posibleRetorno!= null && posibleRetorno!= undefined)
                            {
                                if(posibleRetorno instanceof Retorno)
                                {
                                    return posibleRetorno;
                                }
                            }
                        }
                    }
                }
                else
                {
                    var valorExpresion = this.expresion.getValor(entorno);
                    if (valorExpresion instanceof Array)
                    {
                        var limites = this.limites.getValor(entorno);                
                        var index = limites.limiteInferior; 
                        if(limites.limiteInferior<0)
                        {
                            Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','El limite inferior tiene que ser mayor a 0.');
                            index = 0;
                        }                        
                        var superior = limites.limiteSuperior ==-1 ?  valorExpresion.length-1 : limites.limiteSuperior;                       
                        if(limites.limiteSuperior>valorExpresion.length-1)
                        {
                            Utils.registrarErrorSemantico(this.linea, this.columna, 'Acceso a vector','Limite superior excedido. Máximo ' + (valorExpresion.length-1) +'. Recibido '+limites.limiteSuperior);
                            superior = valorExpresion.length-1;
                        }                                                
                        for(index = index; index <= superior ; index++)
                        {
                            var expresionActual = valorExpresion[index];
                            var valorActual = expresionActual.valor;
                            var tipoActual = expresionActual.tipo;
                            var nuevaVariable = new Simbolo(this.linea, this.columna, this.id, tipoActual,valorActual);
                            var nuevoEntorno = new Entorno(entorno);
                            nuevoEntorno.registrarSimbolo(nuevaVariable);
                            var posibleRetorno = this.bloque.ejecutar(nuevoEntorno);
                            if(posibleRetorno!= null && posibleRetorno!= undefined)
                            {
                                if(posibleRetorno instanceof Retorno)
                                {
                                    return posibleRetorno;
                                }
                            }                    
                        }
                    }                    
                }
            }                       
        }
    }
}

class DeclaracionArreglo 
{
    constructor(linea, columna, tipo, id, arregloExpresion)
    {
        this.linea = linea;
        this.columna= columna;
        this.tipo = tipo;
        this.id = id;
        this.arregloExpresion = arregloExpresion;

        this.getTipo = function(entorno)
        {
            return this.tipo;
        }

        this.ejecutar = function(entorno)
        {
            //var simboloPosible = entorno.getSimbolo(this.id);
            var simboloPosible = entorno.tabla.get(this.id);
            if(simboloPosible==null || simboloPosible == undefined)
            {
                var index = 0;
                var nuevoArreglo = new Array;
                for(index = 0 ; index<this.arregloExpresion.length; index++)
                {
                    var nuevoSimboloArreglo = this.obtenerValor(entorno, tipo, this.arregloExpresion[index],index);
                    nuevoArreglo.push(nuevoSimboloArreglo);
                }
                var nuevoArreglo = new Simbolo(this.linea, this.columna, this.id, this.tipo, nuevoArreglo);
                nuevoArreglo.rol = 'ARREGLO';
                entorno.registrarSimbolo(nuevoArreglo);
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración Arreglo','Ya existe un símbolo con el identificador '+this.id);
                return;
            }
        }

        this.obtenerValor = function(entorno,tipo, expresionActual,indice)
        {            
            if(expresionActual instanceof Array)
            {
                var index = 0;
                var nuevoArreglo = new Array;
                for(index = 0 ; index<expresionActual.length; index++)
                {
                    var nuevoSimboloArreglo = this.obtenerValor(entorno, tipo, expresionActual[index],index);
                    nuevoArreglo.push(nuevoSimboloArreglo);
                }                   
                var tmp =   new Simbolo(this.linea, this.columna, this.id, this.tipo, nuevoArreglo);             
                tmp.rol = 'ARREGLO';
                return tmp;
            }
            else
            {
                var tipoActual = expresionActual.getTipo(entorno);
                if(tipoActual.esIgual(this.tipo))
                {
                    var valorActual = expresionActual.getValor(entorno);            
                    return  new Simbolo(this.linea, this.columna, this.id, this.tipo, valorActual);
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración Arreglo','El valor en el índice '+indice +' no coincide con el tipo declarado. '+this.tipo.getNombreTipo());
                    return;                        
                }                
            }
        }
        
        this.generar3D = function(entorno)
        {
            //var simboloPosible = entorno.getSimbolo(this.id);
            var simboloPosible = entorno.tabla.get(this.id);
            if(simboloPosible==null || simboloPosible == undefined)
            {
                var nuevoArreglo = new Simbolo(this.linea, this.columna, this.id, this.tipo, null);
                nuevoArreglo.rol = 'ARREGLO';
                entorno.registrarSimbolo(nuevoArreglo);
                var t0 = Utils.generarTemporal();
                var t1 = Utils.generarTemporal();
                Utils.imprimirConsola(t0+'=P+'+nuevoArreglo.getPosicion()+';//Direccion arreglo '+nuevoArreglo.id+'\n');
                Utils.imprimirConsola('stack[(int)'+t0+']=H; // Inicio del nuevo arreglo \n')
                Utils.imprimirConsola(t1+'=H;//Inicio arreglo '+nuevoArreglo.id+'\n');
                Utils.imprimirConsola('H=H+'+String(this.arregloExpresion.length)+'; // Reservando espacio en el heap para el arreglo\n');
                
                var index = 0;                
                for(index = 0 ; index<this.arregloExpresion.length; index++)
                {
                    //t0 es el inicio del arreglo en el heap
                    this.codigoElemento3D(entorno, tipo, this.arregloExpresion[index],index,t1);

                }                
                nuevoArreglo.arregloTamanio = this.arregloExpresion.length;                
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración Arreglo','Ya existe un símbolo con el identificador '+this.id);
                return;
            }
        }  
        
        //Generamos un nuevo símbolo con el valor nuevo del arreglo.
        this.codigoElemento3D = function(entorno,tipo, expresionActual,indice,inicio)
        {            
            if(expresionActual instanceof Array)
            {
                var index = 0;                
                for(index = 0 ; index<expresionActual.length; index++)
                {
                    var expresion = expresionActual[index];
                    var tipoExpresion = expresion.getTipo(entorno);
                    if(tipoExpresion.esIgual(itpo))
                    {
                        var t0 = Utils.generarTemporal();
                        Utils.imprimirConsola(t0+'='+inicio+'+'+String(indice)+'; // Dirección elemento '+String(indice)+'\n');
                        var valorExpresion = expresion.generar3D(entorno);                        
                        Utils.imprimirConsola('heap[(int)'+t0+']='+valorExpresion+';\n');
                    }
                    else
                    {
                        Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración Arreglo','Se esperaba un valor de tipo '+tipo.getNombreTipo());                        
                    }                    
                } 
            }
            else
            {
                var tipoActual = expresionActual.getTipo(entorno);
                if(tipoActual.esIgual(this.tipo))
                {
                    var t0 = Utils.generarTemporal();                                      
                    Utils.imprimirConsola(t0+'='+inicio+'+'+String(indice)+'; // Dirección elemento '+String(indice)+'\n');
                    var valorActual = expresionActual.generar3D(entorno);  
                    Utils.imprimirConsola('heap[(int)'+t0+']='+valorActual+';\n');                    
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'Declaración Arreglo','El valor en el índice '+indice +' no coincide con el tipo declarado. '+this.tipo.getNombreTipo());
                    return;                        
                }                
            }
        }        
    }
}

class Pop 
{
    constructor(linea, columna, expresion)
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;

        this.getTipo = function(entorno)
        {
            return this.expresion.getTipo(entorno);
        }

        this.getValor = function(entorno)
        {
            if(!this.getTipo(entorno).esError())
            {
                var valor = this.expresion.getValor(entorno);
                if(valor instanceof Simbolo)
                {
                    if(valor.valor instanceof Array)
                    {
                        return valor.valor.pop();
                    }
                }
                else if (valor instanceof Array)
                {
                    return valor.pop();
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'pop','La variable '+ this.id +' no es un arreglo');
                    return;
                }
            }
            else
            {
                //Reporte
            }
        }
    }
}



class Push 
{
    constructor(linea, columna, origen,expresion )
    {
        this.linea = linea;
        this.columna = columna;
        this.expresion = expresion;
        this.origen = origen;

        this.ejecutar = function(entorno)
        {
            var tipoO = this.origen.getTipo(entorno);
            var tipoE = this.expresion.getTipo(entorno);
            if(tipoO.esIgual(tipoE))
            {
                var origen = this.origen.getValor(entorno);
                var valor = this.expresion.getValor(entorno);
                if(origen instanceof Simbolo)
                {
                    if(origen.valor instanceof Array)
                    {
                        return origen.valor.push(valor);
                    }
                }
                else if (origen instanceof Array)
                {
                    return origen.push(valor);
                }
                else
                {
                    Utils.registrarErrorSemantico(this.linea, this.columna, 'pop','La variable '+ this.id +' no es un arreglo');
                    return;
                }
            }
            else
            {
                Utils.registrarErrorSemantico(this.linea, this.columna, 'push','Arreglo  esperaba un valor de tipo ' + this.origen.getTipo(entorno).getNombreTipo());
                return;
            }
        }
    }
}


