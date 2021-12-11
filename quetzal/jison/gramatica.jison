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
"??"                  %{ debugPrint('??');return '??'; %}
"&&"                  %{ debugPrint('&&');return '&&'; %}
"&"                   %{ debugPrint('&');return '&'; %}
"!"                   %{ debugPrint('!');return '!'; %}

//Eeradores aritmeticos
"*"                   %{ debugPrint('*');return '*'; %}
"/"                   %{ debugPrint('/');return '/'; %}
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
"boolean"   		 %{ debugPrint(yytext);return 'boolean'; %}
"char"			     %{ debugPrint(yytext);return 'tchar'; %}
"string"   			 %{ debugPrint(yytext);return 'tstring'; %}
"void"   			 %{ debugPrint(yytext);return 'tvoid'; %}
/*Funciones nativas*/
"pow"   			 %{ debugPrint(yytext);return 'pow'; %}
"sqrt"   			 %{ debugPrint(yytext);return 'sqrt'; %}
"sin"   			 %{ debugPrint(yytext);return 'sin'; %}
"cos"   			 %{ debugPrint(yytext);return 'cos'; %}
"tan"   			 %{ debugPrint(yytext);return 'tan'; %}
([a-zA-Z]|"_"|"$")([a-zA-Z]|[0-9]|"_"|"$")* %{ debugPrint(yytext); return 'id'; %}

<<EOF>>               return 'EOF'
.                    %{  Utils.registrarErrorLexico(yylloc.first_line, yylloc.first_column, yytext, 'Caracter no válido.'); return 'INVALIDO' %}
/lex

/* Eerator associations and precedence */
%left '&&' '||'
%left '==' '!=' '>' '>=' '<' '<='
%left '+' '-' '&'
%left '*' '/' '%'
%left '^'
%left '(' ')'
%left UMINUS
%left '=' 
%right '!'


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
			| error { 	
						Utils.registrarErrorSintactico(@1.first_line-1,@1.first_column-1, $1, $1);
						$$ = null;						
					}				
;


FUNCION : 		
		  TIPO id '(' LPARAMETROS ')' BLOQUE 
			{ $$ = new Funcion(@1.first_line-1,@1.first_column-1, $1, $2, $4,$6);}
		| TIPO id '('  ')' BLOQUE 
			{ $$ = new Funcion(@1.first_line-1,@1.first_column-1, $1, $2, null,$5);}			
;

LPARAMETROS: LPARAMETROS PARAMETRO 
			| PARAMETRO 
;

PARAMETRO : TIPO id { $$ = new Parametro(@1.first_line-1,@1.first_column-1, $1, $2);}
;

TIPO :    tint { $$ = new Tipo(TipoPrimitivo.INT);}
		| tdouble { $$ = new Tipo(TipoPrimitivo.DOUBLE);}
		| tstring { $$ = new Tipo(TipoPrimitivo.STRING);}
		| tchar { $$ = new Tipo(TipoPrimitivo.CHAR);}
		| tvoid { $$ = new Tipo(TipoPrimitivo.VOID);}
		;

BLOQUE: '{' INSTRUCCIONES '}' 
		{$$ = $2; }
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
	| LLAMADA {$$= $1;}
	;

LLAMADA : id '(' ')' { $$ = new Llamada(@1.first_line-1,@1.first_column-1, $1, null);}
;

