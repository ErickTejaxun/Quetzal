
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
[0-9]+				  return 'entero'
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
"println"		      %{ console.log(yytext);return 'println'; %}
"print"		      	  %{ console.log(yytext);return 'print'; %}
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


INICIO	:  INSTRUCCIONES EOF{		
	return $1; 
};

INSTRUCCIONES : 
              INSTRUCCIONES INSTRUCCION { $$ = $1; $$.registrarInstruccion($2);}
			| INSTRUCCION { $$ = new Bloque(@1.first_line-1,@1.first_column-1); $$.registrarInstruccion($1); }
;

INSTRUCCION:  PRINTLN { $$ = $1;}
			| PRINT { $$ = $1;}
;

PRINTLN : println '(' E ')' ';'
		{
			$$ = new Println(@1.first_line-1,@1.first_column-1, $3);			
		}
;


PRINT : print '(' E ')' ';'
		{
			$$ = new Print(@1.first_line-1,@1.first_column-1, $3);			
		}
;

E :  entero
	{
		$$ = new Entero(@1.first_line,@1.first_columna, parseInt($1));		
	}
;

/*
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
		$$ = Entero(@1.first_line,@1.first_columna, parseInt($1));
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
	| nulo
	{
		$$ = crearHoja("NULO",$1,@1.first_line,@1.first_columna);
	}
	;
*/
