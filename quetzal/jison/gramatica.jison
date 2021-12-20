%{
	var debugMode = false;
	function debugPrint(valor)
	{
		if(debugMode)
		{
			debugPrint(valor);
		}
	}
%}
%lex
%options case-sensitve

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
\'(\\.|[^'])\' 	      return 'caracter'


//Eeradores relacionales
">"                   %{ debugPrint('>');return '>'; %}
"<"                   %{ debugPrint('<');return '<'; %}
">="                  %{ debugPrint('>=');return '>='; %}
"<="                  %{ debugPrint('<=');return '<='; %}
"=="                  %{ debugPrint('==');return '=='; %}
"!="                  %{ debugPrint('!=');return '!='; %}

//Eeradores Logicos
"||"                  %{ debugPrint('||');return '||'; %}
"?"                  %{ debugPrint('?');return '?'; %}
"&&"                  %{ debugPrint('&&');return '&&'; %}
"&"                   %{ debugPrint('&');return '&'; %}
"!"                   %{ debugPrint('!');return '!'; %}

//Eeradores aritmeticos
"*"                   %{ debugPrint('*');return '*'; %}
"/"                   %{ debugPrint('/');return '/'; %}
"++"                   %{ debugPrint('++');return '++'; %}
"--"                   %{ debugPrint('--');return '--'; %}
"-"                   %{ debugPrint('-');return '-'; %}
"+"                   %{ debugPrint('+');return '+'; %}
"%"                   %{ debugPrint('%');return '%'; %}
"^"                   %{ debugPrint('^');return '^'; %}
"="                   %{ debugPrint('=');return '='; %}

//signos de agrupacion
"("                   %{ debugPrint('(');return '('; %}
")"                   %{ debugPrint(')');return ')'; %}
"{"                   %{ debugPrint('{');return '{'; %}
"}"                   %{ debugPrint('}');return '}'; %}
"["                   %{ debugPrint('[');return '['; %}
"]"                   %{ debugPrint(']');return ']'; %}

//otros signitos culeros
","                   %{ debugPrint(',');return ','; %}
"."                   %{ debugPrint('.');return '.'; %}
":"                   %{ debugPrint(':');return ':'; %}
";"                   %{ debugPrint(';');return ';'; %}

//palabras reservadas
"null"		          %{ debugPrint(yytext);return 'nulo'; %}
"true"		          %{ debugPrint(yytext);return 'verdadero'; %}
"false"		          %{ debugPrint(yytext);return 'falso'; %}
"println"		      %{ debugPrint(yytext);return 'println'; %}
"print"		      	  %{ debugPrint(yytext);return 'print'; %}
"typeof"		      %{ debugPrint(yytext);return 'tipode'; %}

//Tipos
"null"               %{ debugPrint(yytext);return 'tnull'; %}
"int"   			 %{ debugPrint(yytext);return 'tint'; %}
"double"   			 %{ debugPrint(yytext);return 'tdouble'; %}
"boolean"   		 %{ debugPrint(yytext);return 'tboolean'; %}
"char"			     %{ debugPrint(yytext);return 'tchar'; %}
"string"   			 %{ debugPrint(yytext);return 'tstring'; %}
"void"   			 %{ debugPrint(yytext);return 'tvoid'; %}
"return"   			 %{ debugPrint(yytext);return 'retorno'; %}
/*Funciones nativas*/
"pow"   			 %{ debugPrint(yytext);return 'pow'; %}
"sqrt"   			 %{ debugPrint(yytext);return 'sqrt'; %}
"sin"   			 %{ debugPrint(yytext);return 'sin'; %}
"cos"   			 %{ debugPrint(yytext);return 'cos'; %}
"tan"   			 %{ debugPrint(yytext);return 'tan'; %}
"caracterOfPosition" %{ debugPrint(yytext);return 'caracterposicion'; %}
"subString"          %{ debugPrint(yytext);return 'caracterporcion'; %}
"length"             %{ debugPrint(yytext);return 'caracterlength'; %}
"toUppercase"        %{ debugPrint(yytext);return 'caracterupper'; %}
"toLowercase"        %{ debugPrint(yytext);return 'caracterlower'; %}
"toString"           %{ debugPrint(yytext);return 'ToString'; %}
"toInt"              %{ debugPrint(yytext);return 'ToInt'; %}
"toDouble"           %{ debugPrint(yytext);return 'ToDouble'; %}
"parse"              %{ debugPrint(yytext);return 'parse'; %}

