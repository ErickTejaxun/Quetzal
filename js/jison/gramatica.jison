/* lexical grammar */
%{


%}
%lex
%options case-insensitive

%%

\s+                   /* skip whitespace */
\n+                   /* skip whitespace */
\t+                   /* skip whitespace */
//comentarios
"/*"[^'*']*"*/"         return;
"//"[^\r\n]*[^\r\n]     return;
"/*"[^"*"]~"*/"         return;

[0-9]+"."[0-9]+	 	  return 'double'
[0-9]+				  return 'numero'
\"(\\.|[^"])*\" 	  return 'texto'
\'(\\.|[^'])*\' 	  return 'textosimple'

//AUMENTO DECREMENTO
"++"                  %{ console.log('++');return '++'; %}
"--"                  %{ console.log('--');return '--'; %}
//asignacion y Eeracion
"+="                  %{ console.log('+=');return '+='; %}
"*="                  %{ console.log('*-');return '*-'; %}
"-="                  %{ console.log('-=');return '-='; %}
"/="                  %{ console.log('/=k');return '/='; %}
//Eeradores relacionales
">="                  %{ console.log('>=');return '>='; %}
"<="                  %{ console.log('<=');return '<='; %}
"=="                  %{ console.log('==');return '=='; %}
"!="                  %{ console.log('!=');return '!='; %}

//Eeradores Logicos
"||"                  %{ console.log('||');return '||'; %}
"??"                  %{ console.log('??');return '??'; %}
"&&"                  %{ console.log('&&');return '&&'; %}
"!"                   %{ console.log('!');return '!'; %}
//Eeradores aritmeticos
"*"                   %{ console.log('*');return '*'; %}
"->"                 %{ console.log('->');return 'flecha'; %} 
"/"                   %{ console.log('/');return '/'; %}
"-"                   %{ console.log('-');return '-'; %}
"+"                   %{ console.log('+');return '+'; %}
"^"                   %{ console.log('^');return '^'; %}
"="                   %{ console.log('=');return '='; %}
//signos de agrupacion
"("                   %{ console.log('(');return '('; %}
")"                   %{ console.log(')');return ')'; %}
"{"                   %{ console.log('{');return '{'; %}
"}"                   %{ console.log('}');return '}'; %}
"["                   %{ console.log('[');return '['; %}
"]"                   %{ console.log(']');return ']'; %}
//otros signitos culeros

">"                   %{ console.log('>');return '>'; %}
"<"                   %{ console.log('<');return '<'; %}
","                   %{ console.log(',');return ','; %}
"."                   %{ console.log('.');return '.'; %}
					  
":"                   %{ console.log(':');return ':'; %}
";"                   %{ console.log(';');return ';'; %}
//PALABRAS RESERVADAS
"entero"              %{ console.log(yytext);return 'entero'; %}
"booleano"            %{ console.log(yytext);return 'booleano'; %}
"decimal"             %{ console.log(yytext);return 'decimal'; %}
"caracter"            %{ console.log(yytext);return 'caracter'; %}
"tamanio"             %{ console.log(yytext);return 'tamanio'; %}
"concatenar"          %{ console.log(yytext);return 'concatenar'; %}
"convertiracadena"    %{ console.log(yytext);return 'convertiracadena'; %}
"convertiraentero"    %{ console.log(yytext);return 'convertiraentero'; %}
"imprimir"		      %{ console.log(yytext);return 'imprimir'; %}
//CLASE
"clase"     		  %{ console.log(yytext);return 'clase'; %}
"este"			      %{ console.log(yytext);return 'este'; %}
//VISIBILIDAD
"publico"       	  %{ console.log(yytext);return 'publico'; %}
"protegido"      	  %{ console.log(yytext);return 'protegido'; %}
"privado"    		  %{ console.log(yytext);return 'privado'; %}
//HERENCIA
"hereda_de"           %{ console.log(yytext);return 'hereda_de'; %}
//FUNCIONES Y PROCEDIMIENTOS
"vacio"               %{ console.log(yytext);return 'vacio'; %}
"retorno"             %{ console.log(yytext);return 'retorno'; %}
"funcion"		      %{ console.log(yytext);return 'funcion'; %}
//SOBREESCRIBIR
"@sobrescribir"       %{ console.log(yytext);return 'sobrescribir'; %}
//PROCEDIMIENTO PRINCIPAL
"principal"           %{ console.log(yytext);return 'principal'; %}
//PUNTEROS
"crearpuntero"        %{ console.log(yytext);return 'crearPuntero'; %}
"reservarmemoria"     %{ console.log(yytext);return 'reservarMemoria'; %}
"consultartamanio"    %{ console.log(yytext);return 'consultartamanio'; %}
"destruirPuntero"     %{ console.log(yytext);return 'destruirPuntero'; %}


