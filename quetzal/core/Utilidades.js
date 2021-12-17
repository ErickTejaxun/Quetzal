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
        this.finalCadena = 7823797;
        this.EtiquetaSalida = '';

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

        this.imprimirSaltoSalida = function()
        {
            this.imprimirConsola('goto '+this.EtiquetaSalida+';\n');
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
            cadenaSalida += '#include <math.h> // Libreria matematica\n';
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

        this.generarEtiqueta = function()
        {
            var etiqueta = 'L'+this.contadorEtiquetas;
            this.contadorEtiquetas += 1;
            return etiqueta;
        } 

        this.obtenerFinCadena = function()
        {
            return this.finalCadena.toString();
        }
        
        /*Area de generación de código 3D */
        this.generarCodigoParaImprimirLn = function(valor, entorno)
        {
            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            this.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulacion de cambio de entorno\n');
            this.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
            this.imprimirConsola('stack[(int)'+t1+']='+valor+';//Paso parametro\n');
            this.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
            this.imprimirConsola('Nativa_ImpresionLn();\n');
            Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Retomar entorno\n');
        }

        this.generarCodigoParaImprimir = function(valor, entorno)
        {
            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            this.imprimirConsola(t0+'=P+'+entorno.getStringTamanioEntorno()+';//Simulacion de cambio de entorno\n');
            this.imprimirConsola(t1+'='+t0+'+1;// Direccion parametro 1\n');
            this.imprimirConsola('stack[(int)'+t1+']='+valor+';//Paso parametro\n');
            this.imprimirConsola('P=P+'+entorno.getStringTamanioEntorno()+'; // Cambio de entorno\n');
            this.imprimirConsola('Nativa_Impresion();\n');
            Utils.imprimirConsola('P=P-'+entorno.getStringTamanioEntorno()+'; // Retomar entorno\n');
        }        

        this.generarNativas = function()
        {
            this.NativaImpresion();
            this.NativaImpresionLn();
            this.NativaCompararCadenas();
            this.NativaConcatenarCadenas();
            this.NativaIntToString();
            this.DoubleToString();
            this.CharToString();
            this.BooleanToString();
        }
        
        this.NativaImpresion = function()
        {
            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            var t2 = this.generarTemporal();

            var L0 = this.generarEtiqueta();
            var L1 = this.generarEtiqueta();
            var L2 = this.generarEtiqueta();

            this.imprimirConsola('\n\n');
            this.imprimirConsola('void Nativa_Impresion(){\n');
            this.imprimirConsola(t0+'=P+1;// Direccion parametro recibido\n');
            this.imprimirConsola(t1+'=stack[(int)'+t0+'];// Direccion de la cadena\n');
            this.imprimirConsola(L0+':\n');
            this.imprimirConsola(t2+'=heap[(int)'+t1+']; // Caracter actual\n');
            this.imprimirConsola('if ('+t2+'!='+this.obtenerFinCadena()+') goto '+L1+';\n')
            this.imprimirConsola('goto '+L2+';// Fin impresion\n');
            this.imprimirConsola(L1+':\n');
            this.imprimirConsola('printf("%c", (int)'+t2+'); // Imprimir caracter\n');
            this.imprimirConsola(t1+'='+t1+'+1; // siguiente caracter\n');
            this.imprimirConsola('goto '+L0+';\n');
            this.imprimirConsola(L2+':\n');
            this.imprimirConsola('return;\n');
            this.imprimirConsola('}\n');
        }

        this.NativaImpresionLn = function()
        {
            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            var t2 = this.generarTemporal();

            var L0 = this.generarEtiqueta();
            var L1 = this.generarEtiqueta();
            var L2 = this.generarEtiqueta();

            this.imprimirConsola('\n\n');
            this.imprimirConsola('void Nativa_ImpresionLn(){\n');
            this.imprimirConsola(t0+'=P+1;// Direccion parametro recibido\n');
            this.imprimirConsola(t1+'=stack[(int)'+t0+'];// Direccion de la cadena\n');
            this.imprimirConsola(L0+':\n');
            this.imprimirConsola(t2+'=heap[(int)'+t1+']; // Caracter actual\n');
            this.imprimirConsola('if ('+t2+'!='+this.obtenerFinCadena()+') goto '+L1+';\n')
            this.imprimirConsola('goto '+L2+';// Fin impresion\n');
            this.imprimirConsola(L1+':\n');
            this.imprimirConsola('printf("%c", (int)'+t2+'); // Imprimir caracter\n');
            this.imprimirConsola(t1+'='+t1+'+1; // siguiente caracter\n');
            this.imprimirConsola('goto '+L0+';\n');
            this.imprimirConsola(L2+':\n');
            this.imprimirConsola('printf("%c", 10); // Imprimir salto de linea\n');
            this.imprimirConsola('return;\n');
            this.imprimirConsola('}\n');
        }        
        //Nativa_Comparar_Cadenas     
        this.NativaCompararCadenas = function()
        {
            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            var t2 = this.generarTemporal();
            var t3 = this.generarTemporal();
            var t4 = this.generarTemporal();
            var t5 = this.generarTemporal();
            var t6 = this.generarTemporal();

            var L0 = this.generarEtiqueta();
            var L1 = this.generarEtiqueta();
            var L2 = this.generarEtiqueta();
            var L3 = this.generarEtiqueta();
            //var L4 = this.generarEtiqueta();
            var L5 = this.generarEtiqueta();
            var L6 = this.generarEtiqueta();            
            var L7 = this.generarEtiqueta();

            this.imprimirConsola('\n\n');
            this.imprimirConsola('void Nativa_Comparar_Cadenas(){\n');
            this.imprimirConsola(t0+'=P+1;// Direccion cadena \n');
            this.imprimirConsola(t1+'=stack[(int)'+t0+'];// Direccion de la cadena 1\n');
            this.imprimirConsola(t2+'=P+2;// Direccion cadena 2\n');
            this.imprimirConsola(t3+'=stack[(int)'+t2+'];// Direccion de la cadena 2\n');
            this.imprimirConsola(L0+':\n');
            this.imprimirConsola(t4+'=heap[(int)'+t1+'];// caracter i-esimo cadena 1\n');
            this.imprimirConsola('if('+t4+'=='+this.obtenerFinCadena()+') goto '+L1+'; //Fin de cadena 1;\n');
            this.imprimirConsola('goto '+L2+';\n');
            this.imprimirConsola(L2+':\n');
            this.imprimirConsola(t5+'=heap[(int)'+t3+'];// caracter i-esimo cadena 2\n');
            this.imprimirConsola('if('+t4+'=='+t5+') goto '+L3+'; //Verdadero, actualizar caracter;\n');
            this.imprimirConsola('goto '+L6+';// Caracteres diferentes. Falso\n');
            this.imprimirConsola(L3+':\n');
            this.imprimirConsola(t1+'='+t1+'+1;// caracter cadena 1\n');
            this.imprimirConsola(t3+'='+t3+'+1;// caracter cadena 2\n');
            this.imprimirConsola('goto '+L0+'; // Compracion\n');
            this.imprimirConsola(L1+':\n');
            this.imprimirConsola(t5+'=heap[(int)'+t3+'];// caracter i-esimo cadena 2\n');
            this.imprimirConsola('if('+t4+'=='+t5+') goto '+L5+'; //Verdadero, \n');
            this.imprimirConsola('goto '+L6+';\n');
            this.imprimirConsola(L6+':\n');
            this.imprimirConsola(t6+'=P+0;//Direccion retorno\n');
            this.imprimirConsola('stack[(int)'+t6+']=0; // Valor falso de retorno\n');
            this.imprimirConsola('goto '+L7+';\n');
            this.imprimirConsola(L5+':\n');
            this.imprimirConsola(t6+'=P+0;//Direccion retorno\n');
            this.imprimirConsola('stack[(int)'+t6+']=1; // Valor verdadero de retorno\n');
            this.imprimirConsola(L7+':\n');
            this.imprimirConsola('return;\n');
            this.imprimirConsola('}\n');
        }  


        this.NativaConcatenarCadenas = function()
        {

            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            var t2 = this.generarTemporal();
            var t3 = this.generarTemporal();
            var t4 = this.generarTemporal();
            var t5 = this.generarTemporal();
            var t6 = this.generarTemporal();
            var t7 = this.generarTemporal();
            var t8 = this.generarTemporal();
            var t9 = this.generarTemporal();
            var t10 =this.generarTemporal();
            var t11 =this.generarTemporal();
            var t12 =this.generarTemporal();       
            var L1 = this.generarEtiqueta();
            var L2 = this.generarEtiqueta();    
            var L3 = this.generarEtiqueta();
            var L4 = this.generarEtiqueta();   
            var L5 = this.generarEtiqueta();

            this.imprimirConsola('\n\n');
            this.imprimirConsola('void Nativa_Concatenar_Cadenas(){\n');
            this.imprimirConsola(t0+'=P+1;// Direccion primer cadena\n');
            this.imprimirConsola(t1+'=stack[(int)'+t0+'];// Referencia primer cadena\n');
            this.imprimirConsola(t2+'=P+2;// Direccion segunda cadena\n');
            this.imprimirConsola(t3+'=stack[(int)'+t2+'];// Referencia segunda cadena\n');
            this.imprimirConsola(t4+'=H;\n');
            this.imprimirConsola(t5+'='+t1+';\n');
            this.imprimirConsola(t6+'='+t3+';\n');
            this.imprimirConsola(L1+':\n');
            this.imprimirConsola(t7+'=heap[(int)'+t5+'];\n');
            this.imprimirConsola('if ('+t7+'!='+this.obtenerFinCadena()+') goto '+L2+'; \n');
            this.imprimirConsola('goto '+L3+';\n');
            this.imprimirConsola(L2+':\n');
            this.imprimirConsola(t8+'=H;\n');
            this.imprimirConsola('H=H+1;\n');
            this.imprimirConsola('heap[(int)'+t8+']='+t7+';\n');
            this.imprimirConsola(t5+'='+t5+'+1;\n');
            this.imprimirConsola('goto '+L1+';\n');
            this.imprimirConsola(L3+':\n');
            this.imprimirConsola(t9+'=heap[(int)'+t6+'];\n');
            this.imprimirConsola('if ('+t9+'!='+this.obtenerFinCadena()+'){ goto '+L4+'; }\n');
            this.imprimirConsola('goto '+L5+';\n');
            this.imprimirConsola(L4+':\n');
            this.imprimirConsola(t10+'=H;\n');
            this.imprimirConsola('H=H+1;\n');
            this.imprimirConsola('heap[(int)'+t10+']='+t9+';\n');
            this.imprimirConsola(t6+'='+t6+'+1;\n');
            this.imprimirConsola('goto '+L3+';\n');
            this.imprimirConsola(L5+':\n');
            this.imprimirConsola(t11+'=H;\n');
            this.imprimirConsola('H=H+1;\n');
            this.imprimirConsola('heap[(int)'+t11+']='+this.obtenerFinCadena()+';\n');
            this.imprimirConsola(t12+'=P+0;\n');
            this.imprimirConsola('stack[(int)'+t12+']='+t4+';\n');
            this.imprimirConsola('\n');
            this.imprimirConsola('return;\n');
            this.imprimirConsola('}\n');                        
        }

        this.NativaIntToString = function()
        {
            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            var t2 = this.generarTemporal();
            var t3 = this.generarTemporal();
            var t4 = this.generarTemporal();
            var t5 = this.generarTemporal();
            var t6 = this.generarTemporal();
            var t7 = this.generarTemporal();
            var t8 = this.generarTemporal();
            var t9 = this.generarTemporal();
            var t10 = this.generarTemporal();
            var t11 = this.generarTemporal();
            var t12 = this.generarTemporal();
            var t13 = this.generarTemporal();
            var t14 = this.generarTemporal();
            var t15 = this.generarTemporal(); 
            var t30 = this.generarTemporal(); 
        
            var L0 = this.generarEtiqueta();
            var L1 = this.generarEtiqueta();
            var L2 = this.generarEtiqueta();
            var L3 = this.generarEtiqueta();
            var L4 = this.generarEtiqueta();
            var L5 = this.generarEtiqueta();
            var L11 = this.generarEtiqueta();
            var L12 = this.generarEtiqueta();
            var L13 = this.generarEtiqueta();
            var L15 = this.generarEtiqueta();
            
            this.imprimirConsola('void IntToString_Nativa(){\n');
            this.imprimirConsola(t0+'=P+1;  // Direccion valor int\n');
            this.imprimirConsola(t1+'=stack[(int)'+t0+'];  // Valor int\n');
            this.imprimirConsola(t2+'=0;// Contador de caracteres\n');
            // Para manejo de negativos
            this.imprimirConsola(t30+'=0;//Por defecto es positivo\n');
            this.imprimirConsola('if('+t1+'<0) goto '+L11+';\n');
            this.imprimirConsola('goto '+L0+';\n');
            this.imprimirConsola(L11+':\n');
            this.imprimirConsola(t1+'='+t1+'*-1;\n');
            this.imprimirConsola(t30+'=1;//Significa negativo\n');
            // Para manejo de negativos
            this.imprimirConsola(L0+':\n');
            this.imprimirConsola('if('+t1+'>=10) goto '+L1+';\n');
            this.imprimirConsola('goto '+L2+';\n');
            this.imprimirConsola(L1+':\n');
            this.imprimirConsola(t3+'=(int)'+t1+'/10;\n');
            this.imprimirConsola(t4+'='+t3+'*10;\n');
            this.imprimirConsola(t5+'='+t1+'-'+t4+'; // Digito\n');
            this.imprimirConsola(t6+'='+t5+'+48;// Caracter digito\n');
            this.imprimirConsola(t1+'='+t4+'/10;\n');
            this.imprimirConsola(t7+'=H;\n');
            this.imprimirConsola('H=H+1;\n');
            this.imprimirConsola('heap[(int)'+t7+']='+t6+';\n');
            this.imprimirConsola(t2+'='+t2+'+1;// Aumento contador\n');
            this.imprimirConsola('goto '+L0+';\n');
            this.imprimirConsola(L2+':\n');
            this.imprimirConsola(t8+'='+t1+'+48; // Caracter digito\n');
            this.imprimirConsola(t9+'=H;\n');
            this.imprimirConsola('H=H+1;\n');
            this.imprimirConsola('heap[(int)'+t9+']='+t8+';\n');
            this.imprimirConsola(t2+'='+t2+'+1;// Aumento contador\n');
            this.imprimirConsola(t11+'=H; // Inicio de cadena ordenada\n');
            this.imprimirConsola(t10+'=H;\n');
            // Verificamos para agregar el simbolo de menos    
            this.imprimirConsola('if('+t30+'==1) goto '+L12+';//Agregamos el símbolo -\n');
            this.imprimirConsola('goto '+L13+';\n');
            this.imprimirConsola(L12+':\n');
            this.imprimirConsola(t15+'=H;//Direccion nuevo caracter\n');
            this.imprimirConsola('H=H+1;//Reservando espacio en memoria\n');
            this.imprimirConsola('heap[(int)'+t15+']=45;// -\n');
            this.imprimirConsola(t10+'=H;\n');
            this.imprimirConsola(L13+':\n');
            //Verificamos para agregar el simbolo de menos    
            this.imprimirConsola(L3+':\n');
            this.imprimirConsola('if('+t2+'>=0) goto '+ L4+';\n');
            this.imprimirConsola('goto '+L5+';\n');
            this.imprimirConsola(L4+':\n');
            this.imprimirConsola(t12+'=heap[(int)'+t11+']; // Caracter\n');
            this.imprimirConsola(t13+'=H;\n');
            this.imprimirConsola('H=H+1; // Reservando espacio\n');
            this.imprimirConsola('heap[(int)'+t13+']='+t12+';\n');
            this.imprimirConsola(t2+'='+t2+'-1;\n');
            this.imprimirConsola(t11+'='+t11+'-1;\n');
            this.imprimirConsola('goto '+L3+';\n');
            this.imprimirConsola(L5+':\n');
            this.imprimirConsola(t14+'=H;\n');
            this.imprimirConsola('H=H+1;\n');
            this.imprimirConsola('heap[(int)'+t14+']='+this.obtenerFinCadena()+';// Fin cadena\n');
            this.imprimirConsola(t15+'=P+0;\n');
            this.imprimirConsola('stack[(int)'+t15+']='+t10+';// H ---> inicio nueva cadena\n');
            this.imprimirConsola('return;\n');
            this.imprimirConsola('}\n');                         
        }  
        
        this.DoubleToString = function()
        {
            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            var t2 = this.generarTemporal();
            var t3 = this.generarTemporal();
            var t4 = this.generarTemporal();
            var t5 = this.generarTemporal();
            var t6 = this.generarTemporal();
            var t7 = this.generarTemporal();
            var t8 = this.generarTemporal();
            var t9 = this.generarTemporal();
            var t10 = this.generarTemporal();
            var t11 = this.generarTemporal();
            var t12 = this.generarTemporal();
            var t13 = this.generarTemporal();
            var t14 = this.generarTemporal();
            var t15 = this.generarTemporal();   
            var t16 = this.generarTemporal();
            var t17 = this.generarTemporal();
            var t18 = this.generarTemporal();   
            var t19 = this.generarTemporal();
            var t20 = this.generarTemporal();
            var t21 = this.generarTemporal();
            var t22 = this.generarTemporal();
            var t23 = this.generarTemporal();
            var t24 = this.generarTemporal();
            var t25 = this.generarTemporal();
            var t26 = this.generarTemporal();
            var t27 = this.generarTemporal();
            var t28 = this.generarTemporal();
            var t29 = this.generarTemporal();   
            var t30 = this.generarTemporal();
        
            var L0 = this.generarEtiqueta();
            var L1 = this.generarEtiqueta();
            var L2 = this.generarEtiqueta();
            var L3 = this.generarEtiqueta();
            var L4 = this.generarEtiqueta();
            var L5 = this.generarEtiqueta();
            var L6 = this.generarEtiqueta();
            var L7 = this.generarEtiqueta();
            var L8 = this.generarEtiqueta();
            var L9 = this.generarEtiqueta();
            var L10 = this.generarEtiqueta();
            var L11 = this.generarEtiqueta();
            var L12 = this.generarEtiqueta();
            var L13 = this.generarEtiqueta();

            
            this.imprimirConsola('void DoubleToString_Nativa(){\n');
            this.imprimirConsola(t0+'=P+1;\n');
            this.imprimirConsola(t1+'=stack[(int)'+t0+'];\n');
            this.imprimirConsola(t2+'=0;\n');
            // Para manejo de negativos
            this.imprimirConsola(t30+'=0;//Por defecto es positivo\n');    
            this.imprimirConsola('if('+t1+'<0) goto '+L11+';\n');
            this.imprimirConsola('goto '+L0+';\n');
            this.imprimirConsola(L11+':\n');
            this.imprimirConsola(t1+'='+t1+'*-1;\n');
            this.imprimirConsola(t30+'=1;//Significa negativo\n');
            // Para manejo de negativos
            this.imprimirConsola(L0+':\n');
            this.imprimirConsola(t3+'=(int)'+t1+';\n');
            this.imprimirConsola(t4+'='+t1+'-'+t3+'; // residuo decimal\n');
            this.imprimirConsola('if('+t4+' >0) goto '+L1+';\n');
            this.imprimirConsola('goto '+L2+';\n');
            this.imprimirConsola(L1+':\n');
            this.imprimirConsola(t1+'='+t1+'*10;\n');
            this.imprimirConsola(t2+'='+t2+'+1;\n');
            this.imprimirConsola('goto '+L0+';\n');
            this.imprimirConsola(L2+': // Se comienza a crear la cadena\n');
            this.imprimirConsola(t3+'=0;// Contador dígitos\n');
            this.imprimirConsola(L3+':\n');
            this.imprimirConsola('if('+t1+'>=10) goto '+L4+';\n');
            this.imprimirConsola('goto '+L5+';// Ya sólo queda un dígito\n');
            this.imprimirConsola(L4+':\n');
            this.imprimirConsola('if('+t3+'=='+t2+') goto '+L6+';\n');
            this.imprimirConsola('goto '+L7+';\n');
            this.imprimirConsola(L6+': // Ponemos el punto\n');
            this.imprimirConsola(t4+'=H;\n');
            this.imprimirConsola('H=H+1;\n');
            this.imprimirConsola('heap[(int)'+t4+']=46; // . \n');
            this.imprimirConsola(t3+'='+t3+'+1;\n');
            this.imprimirConsola('goto '+L3+';\n');
            this.imprimirConsola(L7+': // Normal\n');
            this.imprimirConsola(t5+'=(int)'+t1+'/10;\n');
            this.imprimirConsola(t6+'='+t5+'*10;\n');
            this.imprimirConsola(t7+'='+t1+'-'+t6+';// Digito\n');
            this.imprimirConsola(t8+'='+t7+'+48;// Caracter digito\n');
            this.imprimirConsola(t1+'='+t6+'/10;\n');
            this.imprimirConsola(t9+'=H;// Direccion nuevo caracter\n');
            this.imprimirConsola('H=H+1;// Reservando espacio\n');
            this.imprimirConsola('heap[(int)'+t9+']='+t8+';// Guardando caracter\n');
            this.imprimirConsola(t3+'='+t3+'+1;\n');
            this.imprimirConsola('goto '+L3+';\n');
            this.imprimirConsola(L5+': // Ultimo dígito\n');
            this.imprimirConsola(t10+'=H;// Direccion nuevo caracter\n');
            this.imprimirConsola('H=H+1;// Reservando espacio\n');
            this.imprimirConsola(t11+'='+t1+'+48;// Caracter digito\n');
            this.imprimirConsola('heap[(int)'+t10+']='+t11+';\n');
            this.imprimirConsola(t3+'='+t3+'+1;\n');
            // Verificamos para agregar el simbolo de menos    
            this.imprimirConsola('if('+t30+'==1) goto '+L12+';//Agregamos el símbolo -\n');
            this.imprimirConsola('goto '+L13+';\n');
            this.imprimirConsola(L12+':\n');
            this.imprimirConsola(t15+'=H;//Direccion nuevo caracter\n');
            this.imprimirConsola('H=H+1;//Reservando espacio en memoria\n');
            this.imprimirConsola('heap[(int)'+t15+']=45;// -\n');
            this.imprimirConsola(L13+':\n');   
            // Verificamos para agregar el simbolo de menos
            this.imprimirConsola(t10+'=H;// Inicio de cadena ordena\n');
            this.imprimirConsola(t15+'=H;// Inicio cadena\n');
            this.imprimirConsola(L8+':\n');
            this.imprimirConsola('if('+t3+'>=0) goto '+L9+';\n');
            this.imprimirConsola('goto '+L10+';\n');
            this.imprimirConsola(L9+':\n');
            this.imprimirConsola(t11+'=heap[(int)'+t10+'];\n');
            this.imprimirConsola(t12+'=H;\n');
            this.imprimirConsola('H=H+1;\n');
            this.imprimirConsola('heap[(int)'+t12+']='+t11+';\n');
            this.imprimirConsola(t3+'='+t3+'-1;\n');
            this.imprimirConsola(t10+'='+t10+'-1;\n');
            this.imprimirConsola('goto '+L8+';\n');
            this.imprimirConsola(L10+':\n');
            this.imprimirConsola(t13+'=H;\n');
            this.imprimirConsola('H=H+1;\n');
            this.imprimirConsola('heap[(int)'+t13+']='+this.obtenerFinCadena()+';\n');
            this.imprimirConsola(t14+'=P+0;//Direccion retorno\n');
            this.imprimirConsola('stack[(int)'+t14+']='+t15+';\n');       
            this.imprimirConsola('return;\n');
            this.imprimirConsola('}\n');
            this.imprimirConsola('\n');
        }

        this.CharToString = function()
        {
            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            var t2 = this.generarTemporal();
            this.imprimirConsola('void CharToString_Nativa(){\n');
            this.imprimirConsola(t0+'=P+1;//Direccion parametro\n');
            this.imprimirConsola(t1+'=stack[(int)'+t0+'];//valor caracter\n');
            this.imprimirConsola(t2+'=H;//Inicio cadena\n');
            this.imprimirConsola('heap[(int)H] = '+t1+';//Nueva cadena\n');
            this.imprimirConsola('H=H+1;//Reservar espacio\n');
            this.imprimirConsola('heap[(int)H] = '+this.obtenerFinCadena()+';//Fin de cadena\n');
            this.imprimirConsola('H=H+1;//Reservar espacio\n');            
            this.imprimirConsola('stack[(int)P]='+t2+';//Set valor return\n');
            this.imprimirConsola('return;\n');
            this.imprimirConsola('}\n');
            this.imprimirConsola('\n');            
        }

        this.BooleanToString = function()
        {
            var t0 = this.generarTemporal();
            var t1 = this.generarTemporal();
            var t2 = this.generarTemporal();
            var L1 = this.generarEtiqueta();
            var L2 = this.generarEtiqueta();

            this.imprimirConsola('void BooleanToString_Nativa(){\n');
            this.imprimirConsola(t0+'=P+1;//Direccion parametro\n');
            this.imprimirConsola(t1+'=stack[(int)'+t0+'];//valor caracter\n');
            this.imprimirConsola('if('+t1+'==1) goto '+L1+';\n');
            var NodoStringFalso = new ExpString(0,0,"false");
            var inicioCadenaFalso = NodoStringFalso.generar3D(null);
            this.imprimirConsola('stack[(int)P]='+inicioCadenaFalso+';//Set valor return\n');
            this.imprimirConsola('goto '+L2+';// Salida\n')
            this.imprimirConsola(L1+':\n');
            var NodoStringVerdadero = new ExpString(0,0,"true");
            var inicioCadenaVerdadero = NodoStringVerdadero.generar3D(null);
            this.imprimirConsola('stack[(int)P]='+inicioCadenaVerdadero+';//Set valor return\n');
            this.imprimirConsola(L2+':\n');
            this.imprimirConsola('return;\n');
            this.imprimirConsola('}\n');
            this.imprimirConsola('\n');               
        }



        this.tenemosEtiquetas = function(objecto)
        {
            return (objecto instanceof Igualdad) || (objecto instanceof Diferenciacion) || (objecto instanceof MayorQue) || (objecto instanceof MenorQue) || (objecto instanceof MenorIgual)
                    || (objecto instanceof MayorIgual) || (objecto instanceof AndLog) || (objecto instanceof OrLog)|| (objecto instanceof NotLog);
        }
    }
}


var Utils = new Utilidades();