//instrucciones
"switch"             %{ debugPrint(yytext);return 'Rswitch'; %}
"case"               %{ debugPrint(yytext);return 'Rcase'; %}
"break"              %{ debugPrint(yytext);return 'Rbreak'; %}
"default"            %{ debugPrint(yytext);return 'Rdefault'; %}
"while"              %{ debugPrint(yytext);return 'Rwhile'; %}
"do"                 %{ debugPrint(yytext);return 'Rdo'; %}
"if"                 %{ debugPrint(yytext);return 'Rif'; %}
"else"               %{ debugPrint(yytext);return 'Relse'; %}
"for"                %{ debugPrint(yytext);return 'Rfor'; %}
"in"                 %{ debugPrint(yytext);return 'Rin'; %}


([a-zA-Z]|"_"|"$")([a-zA-Z]|[0-9]|"_"|"$")* %{ debugPrint(yytext); return 'id'; %}

<<EOF>>               return 'EOF'
.                    %{  Utils.registrarErrorLexico(yylloc.first_line, yylloc.first_column, yytext, 'Caracter no válido.'); return 'INVALIDO' %}
/lex

/* Eerator associations and precedence */
%left '?'
%left '&&' '||'
%left '==' '!=' '>' '>=' '<' '<='
%left '+' '-' '&'
%left '*' '/' '%'
%left '^'
%left '(' ')'
%left '[' ']'
%left UMINUS
%left '='
%right '!'
%left '.'
%left '++' '--'

/*
%left '?'
%left '+' '-'
%left '*' '/' '%'
%left '^'
%left '(' ')'
%left UMINUS
%left '||' '&&'
%left '=' 
%left '==' '!=' '>' '>=' '<' '<='
%left '+=' '-=' '*=' '/=' 
%left '++' '--'
%right '!'
*/



%error-verbose

%start INICIO

%% /* language grammar */

INICIO	:  INSTRUCCIONESG EOF{		
	return new Raiz($1.linea, $1.columna, $1); 
};

/*G de global*/
INSTRUCCIONESG: INSTRUCCIONESG  INSTRUCCIONG
				{ 
				  	$$ = $1; 
					$$.registrarInstruccion($2);
				}
				|INSTRUCCIONG
				{ 
					$$ = new Bloque(@1.first_line-1,@1.first_column-1); 
					if($1!=null){$$.registrarInstruccion($1);} // Si es nulo, viene de un error manejado en otras producciones.
				}
;

INSTRUCCIONG : 
			  FUNCION { $$ = $1;}
			| ASIGNACION  {$$ = $1;}
			| DECLARACION  {$$ = $1;}			  
			  
			  /*Declaracion y Struct*/
;

INSTRUCCIONES : 
              INSTRUCCIONES INSTRUCCION { 
				  	$$ = $1; 
					$$.registrarInstruccion($2);
				}
			| INSTRUCCION { 
							$$ = new Bloque(@1.first_line-1,@1.first_column-1); 
							if($1!=null){$$.registrarInstruccion($1);} // Si es nulo, viene de un error manejado en otras producciones.
						  }
;

INSTRUCCION:  PRINTLN { $$ = $1;}
			| PRINT { $$ = $1;}	
			| LLAMADA ';' {$$ =$1;}	
			| ASIGNACION  {$$ = $1;}
			| DECLARACION {$$ = $1;}
			| RETORNO {$$ = $1;}
			| IFINST {$$ = $1;}
			| SWITCHINST {$$ = $1;}
			| BREAKINST {$$ = $1;}
			| WHILEINST {$$ = $1;}			
			| DOWHILEINST {$$ = $1;}
			| DECLARACCIONARREGLO {$$ = $1;}
			| FORINST {$$=$1;}
			| error { 	
						Utils.registrarErrorSintactico(@1.first_line-1,@1.first_column-1, $1, $1);
						$$ = null;						
					}				