"obtenerDireccion"    %{ console.log(yytext);return 'obtenerDireccion'; %}
//SENTENCIAS
"importar"			  %{ console.log(yytext);return 'importar'; %}
"nuevo"               %{ console.log(yytext);return 'nuevo'; %}
"'\0'"                %{ console.log(yytext);return 'nulo'; %}
"nada"				  %{ console.log(yytext);return 'nada'; %}
//ROMPER CICLOS
"romper"              %{ console.log(yytext);return 'romper'; %}
"continuar"           %{ console.log(yytext);return 'continuar'; %}
//ESTRUCTURAS
"estructura"          %{ console.log(yytext);return 'estructura'; %}
"lista"               %{ console.log(yytext);return 'lista'; %}
"insertar"            %{ console.log(yytext);return 'insertar'; %}
"obtener"			  %{ console.log(yytext);return 'obtener'; %}
"buscar"			  %{ console.log(yytext);return 'buscar'; %}
//PILA -- COLA
"pila"		      	  %{ console.log(yytext);return 'pila'; %}
"apilar"		      %{ console.log(yytext);return 'apilar'; %}
"desapilar"		      %{ console.log(yytext);return 'desapilar'; %}
"cola"		      	  %{ console.log(yytext);return 'cola'; %}
"encolar"		      %{ console.log(yytext);return 'encolar'; %}
"desencolar"	      %{ console.log(yytext);return 'desencolar'; %}
//SENTENCIAS DE CONTROL
"si"                  %{ console.log(yytext);return 'si'; %}
"es_verdadero"        %{ console.log(yytext);return 'esverdadero'; %}
"es_falso"            %{ console.log(yytext);return 'esfalso'; %}
"fin-si"		      %{ console.log(yytext);return 'finsi'; %}
"evaluar_si"          %{ console.log(yytext);return 'evaluarsi'; %}
"es_igual_a"          %{ console.log(yytext);return 'esiguala'; %}
"repetir_mientras"    %{ console.log(yytext);return 'repetirmientras'; %}
"hacer"               %{ console.log(yytext);return 'hacer'; %}
"mientras"            %{ console.log(yytext);return 'mientras'; %}
"ciclo_doble_condicion"       %{ console.log(yytext);return 'ciclodoble'; %}
"repetir"		      %{ console.log(yytext);return 'repetir'; %}
"hasta_que"		      %{ console.log(yytext);return 'hastaque'; %}
"repetir_contando"    %{ console.log(yytext);return 'repetircontando'; %}
"variable"            %{ console.log(yytext);return 'variable'; %}
"desde"               %{ console.log(yytext);return 'desde'; %}
"hasta"               %{ console.log(yytext);return 'hasta'; %}
"enciclar"            %{ console.log(yytext);return 'enciclar'; %}
"contador"            %{ console.log(yytext);return 'contador'; %}
"defecto"             %{ console.log(yytext);return 'defecto'; %}
"true"                %{ console.log(yytext);return 'verdadero'; %}
"false"               %{ console.log(yytext);return 'falso'; %}
//ENTRADA Y LECTURA DE DATOS
"leer_teclado"        %{ console.log(yytext);return 'leerteclado'; %}
([a-zA-Z]|"_"|"$")([a-zA-Z]|[0-9]|"_"|"$")* %{ console.log(yytext);
					  return 'id'; %}

<<EOF>>               return 'EOF'
.                     return 'INVALIDO'
/lex

/* Eerator associations and precedence */


%left '+' '-'
%left '*' '/'
%left '^'
%left '(' ')'
%left '->'
%left UMINUS
%left '||' '??'
%left '=' 
%left '==' '!=' '>' '>=' '<' '<='
%left '+=' '-=' '*=' '/=' 
%left '&&'
%left '++' '--'
%right '!'


%error-verbose

%start INICIO

%% /* language grammar */


INICIO	:  CUERPO EOF{
	console.log($1+ "//Ultima linea");
	reiniciar();
	return $1; 
};

CUERPO : CUERPOINICIO{
		/*var nuevo = crearNodo("Cuerpo",1,1);
		nuevo = $1;
		$$ = nuevo;
		*/
		$$=$1;
	}	
	|
	{
		$$=crearNodo("Cuerpo",1,1);
	}
	;


CUERPOINICIO: IMPORTAR CLASES {
		var nuevo = crearNodo("INICIO",@1.first_line,@1.first_column);
		nuevo.add($1)
		nuevo.add($2)
		$$ = nuevo;
		//$$.add($2);
	}
	| CLASES
	{
		$$=crearNodo("INICIO",@1.first_line,@1.first_column);
		$$.add($1);

	}
	;

IMPORTAR : IMPORTAR importar '(' E ')' ';'
	{				
		$$.add($4);
	}
	|	importar '(' E ')' ';'{
		$$=crearNodo("IMPORTAR",@1.first_line,@1.first_column);
		$$.add($3);
	}
	;


CLASES	: CLASES CLASE {
			$1.add($2);
			$$ = $1;
		}
	| CLASE{
			$$=crearNodo("CLASES",@1.first_line,@1.first_column);
            $$.add($1);
	}
	;


CLASE : VISIBILIDAD clase id hereda_de id '{' LISTA_INSTRUCCIONES '}'{
		$$=crearNodo("CLASE",@2.first_line,@2.first_column);
        var id1=crearHoja("ID",$3,@3.first_line,@3.first_column);
		var id2=crearHoja("ID",$5,@5.first_line,@5.first_column);
		$$.add($1);
		$$.add(id1);
		$$.add(id2);
		$$.add($7);
		}
	| VISIBILIDAD clase id hereda_de id '{'  '}'
		{
		$$=crearNodo("CLASE",@2.first_line,@2.first_column);
        var id1=crearHoja("ID",$3,@3.first_line,@3.first_column);
		var id2=crearHoja("ID",$5,@5.first_line,@5.first_column);
		$$.add($1);
		$$.add(id1);
		$$.add(id2);
		}
	| VISIBILIDAD clase id '{' LISTA_INSTRUCCIONES '}'
		{
		$$=crearNodo("CLASE",@2.first_line,@2.first_column);
        var id1=crearHoja("ID",$3,@3.first_line,@3.first_column);
        $$.add($1);
		$$.add(id1);
		$$.add($5);
		}
	| VISIBILIDAD clase id '{'  '}'
	{
		$$=crearNodo("CLASE",@2.first_line,@2.first_column);

        var id1=crearHoja("ID",$3,@3.first_line,@3.first_column);
        $$.add($1);
		$$.add(id1);
		} 
	| clase id hereda_de id '{' LISTA_INSTRUCCIONES '}'
		{
		$$=crearNodo("CLASE",@1.first_line,@1.first_column);

        var id1=crearHoja("ID",$2,@2.first_line,@2.first_column);
		var id2=crearHoja("ID",$4,@4.first_line,@4.first_column);
		$$.add(id1);
		$$.add(id2);
		$$.add($6);
		}
	| clase id hereda_de id '{'  '}' 
		{
		$$=crearNodo("CLASE",@1.first_line,@1.first_column);

		var id1=crearHoja("ID",$2,@2.first_line,@2.first_column);
		var id2=crearHoja("ID",$4,@4.first_line,@4.first_column);
		$$.add(id1);
		$$.add(id2);
		}
	| clase id '{' LISTA_INSTRUCCIONES '}' 
		{
		$$=crearNodo("CLASE",@1.first_line,@1.first_column);

        var id1=crearHoja("ID",$2,@2.first_line,@2.first_column);

		$$.add(id1);
		$$.add($4);
		}
	| clase id '{''}'
		{
		$$=crearNodo("CLASE",@1.first_line,@1.first_column);

        var id1=crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(id1);
		}
	;


LISTA_INSTRUCCIONES	: LISTA_INSTRUCCIONES INSTRUCCION
	{
		$$=crearNodo("INSTRUCCIONES",@1.first_line,@1.first_column);
		$$.add($2);
	}
	| INSTRUCCION{
		$$=crearNodo("INSTRUCCIONES",@1.first_line,@1.first_column);
		$$.add($1);
	}
	;

INSTRUCCION : PRINCIPAL
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| ESTRUCTURA
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| METODOS_ESTRUCTURAS
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| PUNTEROS
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| SI
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| SWITCH
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| CICLO
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| FOR
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| TECLADO
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| DECLARACION
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| ASIGNACION
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| CONSTRUCTOR
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| CONCATENAR
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| IMPRIMIR
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| PROCEDIMIENTO
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| LLAMADA ';'
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| romper ';'
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| romper E ';'
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($2);
	}
	| continuar ';'
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}
	| retorno E ';'
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($2);
	}
	| retorno  NEW ';'
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($2);
	}	
	| retorno ';'
	{
		$$=crearNodo("INSTRUCCION",@1.first_line,@1.first_column);
		$$.add($1);
	}	
	;




PRINCIPAL	: principal '(' ')' '{'  LISTA_INSTRUCCIONES '}'
		{
			$$=crearHoja("MET_PRINCIPAL",$1,@1.first_line,@1.first_column);
			$$.add($5);
		}
		|	principal '(' ')' '{' '}'
		{
			$$=crearHoja("MET_PRINCIPAL",$1,@1.first_line,@1.first_column);
		}
;

	VISIBILIDAD	: publico
	{
		$$= crearHoja("VISIBILIDAD",$1,@1.first_line,@1.first_column);
		/*
		hojita = crearNodo("Publico",@1.first_line,@1.first_column);
		$$.add(hojita);
		*/
	} 
	| privado
	{
		$$= crearHoja("VISIBILIDAD",$1,@1.first_line,@1.first_column);
		/*
		hojita = crearNodo("Privado",@1.first_line,@1.first_column);
		$$.add(hojita);
		*/
	}
	| protegido
	{
		$$= crearHoja("VISIBILIDAD",$1,@1.first_line,@1.first_column);
		/*
		hojita = crearNodo("Protegido",@1.first_line,@1.first_column);
		$$.add(hojita);
		*/
	}
	;

METODOS_ESTRUCTURAS	: id '.' FUNCION_ESTRUCTURAS ';' 
	{
		$$= crearNodo("ESTRUCT_PRIM",@1.first_line,@1.first_column);

		var ident = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(ident);
		$$.add($3);
	}
	;


FUNCION_ESTRUCTURAS  : insertar '(' E ')' 
	{
		$$= crearNodo("INSERTAR",@1.first_line,@1.first_column);
		$$.add($3);
	}
	|obtener '(' E ')'
	{
		$$= crearNodo("OBTENER",@1.first_line,@1.first_column);
		$$.add($3);
	}
	|buscar '(' E ')'
	{
		$$= crearNodo("BUSCAR",@1.first_line,@1.first_column);
		$$.add($3);
	}
	|apilar '(' E ')'
	{
		$$= crearNodo("APILAR",@1.first_line,@1.first_column);
		$$.add($3);
	}
	|desapilar  '(' ')'
	{
		$$= crearNodo("DESAPILAR",@1.first_line,@1.first_column);
	}
	|encolar '(' E ')'
	{
		$$= crearNodo("ENCOLAR",@1.first_line,@1.first_column);
		$$.add($3);
	}
	|desencolar '(' ')'
	{
		$$= crearNodo("DESENCOLAR",@1.first_line,@1.first_column);
	}
	;




TIPO: entero 
	{
		$$=crearHoja("ENTERO",$1,@1.first_line,@1.first_column);
	}
	| decimal
	{
		$$=crearHoja("DECIMAL",$1,@1.first_line,@1.first_column);
	}
	| booleano
	{
		$$=crearHoja("BOOLEANO",$1,@1.first_line,@1.first_column);
	}
	| cadena
	{
		$$=crearHoja("CADENA",$1,@1.first_line,@1.first_column);
	}
	| caracter
	{
		$$=crearHoja("VACIO",$1,@1.first_line,@1.first_column);
	}
	| vacio
	{
		$$=crearHoja("VACIO",$1,@1.first_line,@1.first_column);
	}
	| funcion
	{
		$$=crearHoja("FUNCION",$1,@1.first_line,@1.first_column);
	}
	| lista 
	{
		$$=crearHoja("LISTA",$1,@1.first_line,@1.first_column);
	}
	| pila
	{
		$$=crearHoja("PILA",$1,@1.first_line,@1.first_column);
	}
	| cola
	{
		$$=crearHoja("COLA",$1,@1.first_line,@1.first_column);
	}
	;