;


ASIGNACION : id '=' E ';' { $$ = new Asignacion(@1.first_line-1,@1.first_column-1,$1,$3); }
;


DECLARACION : TIPO LID  ';' { $$ = new Declaracion(@1.first_line-1,@1.first_column-1,$1,$2,null);}
			| TIPO LID '=' E ';' { $$ = new Declaracion(@1.first_line-1,@1.first_column-1,$1,$2,$4);}
;


LID : LID ',' id {$$  =$1; $$.push($3);}
	| id { $$ = new Array; $$.push($1); }
;

DECLARACCIONARREGLO : TIPO '[' ']' id '=' EXPARREGLO ';' {$$ = new DeclaracionArreglo(@1.first_line-1,@1.first_column-1,$1,$4,$6);}
;

EXPARREGLO: '[' LExprArreglo  ']' { $$ =$2;}
;

LExprArreglo : LExprArreglo ',' E {$$ = $1; $$.push($3);}
			  |	LExprArreglo ',' EXPARREGLO {$$ = $1; $$.push($3);}
			  | E {$$= new Array; $$.push($1);}
			  |	EXPARREGLO {$$= new Array; $$.push($1);}
;

RETORNO : retorno E ';'  { $$= new Retorno(@1.first_line-1,@1.first_column-1, $2);}
		 | retorno ';'  { $$= new Retorno(@1.first_line-1,@1.first_column-1, null);}
;

FUNCION : 		
		  TIPO id '(' LPARAMETROS ')' BLOQUE 
			{ $$ = new Funcion(@1.first_line-1,@1.first_column-1, $1, $2, $4,$6);}
		| TIPO id '('  ')' BLOQUE 
			{ $$ = new Funcion(@1.first_line-1,@1.first_column-1, $1, $2, new Array,$5);}			
;

LPARAMETROS: LPARAMETROS ',' PARAMETRO {$$ =$1; $$.push($3);}
			| PARAMETRO {$$ = new Array; $$.push($1);}
;

PARAMETRO : TIPO id { $$ = new Parametro(@1.first_line-1,@1.first_column-1, $1, $2);}
;

/*
TIPOVAR :  tint { $$ = new Tipo(TipoPrimitivo.INT);}
		| tdouble { $$ = new Tipo(TipoPrimitivo.DOUBLE);}
		| tstring { $$ = new Tipo(TipoPrimitivo.STRING);}
		| tchar { $$ = new Tipo(TipoPrimitivo.CHAR);}
		| id {$$ = new Tipo(TipoPrimitivo.STRUCT, $1);}
;
*/

TIPO :    tint { $$ = new Tipo(TipoPrimitivo.INT);}
		| tdouble { $$ = new Tipo(TipoPrimitivo.DOUBLE);}
		| tboolean { $$ = new Tipo(TipoPrimitivo.BOOL);}
		| tstring { $$ = new Tipo(TipoPrimitivo.STRING);}
		| tchar { $$ = new Tipo(TipoPrimitivo.CHAR);}
		| id {$$ = new Tipo(TipoPrimitivo.STRUCT, $1);}
		| tvoid { $$ = new Tipo(TipoPrimitivo.VOID);}
		;

BLOQUE: '{' INSTRUCCIONES '}' 
		{$$ = $2; }
		;

PRINTLN : println '(' LExpr ')' ';'
		{				
			var nodo_concatenar = null;
			if($3.length== 1)
			{
				nodo_concatenar = $3[0];
			}				
			else
			{
				var nodoTmp = $3[0]; // primer expresion
				var i = 1;
				for( i=1; i<$3.length; i++)
				{
					var nodo = $3[i];
					var nodoTmp = new Concatenar(nodoTmp.linea, nodoTmp.columna, nodoTmp, nodo);					
				}											
				nodo_concatenar = nodoTmp;
			}		
			$$ = new Println(@1.first_line-1,@1.first_column-1, nodo_concatenar);						
		}
		;