DECLARACION :  VISIBILIDAD TIPO id DIMENSION ASIGNAR ';' 
	{
		$$= crearNodo("DECLARACION_VECTOR",@1.first_line,@1.first_column);
		$$.add($1);
		$$.add($2);
		var ident = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(ident);
		$$.add($4);
		$$.add($5);
	}
	| TIPO id DIMENSION ASIGNAR ';' 
	{
		$$= crearNodo("DECLARACION_VECTOR",@1.first_line,@1.first_column);
		$$.add($1);
		var ident = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(ident);
		$$.add($3);
		$$.add($4);
	}
	| VISIBILIDAD TIPO id ASIGNAR ';'
	{
		$$= crearNodo("DECLARACION_VAR",@1.first_line,@1.first_column);
		$$.add($1);
		$$.add($2);
		var ident = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(ident);
		$$.add($4);
	}
	| VISIBILIDAD id id ASIGNAR ';'
	{
		$$= crearNodo("DECLARACION_OBJETO",@1.first_line,@1.first_column);
		$$.add($1);
		var ident = crearHoja("ID",$2,@2.first_line,@2.first_column);
		var ident2 = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(ident);
		$$.add(ident2);
		$$.add($4);
	}
	| TIPO id ASIGNAR ';'
	{
		$$= crearNodo("DECLARACION_VAR",@1.first_line,@1.first_column);
		$$.add($1);
		var ident = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(ident);
		$$.add($3);
	}
	| id id ASIGNAR ';'
	{
		$$= crearNodo("DECLARACION_OBJETO",@1.first_line,@1.first_column);
		var ident = crearHoja("ID",$1,@1.first_line,@1.first_column);
		var ident2 = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(ident);
		$$.add(ident2);
		$$.add($3);
	}
	;




	
ASIGNAR	: '=' E 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		$$.add($2);
	}
	|'=' '{' ARRAY '}' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		$$.add($3);
	}
	|'=' nuevo id '(' ')'
	{
		$$ = crearNodo("ASIGNACION",null,null);
		nuevito = crearNodo("Nuevo",@2.first_line,@2.first_column );
		ident2 = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(nuevito);
		$$.add(ident2);

	}
	|'=' nuevo id '(' VALOR ')'
	{
		$$ = crearNodo("ASIGNACION",null,null);
		nuevito = crearNodo("Nuevo",@2.first_line,@2.first_column );
		ident2 = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(nuevito);
		$$.add(ident2);
		$$.add($5);
		
	}
	|'=' nuevo TIPO '(' ')'
	{
		$$ = crearNodo("ASIGNACION",null,null);
		nuevito = crearNodo("Nuevo",@2.first_line,@2.first_column );
		$$.add(nuevito);
		$$.add($3);

	}
	|'=' nuevo TIPO '(' TIPO ')'
	{
		$$ = crearNodo("ASIGNACION",null,null);
		nuevito = crearNodo("Nuevo",@2.first_line,@2.first_column );
		$$.add($3);
		$$.add($5);

	}
	|'=' nuevo TIPO '(' id ')'
	{
		$$ = crearNodo("ASIGNACION",null,null);
		nuevito = crearNodo("Nuevo",@2.first_line,@2.first_column );
		ident2 = crearHoja("ID",$5,@5.first_line,@5.first_column);
		$$.add(nuevito);
		$$.add($3);
		$$.add(ident2);
	}
	|
	;

ARRAY : ARRAY ',' '{' ARRAY '}' 
	{
		$$ = crearNodo("ARREGLO",null,null);
		$$.add($1);
		$$.add($4);

	}
    | ARRAY ',' E
	{
		$$ = crearNodo("ARREGLO",null,null);
		$$.add($1);
		$$.add($3);
	}
    | E
	{
		$$ = crearNodo("ARREGLO",null,null);
		$$.add($1);
	}
    |'{' ARRAY '}' 
	{
		$$ = crearNodo("ARREGLO",null,null);
		$$.add($2);
	}
	;


ASIGNACION	: id ASIGNAR ';' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		//$$.add(nuevito);
		$$.add($2);
		
	}
	| id DIMENSION ASIGNAR ';'
	{
		$$ = crearNodo("ASIGNACION",null,null);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
		$$.add($2);
		$$.add($3);
	} 
	| este '.' id ASIGNAR ';'
	{
		$$ = crearNodo("ASIGNACION",null,null);
		este = crearNodo("este",@1.first_line,@1.first_column);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(este);
		$$.add(identificador);
		$$.add($4);
	} 
	| este '.' id INSTANCIA ASIGNAR ';' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		este = crearNodo("este",@1.first_line,@1.first_column);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(este);
		$$.add(identificador);
		$$.add($4);
		$$.add($5);
	}
	| este flecha id ASIGNAR ';' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		este = crearNodo("este",@1.first_line,@1.first_column);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(este);
		$$.add(identificador);
		$$.add($4);
	}
	| este flecha id INSTANCIA ASIGNAR ';'
	{
		$$ = crearNodo("ASIGNACION",null,null);
		este = crearNodo("este",@1.first_line,@1.first_column);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(este);
		$$.add(identificador);
		$$.add($4);
		$$.add($5);
	} 
	| id INSTANCIA ASIGNAR ';' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		este = crearNodo("este",@1.first_line,@1.first_column);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(este);
		$$.add(identificador);
		$$.add($4);
	}
	| id INSTANCIA '++' ';' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
		$$.add($2);
	}
	| id INSTANCIA '--' ';' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
		$$.add($2);
	}
	| id '++' ';' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
	}
	| id '--' ';' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
	}
	| id ASIGNACION_EXPR E ';' 
	{
		$$ = crearNodo("ASIGNACION",null,null);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
		$$.add($2);
		$$.add($3);
	}
	;

ASIGNACION_EXPR : '+=' 
	{
		var asignacion = crearNodo("Asignacion", $1.first_line-1, $1.first_column-1  );
		asignacion.add($1);
		$$= asignacion;
		//$$.add($1);
	}
    | '-=' 
	{
		var asignacion = crearNodo("Asignacion", $1.first_line-1, $1.first_column-1  );
		asignacion.add($1);
		$$= asignacion;
		//$$.add($1);
	}
    | '*=' 
	{
		var asignacion = crearNodo("Asignacion", $1.first_line-1, $1.first_column-1  );
		asignacion.add($1);
		$$= asignacion;
		//$$.add($1);
	}
    | '/=' 
	{
		var asignacion = crearNodo("Asignacion", $1.first_line-1, $1.first_column-1  );
		asignacion.add($1);
		$$= asignacion;
		//$$.add($1);
	}
	;


PROCEDIMIENTO : sobrescribir METODO
	{	

		nodoSobreEs = crearNodo("SobreEscribir",@1.first_line,@1.first_column);
		$$.add(nodoSobreEs);
		$$.add($2);
	}
	|METODO 
	{
		$$ = crearNodo("PROCEDIMIENTO",@1.first_line,@1.first_column);
		$$.add($1);
	}
	;


METODO : VISIBILIDAD TIPO id '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '	}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		$$.add($2);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
		$$.add($5);
		$$.add($8);
	}
	| VISIBILIDAD TIPO id '(' ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		$$.add($2);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
		$$.add($7);
	}
	| TIPO id '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add($4);
		$$.add($7);
	}
	| TIPO id '(' ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add($6);
	}
	| VISIBILIDAD id id '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		identificador2 = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
		$$.add(identificador2);
		$$.add($5);
		$$.add($8);
	}
	| VISIBILIDAD id id '(' ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		identificador2 = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
		$$.add(identificador2);
		$$.add($5);
		$$.add($8);
	}
	| id id '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		identificador2 = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add(identificador2);
		$$.add($4);
		$$.add($7);
	}
	| id id '(' ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		identificador2 = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add(identificador2);
		$$.add($6);
	}
	| VISIBILIDAD TIPO id DIMENSION '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		$$.add($2);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
		$$.add($4);
		$$.add($6);
		$$.add($9);
	}
	| VISIBILIDAD TIPO id DIMENSION '(' ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		$$.add($2);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
		$$.add($4);
		$$.add($8);
	}
	| TIPO id DIMENSION '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add($3);
		$$.add($5);
		$$.add($8);
	}
	| TIPO id DIMENSION '(' ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("METODO",@1.first_line,@1.first_column);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add($3);
		$$.add($7);
	}
	;

PARAMETROS 	: PARAMETROS ',' PARAMETRO
	{
		var Parametro = crearNodo("PARAMETROS", $1.first_line-1, $1.first_column-1  );
		Parametro.add($3);
		$$= Parametro;
		//$$.add($3);
	}
	| PARAMETRO
	{
		$$ = crearNodo("PARAMETROS",@1.first_line-1,@1.first_column-1);
		$$.add($1);
	}
	;


PARAMETRO 	: TIPO id
	{
		$$ = crearNodo("PARAMETRO",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
	}
	| id id
	{
		$$ = crearNodo("PARAMETRO",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		identificador2 = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add(identificador2);
	}
	| id id DIMEN
	{
		$$ = crearNodo("PARAMETRO",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		identificador2 = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add(identificador2);
		$$.add($3);
	}
	| TIPO id DIMEN
	{
		$$ = crearNodo("PARAMETRO",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add($3);
	}
	
	;

CONSTRUCTOR : VISIBILIDAD id '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("CONSTRUCTOR",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add($4);
		$$.add($7);
	}
	| VISIBILIDAD id '(' PARAMETROS ')' '{' '}'
	{
		$$ = crearNodo("CONSTRUCTOR",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add($4);
	}
	| id '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("CONSTRUCTOR",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
		$$.add($3);
		$$.add($6);
	}
	| id '(' PARAMETROS ')' '{'  '}'
	{
		$$ = crearNodo("CONSTRUCTOR",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
		$$.add($3);
	}
	| VISIBILIDAD id '(' ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("CONSTRUCTOR",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add($6);
	}
	| VISIBILIDAD id '(' ')' '{'  '}'
	{
		$$ = crearNodo("CONSTRUCTOR",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
	}
	| id '(' ')' '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("CONSTRUCTOR",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
		$$.add($5);
	}
	| id '(' ')' '{'  '}'
	{
		$$ = crearNodo("CONSTRUCTOR",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
	}
	;


LLAMADA	: id '(' VALOR ')'
	{
		$$ = crearNodo("LLAMADA",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
		$$.add($3);
	}
	|id '(' ')'  
	{
		$$ = crearNodo("LLAMADA",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
	}
	|este '.' LLAMADA 
	{
		$$ = crearNodo("LLAMADA",@1.first_line-1,@1.first_column-1);
		ESTEE = crearNodo("este",@1.first_line,@1.first_column);
		$$.add(ESTEE);
		$$.add($3);
	}
	|este flecha LLAMADA
	{
		$$ = crearNodo("LLAMADA",@1.first_line-1,@1.first_column-1);
		ESTEE = crearNodo("este",@1.first_line,@1.first_column);
		$$.add(ESTEE);
		$$.add($3);
	}
	;

VALOR 	: VALOR ',' E
		{
			var valor = crearNodo("VALOR", $1.first_line-1, $1.first_column-1  );
			valor.add($1);
			valor.add($3);
			$$= valor;
		
//			$$.add($1);
//			$$.add($3);
		}
		| E
		{
			$$ = crearNodo("VALOR",@1.first_line-1,@1.first_column-1);
			$$.add($1);
		}
		;

INSTANCIA	: INSTANCIA '.' LLAMADA
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
	| INSTANCIA flecha LLAMADA
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
	| INSTANCIA '.' id
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
	}
	| INSTANCIA flecha	 id
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
	}
	| INSTANCIA '.' id DIMENSION
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
		$$.add($4)
	}
	| INSTANCIA flecha id DIMENSION
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		identificador = crearHoja("ID",$3,@3.first_line,@3.first_column);
		$$.add(identificador);
		$$.add($4);
	}
	|'.' LLAMADA
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		$$.add($2);
	}
	| flecha LLAMADA
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		$$.add($2);
		
	}
	|'.' id 
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		
	}
	|flecha id 
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
	}
	|'.' id DIMENSION
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add($3);
	}
	|flecha id DIMENSION
	{
		$$ = crearNodo("INSTANCIA",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$2,@2.first_line,@2.first_column);
		$$.add(identificador);
		$$.add($3);
	}
	;