PRINT : print '(' LExpr ')' ';'
		{
			var nodo_concatenar = null;
			if($3.length== 1)
			{
				nodo_concatenar = $3[0];
			}				
			else
			{
				var nodoTmp = $3[0]; // primer expresion
				var i = 1;
				for( i=1; i<$3.length; i++)
				{
					var nodo = $3[i];
					var nodoTmp = new Concatenar(nodoTmp.linea, nodoTmp.columna, nodoTmp, nodo);					
				}											
				nodo_concatenar = nodoTmp;
			}		
			$$ = new Print(@1.first_line-1,@1.first_column-1, nodo_concatenar);			
		}
		;

E   : '(' E ')'
	{
		$$ = $2;		
	}	
    | E '+' E
	{
		$$ = new Suma(@1.first_line-1,@1.first_column-1,$1,$3);	
	}		
    | E '-' E
	{
		$$ = new Resta(@1.first_line-1,@1.first_column-1,$1,$3);
	}	
    | E '*' E
	{
		$$ = new Multiplicacion(@1.first_line-1,@1.first_column-1,$1,$3);
	}	
    | E '/' E
	{
		$$ = new Division(@1.first_line-1,@1.first_column-1,$1,$3);
	}
 	|E '%' E
	{
		$$ = new Modulo(@1.first_line-1,@1.first_column-1,$1,$3);
	}
	| pow '(' E ',' E ')'
	{
		$$ = new Potencia(@1.first_line-1,@1.first_column-1,$3, $5);
	}
	| sqrt '(' E ')'
	{
		$$ = new RaizCuadrada(@1.first_line-1,@1.first_column-1,$3);
	}	
	| sin '(' E ')'
	{
		$$ = new Seno(@1.first_line-1,@1.first_column-1,$3);
	}	
	| cos '(' E ')'
	{
		$$ = new Coseno(@1.first_line-1,@1.first_column-1,$3);
	}	
	| tan '(' E ')'
	{
		$$ = new Tangente(@1.first_line-1,@1.first_column-1,$3);
	}				
    | '-' E %prec UMINUS
	{
		$$ = new Menos(@1.first_line-1,@1.first_column-1,$2);
	}
    | E '>=' E
	{
		$$ = new MayorIgual(@1.first_line-1,@1.first_column-1,$1,$3);
	}
    | E '<=' E
	{
		$$ = new MenorIgual(@1.first_line-1,@1.first_column-1,$1,$3);
	}	
    | E '!=' E
	{
		$$ = new Diferenciacion(@1.first_line-1,@1.first_column-1,$1,$3);
	}
	
    | E '==' E
	{
		$$ = new Igualdad(@1.first_line-1,@1.first_column-1,$1,$3);
	}
    | E '>' E
	{
		$$ = new MayorQue(@1.first_line-1,@1.first_column-1,$1,$3);
	}
    | E '<' E
	{
		$$ = new MenorQue(@1.first_line-1,@1.first_column-1,$1,$3);
	}
    | E '||' E
	{
		$$ = new OrLog(@1.first_line-1,@1.first_column-1,$1,$3);
	}
    | E '&&' E
	{
		$$ = new AndLog(@1.first_line-1,@1.first_column-1,$1,$3);
	}
	| '!' E
	{
		$$ = new NotLog(@2.first_line,@2.first_column,$2);
	}
    | E '&' E
	{
		$$ = new Concatenar(@1.first_line-1,@1.first_column-1,$1,$3);
	}
    | E '^' E
	{
		$$ = new PotenciaString(@1.first_line-1,@1.first_column-1,$1,$3);
	}
    | E '?' E ':' E
	{
		$$ = new Ternario(@1.first_line-1,@1.first_column-1,$1,$3, $5);
	}			
    | entero
	{
		$$ = new Entero(@1.first_line-1,@1.first_column-1, parseInt($1));
	}	
	| double
	{
		$$ = new Double(@1.first_line-1,@1.first_column-1, parseFloat($1));
	}
    | id 
    {
		$$ = new ExpVariable(@1.first_line-1,@1.first_column-1,$1);
	}
	| texto
	{
		$$ = new ExpString(@1.first_line-1,@1.first_column-1,$1.substring(1,$1.length-1));
		
	}
    | caracter
	{
		$$ = new Caracter(@1.first_line,@1.first_column,$1.substring(1,$1.length-1));
	}
	| nulo
	{
		$$ = new Nulo(@1.first_line-1,@1.first_column-1);
	}
	| verdadero
	{
		$$ = new ExpBooleana(@1.first_line-1,@1.first_column-1, true);
	}
	| falso
	{
		$$ = new ExpBooleana(@1.first_line-1,@1.first_column-1, false);
	}	
	| tipode '(' E ')'
	{
		$$ = new TipoDe(@1.first_line-1,@1.first_column-1,$3);
	}
	| PARSEBOOL {$$= $1;}
	| PARSEDOUBLE {$$= $1;}
	| PARSEINT {$$= $1;}
	| NATIVATOINT {$$= $1;}
	| NATIVATOSTRING {$$= $1;}
	| NATIVATODOUBLE {$$= $1;}
	| LLAMADA {$$= $1;}
	| LOWERCADENA {$$= $1;}
	| UPPERCADENA {$$= $1;}
	| LENGTHCADENA {$$= $1;}
	| PORCIONCADENA {$$= $1;}
	| POSICIONCADENA {$$= $1;}
	| ACCESOARREGLO {$$ =$1;}
	| AUMENTO {$$ =$1;}
	| DECREMENTO{$$ =$1;}
	
	;



ACCESOARREGLO : id LINDICES {$$= new AccesoArreglo(@1.first_line-1,@1.first_column-1,new ExpVariable(@1.first_line-1,@1.first_column-1,$1),$2);}
;

LINDICES : LINDICES INDICE  {$$=$1; $$.push($2);}
		| INDICE {$$=$1;}
;

INDICE : '[' E ']' {$$ = new Array; $$.push($2);}
;

LLAMADA : id '(' ')' { $$ = new Llamada(@1.first_line-1,@1.first_column-1, $1, new Array);}
		| id '(' LExpr ')' { $$ = new Llamada(@1.first_line-1,@1.first_column-1, $1, $3);}
;

LExpr : LExpr ',' E {$$ = $1; $$.push($3);}
		| E {$$= new Array; $$.push($1);}
;

PARSEBOOL : tboolean '.' parse '(' E ')' { $$ = new ParseBool(@1.first_line-1,@1.first_column-1,$5);}
;


PARSEDOUBLE : tdouble '.' parse '(' E ')' { $$ = new ParseDouble(@1.first_line-1,@1.first_column-1,$5);}
;


PARSEINT : tint '.' parse '(' E ')' { $$ = new ParseInt(@1.first_line-1,@1.first_column-1,$5);}
;


NATIVATOINT : ToInt '(' E ')' { $$ = new NativaToInt(@1.first_line-1,@1.first_column-1,$3);}
;

NATIVATODOUBLE : ToDouble '(' E ')' { $$ = new NativaToDouble(@1.first_line-1,@1.first_column-1,$3);}
;

NATIVATOSTRING : tstring '(' E ')' { $$ = new NativaToString(@1.first_line-1,@1.first_column-1,$3);}
;

LOWERCADENA : E '.' caracterlower '(' ')' { $$ = new LowerCadena(@1.first_line-1,@1.first_column-1,$1);}
;

UPPERCADENA : E '.' caracterupper '(' ')' { $$ = new UpperCadena(@1.first_line-1,@1.first_column-1,$1);}
;

LENGTHCADENA : E '.' caracterlength '(' ')' { $$ = new LengthCadena(@1.first_line-1,@1.first_column-1,$1);}
;

PORCIONCADENA : E '.' caracterporcion '(' E ',' E ')' { $$ = new PorcionCadena(@1.first_line-1,@1.first_column-1,$1,$5,$7);}
;

POSICIONCADENA : E '.' caracterposicion '(' E ')' { $$ = new PosicionCadena(@1.first_line-1,@1.first_column-1,$1,$5);}
;