FUNCIONES : id '.' tamanio
	{
		$$ = crearNodo("FUNCIONES",@1.first_line-1,@1.first_column-1);
		identificador = crearHoja("ID",$1,@1.first_line,@1.first_column);
		$$.add(identificador);
		tamanio = $$ = crearNodo("tamanio",@3.first_line,@3.first_column);
		$$.add(tamanio);
	}
	|convertiracadena '(' E ')'
	{
		$$ = crearNodo("FUNCIONES",@1.first_line-1,@1.first_column-1);
		convertir = $$ = crearNodo("convertirCadena",@1.first_line,@1.first_column);
		$$.add(convertir);
		$$.add($3);
	}
	|convertiraentero '(' E ')'
	{
		$$ = crearNodo("FUNCIONES",@1.first_line-1,@1.first_column-1);
		convertir = $$ = crearNodo("convertirEntero",@1.first_line,@1.first_column);
		$$.add(convertir);
		$$.add($3);
	}
	;

CONCATENAR : concatenar '(' E ',' E ',' E ')'
	{
		$$ = crearNodo("CONCATENAR",@1.first_line-1,@1.first_column-1);
		$$.add($3);
		$$.add($5);
		$$.add($7);
	}
	| concatenar '(' E ',' E ')' 
	{
		$$ = crearNodo("CONCATENAR",@1.first_line-1,@1.first_column-1);
		$$.add($3);
		$$.add($5);
	}
	;

IMPRIMIR : imprimir '(' E ')' ';'
		{
			$$ = crearNodo("IMPRIMIR",@1.first_line-1,@1.first_column-1);
			$$.add($3);
		}
;

ESTRUCTURA : estructura id '[' LISTA_INSTRUCCIONES ']' ';'
		{
			$$ = crearNodo("Estructura",@1.first_line-1,@1.first_column-1);
			identificador = ("ID", $2, @2.first_line, @2.first_column);
			$$.add(identificador);
			$$.add($4);
		}
		;

PUNTEROS : crearPuntero '(' TIPO ',' id ')' ASIGNAR ';'
	{
		$$ = crearNodo("PUNTEROS",@1.first_line-1,@1.first_column-1);
		crearPuntero = ("CrearPuntero", $1, @1.first_line, @1.first_column);
		identificador = ("ID", $5, @5.first_line, @5.first_column);
		$$.add(crearPuntero);
		$$.add($3);
		$$.add(identificador);
		$$.add($7);
	}
	|crearPuntero '(' id ',' id ')' ASIGNAR ';'
	{
		$$ = crearNodo("PUNTEROS",@1.first_line-1,@1.first_column-1);
		crearPuntero = ("CrearPuntero", $1, @1.first_line, @1.first_column);
		identificador = ("ID", $3, @3.first_line, @3.first_column);
		identificador2 = ("ID", $5, @5.first_line, @5.first_column);
		$$.add(crearPuntero);
		$$.add(identificador);
		$$.add(identificador2);
		$$.add($7);
	}
	|destruirPuntero '(' id ')' ';'
	{
		$$ = crearNodo("PUNTEROS",@1.first_line-1,@1.first_column-1);
		destruiPuntero = ("destruirPuntero", $1, @1.first_line, @1.first_column);
		identificador = ("ID", $3, @3.first_line, @3.first_column);
		$$.add(destruiPuntero);
		$$.add(identificador);
	}
	;

MEMORIA : obtenerDireccion '(' id ')' 
	{
		$$ = crearNodo("MEMORIA",@1.first_line-1,@1.first_column-1);
		obtenerDireccion = ("ObtenerDireccion", $1, @1.first_line, @1.first_column);
		identificador = ("ID", $3, @3.first_line, @3.first_column);
		$$.add(obtenerDireccion);
		$$.add(identificador);	
	}
	|reservarMemoria '(' E ')'
	{
		$$ = crearNodo("MEMORIA",@1.first_line-1,@1.first_column-1);
		reservarMemoria = ("reservarMemoria", $1, @1.first_line, @1.first_column);
		$$.add(reservarMemoria);
		$$.add($3);
	
	} 
	|consultarTamanio '(' E ')' 
	{
		$$ = crearNodo("MEMORIA",@1.first_line-1,@1.first_column-1);
		consultarTamanio = ("consultarTamanio", $1, @1.first_line, @1.first_column);
		$$.add(consultarTamanio);
		$$.add($3);
	}	
	;


SI	: si '(' E ')' CUERPO_IF finsi 
	{
		$$ = crearNodo("SI",@1.first_line-1,@1.first_column-1);
		$$.add($3);
		$$.add($5);
	}
	;

CUERPO_IF : esverdadero '{' LISTA_INSTRUCCIONES '}' esfalso '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("CUERPO_IF",@1.first_line-1,@1.first_column-1);
		condicionV = crearNodo("EsVerdaderoF",@1.first_line,@1.first_column);
		$$.add(condicionv);
		$$.add($3);
		condicionF = crearNodo("EsVerdaderoF",@5.first_line,@5.first_column);
		$$.add(condicionF);
		$$.add($7);
	}
	| esverdadero '{'  '}' esfalso '{'  '}'
	{
		$$ = crearNodo("CUERPO_IF",@1.first_line-1,@1.first_column-1);
		condicionV = crearNodo("EsVerdaderoF",@1.first_line,@1.first_column);
		$$.add(condicionv);
		condicionF = crearNodo("EsVerdaderoF",@4.first_line,@4.first_column);
		$$.add(condicionF);
	}
	| esfalso '{' LISTA_INSTRUCCIONES '}' esverdadero '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("CUERPO_IF",@1.first_line-1,@1.first_column-1);
		condicionF = crearNodo("esFalso",@1.first_line,@1.first_column);
		condicionV = crearNodo("esVerdadero",@5.first_line,@5.first_column);
		$$.add(condicionF);
		$$.add($3);
		$$.add(condicionV);
		$$.add($7);
	}
	| esfalso '{'  '}' esverdadero '{'  '}' 
	{
		$$ = crearNodo("CUERPO_IF",@1.first_line-1,@1.first_column-1);
		condicionF = crearNodo("EsFalso",@1.first_line,@1.first_column);
		$$.add(condicionF);
		condicionV = crearNodo("EsVerdadero",@4.first_line,@4.first_column);
		$$.add(condicionV);
	}
	| esverdadero '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("CUERPO_IF",@1.first_line-1,@1.first_column-1);
		condicionV = crearNodo("esVerdadero",@1.first_line,@1.first_column);
		$$.add(condicionV);
		$$.add($3);
	}
	| esverdadero '{'  '}'
	{
		$$ = crearNodo("CUERPO_IF",@1.first_line-1,@1.first_column-1);
		condicionV = crearNodo("esVerdadero",@1.first_line,@1.first_column);
		$$.add(condicionV);
	}
	 ;