IFINST: 
      Rif '(' E ')' BLOQUE {$$= new Si(@1.first_line-1,@1.first_column-1,$3,$5, null);}
	| Rif '(' E ')' INSTRUCCION { 
									var BloqueInstruccion = new Bloque(@1.first_line-1,@1.first_column-1); 
									BloqueInstruccion.registrarInstruccion($5);
									$$= new Si(@1.first_line-1,@1.first_column-1,$3,BloqueInstruccion, null);
								}
	| Rif '(' E ')' BLOQUE ELSEIFINSTSS 
								{ 
									$$= new Si(@1.first_line-1,@1.first_column-1,$3,$5, $6);
								}	
	/*| Rif '(' E ')' BLOQUE Relse BLOQUE */
;

ELSEIFINSTSS : ELSEIFINST ELSEIFINSTSS  {$$= $1;  $$.sinosi = $2;}
			 | ELSEFINAL ELSEIFINSTSS  {$$= $1;  $$.sinosi = $2;}
             | ELSEIFINST   {$$= $1;}
			 | ELSEFINAL {$$= $1;}
;

ELSEFINAL : Relse BLOQUE {$$= new Si(@1.first_line-1,@1.first_column-1,new ExpBooleana(@1.first_line-1,@1.first_column-1,true),$2,null); }
;

ELSEIFINST : Relse Rif '(' E ')' BLOQUE {$$= new Si(@1.first_line-1,@1.first_column-1,$4,$6, null);}
;


SWITCHINST : Rswitch '(' E ')' '{' LISTACASE  DEFAULTINST '}' { $$= new SwitchInst(@1.first_line-1,@1.first_column-1,$3,$6,$7);}
;

LISTACASE: LISTACASE CASE {$$ =$1; $$.push($2);}
		| CASE {$$ = new Array; $$.push($1);}
;

CASE : Rcase E ':' INSTRUCCIONES { $$= new CaseInst(@1.first_line-1,@1.first_column-1,$2,$4);}
;

BREAKINST : Rbreak ';'  { $$= new BreakInst(@1.first_line-1,@1.first_column-1);}
;

DEFAULTINST: Rdefault ':' INSTRUCCIONES { $$= new DefaultInst(@1.first_line-1,@1.first_column-1,$3);}
            | /*empty*/
;

WHILEINST : Rwhile '(' E ')' BLOQUE { $$= new WhileInst(@1.first_line-1,@1.first_column-1,$3,$5);}
;

DOWHILEINST : Rdo BLOQUE Rwhile '(' E ')' ';' { $$= new DoWhileInst(@1.first_line-1,@1.first_column-1,$2,$5);}
;



FORINST : Rfor '(' FOROPCIONES  E ';' E ')' BLOQUE { $$= new ForInst(@1.first_line-1,@1.first_column-1,$3,$4,$6,$8);}
        | Rfor id Rin E BLOQUE   { $$= new For2Inst(@1.first_line-1,@1.first_column-1,$2,$4,$5);}
		| Rfor id Rin EXPARREGLO BLOQUE   { $$= new For2Inst(@1.first_line-1,@1.first_column-1,$2,$4,$5);}
		| Rfor id Rin id '[' E ':' E ']' BLOQUE   { $$= new For3Inst(@1.first_line-1,@1.first_column-1,$2, new ExpVariable(@1.first_line-1,@1.first_column-1,$4), new Limites(@1.first_line-1,@1.first_column-1,$6,$8),$10);}
;

FOROPCIONES : ASIGNACION {$$=$1;}
            | DECLARACION {$$=$1;}
;

ACTUALIZACION : AUMENTO{$$=$1;}
				|DECREMENTO {$$=$1;}
;

AUMENTO : id '++' {$$= new Aumento(@1.first_line-1,@1.first_column-1,new ExpVariable(@1.first_line-1,@1.first_column-1,$1));}
;
DECREMENTO : id '--' {$$= new Decremento(@1.first_line-1,@1.first_column-1,new ExpVariable(@1.first_line-1,@1.first_column-1,$1));}
;
/*
Expresiones que faltan agregar a la produccion para la instruccion for
i++
["perro", "gato", "tortuga"]
arr[2:4]
*/