SWITCH	: evaluarsi '(' E ')' '{' CASO '}'
	{
		$$ = crearNodo("SUITCH",@1.first_line-1,@1.first_column-1);
		$$.add($3);
		$$.add($6);
	}
	| evaluarsi '(' E ')' '{' DEFECTO '}'
	{
		$$ = crearNodo("SUITCH",@1.first_line-1,@1.first_column-1);
		$$.add($3);
		$$.add($6);
	}
	| evaluarsi '(' E ')' '{' CASO DEFECTO '}'
	{
		$$ = crearNodo("SUITCH",@1.first_line-1,@1.first_column-1);
		$$.add($3);
		$$.add($6);
		$$.add($7);
	}
	;


CASO 	: CASO esiguala E ':' LISTA_INSTRUCCIONES
	{
		$$ = crearNodo("CASO",@1.first_line-1,@1.first_column-1);
		$$.add($3);
		$$.add($5);
	}
	| CASO esiguala E ':' 
	{
		$$ = crearNodo("CASO",@1.first_line-1,@1.first_column-1);
		$$.add($3);
	}
	| esiguala E ':' LISTA_INSTRUCCIONES
	{
		$$ = crearNodo("CASO",@1.first_line-1,@1.first_column-1);
		$$.add($2);
		$$.add($4);
	}
	| esiguala E ':' 
	{
		$$ = crearNodo("CASO",@1.first_line-1,@1.first_column-1);
		$$.add($2);
	}
	;

DEFECTO	: defecto ':' LISTA_INSTRUCCIONES
	{
		{
		$$ = crearNodo("DEFECTO",@1.first_line-1,@1.first_column-1);
		$$.add($3);
	}
	}
	;

CICLO 	: repetirmientras '(' E ')' '{' LISTA_INSTRUCCIONES'}'
	{
		
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("repetirMientras",@1.first_line,@1.first_column);
		$$.add(nodito);
		$$.add($3);
		$$.add($6);
	
	}
	| repetirmientras '(' E ')' '{' '}'
	{
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("repetirMientras",@1.first_line,@1.first_column);
		$$.add(nodito);
		$$.add($3);
	
	}
	| hacer '{' LISTA_INSTRUCCIONES'}' mientras '(' E ')' ';'
	{
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("Hacer",@1.first_line,@1.first_column);
		$$.add(nodito);
		nodito2 = crearNodo("Mientras",@5.first_line,@5.first_column);
		$$.add(nodito2);
		$$.add($7);
	
	}
	| hacer '{' '}' mientras '(' E ')' ';'
	{
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("Hacer",@1.first_line,@1.first_column);
		$$.add(nodito);
		nodito2 = crearNodo("Mientras",@4.first_line,@4.first_column);
		$$.add(nodito2)
		$$.add($6);
	
	}
	| repetir '{' LISTA_INSTRUCCIONES'}' hastaque '(' E ')' ';'
	{
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("Repetir",@1.first_line,@1.first_column);
		$$.add(nodito);
		$$.add($3);
		nodito2 = crearNodo("hastaQue",@5.first_line,@5.first_column);
		$$.add(nodito2);
		$$.add($6);
	}
	| repetir '{' '}' hastaque '(' E ')' ';'
	{
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("Repetir",@1.first_line,@1.first_column);
		$$.add(nodito);
		nodito2 = crearNodo("hastaQue",@5.first_line,@5.first_column);
		$$.add(2);
		$$.add($6);
	}
	| ciclodoble '(' E "," E ')' '{' LISTA_INSTRUCCIONES'}'
	{
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("cicloDoble",@1.first_line,@1.first_column);
		$$.add(nodito);
		$$.add($3);
		$$.add($5);
		$$.add($8);
	}
	| ciclodoble '(' E "," E ')' '{' '}'
	{
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("cicloDoble",@1.first_line,@1.first_column);
		$$.add(nodito);
		$$.add($3);
		$$.add($5);
	}
	| enciclar id '{' LISTA_INSTRUCCIONES '}'
	{
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("enciclar",@1.first_line,@1.first_column);
		$$.add(nodito);
		nodito2 = crearHoja("ID", $2, @2.first_linem, @2.first_column);
		$$.add(nodito2);
		$$.add($4);
	}
	| enciclar id '{'  '}'
	{
		$$ = crearNodo("CICLO",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("enciclar",@1.first_line,@1.first_column);
		$$.add(1);
		nodito2 = crearHoja("ID", $2, @2.first_linem, @2.first_column);
		$$.add(nodito2);
	}
	;



FOR 	: repetircontando '(' variable ':' id ';' desde ':' E ';' hasta ':' E ')' '{' LISTA_INSTRUCCIONES'}'
	{
		$$ = crearNodo("FOR",@1.first_line-1,@1.first_column-1);
		nodito = crearNodo("repetircontando",@1.first_line,@1.first_column);
		$$.add(1);
		nodito2 = crearHoja("ID", $5, @5.first_linem, @5.first_column);
		$$.add(nodito2);
		nodito3 = crearNodo("desde",@7.first_line,@7.first_column);
		$$.add(nodito3);
		$$.add($9);
		nodito4 = crearNodo("hasta",@11.first_line,@11.first_column);
		$$.add(nodito4);
		$$.add($13);
		$$.add($16);
	}
	| repetircontando '(' variable ':' id ';' desde ':' E ';' hasta ':' E ')' '{' '}'
	{
		$$ = crearNodo("FOR",@1.first_line-1,@1.first_column-1);
		nodito1 = crearNodo("repetircontando",@1.first_line,@1.first_column);
		$$.add(nodito1);
		nodito2 = crearHoja("ID", $5, @5.first_linem, @5.first_column);
		$$.add(nodito2);
		nodito3 = crearNodo("desde",@7.first_line,@7.first_column);
		$$.add(nodito3);
		$$.add($9);
		nodito4 = crearNodo("hasta",@11.first_line,@11.first_column);
		$$.add(nodito4);
		$$.add($13);
	}
	| contador '(' E ')' '{' LISTA_INSTRUCCIONES'}'
	{
		
		$$ = crearNodo("FOR",@1.first_line-1,@1.first_column-1);
		nodito1 = crearNodo("contador",@1.first_line,@1.first_column);
		$$.add(nodito1);
		$$.add($3);
		$$.add($6);
	}
	| contador '(' E ')' '{' '}'
	{
		$$ = crearNodo("FOR",@1.first_line-1,@1.first_column-1);
		nodito1 = crearNodo("contador",@1.first_line,@1.first_column);
		$$.add(nodito1);
		
		$$.add($3);
	}
	;


TECLADO : leerteclado '(' E "," id ')' ';'
	{
		$$ = crearNodo("LEER_TECLADO",@1.first_line-1,@1.first_column-1);
		$$.add($3);
		nodito2 = crearHoja("ID", $5, @5.first_linem, @5.first_column);
		$$.add(2);
	}
;

E   : '(' E ')'
	{
		$$ = crearHoja("EXPRESION",@1.first_line,@1.first_column-1);
		$$.add($2);
	}
    | E '+' E
	{
		$$ = crearNodo("+",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '-' E
	{
		$$ = crearNodo("-",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '*' E
	{
		$$ = crearNodo("*",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '/' E
	{
		$$ = crearNodo("/",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '^' E
	{
		$$ = crearNodo("^",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '!'
	{
		$$ = crearNodo("!",@2.first_line-1,@2.first_column-1);
		$$.add($1);
	}
    | '-' E %prec UMINUS
	{
		$$ = crearNodo("-",@1.first_line-1,@1.first_column-1);
		$$.add($1);
	}
    | E '>=' E
	{
		$$ = crearNodo(">=",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '<=' E
	{
		$$ = crearNodo("<=",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '==' E
	{
		$$ = crearNodo("==",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '!=' E
	{
		$$ = crearNodo("!=",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '>' E
	{
		$$ = crearNodo(">",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '<' E
	{
		$$ = crearNodo("<",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '||' E
	{
		$$ = crearNodo("||",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '&&' E
	{
		$$ = crearNodo("&&",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
    | E '??' E
	{
		$$ = crearNodo("??",@1.first_line-1,@1.first_column-1);
		$$.add($1);
		$$.add($3);
	}
	| verdadero
	{
		$$ = crearNodo("Verdadero",@1.first_line,@1.first_column);
	}
	| falso
	{
		$$ = crearNodo("falso",@1.first_line,@1.first_column);
	}
	| E '++'
	{
		$$ = crearNodo("Expresion",@1.first_line,@1.first_column);
		$$.add($1);
		$$.add($2);
	}
	| E '--'
	{
		$$ = crearNodo("Expresion",@1.first_line,@1.first_column);
		$$.add($1);
		$$.add($2);
	}
    | numero
	{
		$$ = crearHoja("NUMERO",$1,@1.first_line,@1.first_columna);
	}	
	| double
	{
		$$ = crearHoja("DOUBLE",$1,@1.first_line,@1.first_columna);
	}
    | id 
    {
		$$ = crearHoja("ID",$1,@1.first_line,@1.first_columna);
	}
	| texto
	{
		$$ = crearHoja("TEXTO",$1,@1.first_line,@1.first_columna);
		
	}
    | textosimple
	{
		$$ = crearHoja("TEXTO",$1,@1.first_line,@1.first_columna);
	}
	| nada
	{
		$$ = crearHoja("TEXTO",$1,@1.first_line,@1.first_columna);
	}
	| nulo
	{
		$$ = crearHoja("NULO",$1,@1.first_line,@1.first_columna);
	}
	| este '.' id 
	{
		$$ = crearNodo("ESTE",@1.first_line,@1.first_column);		
		$$.add(crearHoja("NULO",$3,@3.first_line,@3.first_columna));		
		
	}
	| este '.' id INSTANCIA
 	{
		$$ = crearNodo("ESTE",@1.first_line,@1.first_column);		
		$$.add(crearHoja("NULO",$3,@3.first_line,@3.first_columna));
		$$.add($4);
	}
	| FUNCIONES
	{
		var Expresion = crearNodo("Expresion",@1.first_line,@1.first_column);
		Expresion.add($1);
		$$ = Expresion;
		//$$.add($1);
	}
	| LLAMADA 
	{
		var Expresion = crearNodo("Expresion",@1.first_line,@1.first_column);
		Expresion.add($1);
		$$ = Expresion;
		//$$.add($1);
	}
	| CONCATENAR
	{
		var Expresion = crearNodo("Expresion",@1.first_line,@1.first_column);
		Expresion.add($1);
		$$ = Expresion;
		//$$.add($1);
	}
	| MEMORIA 
	{
		var Expresion = crearNodo("Expresion",@1.first_line,@1.first_column);
		Expresion.add($1);
		$$ = Expresion;
		//$$.add($1);
	}
	| METODOS_ESTRUCTURAS 
	{
		var Expresion = crearNodo("Expresion",@1.first_line,@1.first_column);
		Expresion.add($1);
		$$ = Expresion;
		//$$.add($1);
	}
	| id INSTANCIA 
	{
		var Expresion = crearNodo("Expresion",@1.first_line,@1.first_column);
		Expresion.add($1);
		Expresion.add($2);
		$$ = Expresion;
		/*$$.add($1);
		$$.add($2);*/
	}
	;

DIMENSION	: DIMENSION '[' E ']'
	{	var Expresion = crearNodo("DIMENSION",@1.first_line,@1.first_column);
		Expresion.add($3);
		$$ = Expresion;
	//	$$.add($3);
	}
	| '[' E ']'
	{
		$$ = crearNodo("Dimension",@1.first_line,@1.first_column);
		$$.add($2);
	}	
	;


