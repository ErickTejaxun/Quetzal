
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
\'(\\.|[^'])\' 	      return 'caracter'

//AUMENTO DECREMENTO
"++"                  %{ debugPrint('++');return '++'; %}
"--"                  %{ debugPrint('--');return '--'; %}
//asignacion y Eeracion
"+="                  %{ debugPrint('+=');return '+='; %}
"*="                  %{ debugPrint('*-');return '*-'; %}
"-="                  %{ debugPrint('-=');return '-='; %}
"/="                  %{ debugPrint('/=k');return '/='; %}
//Eeradores relacionales
">="                  %{ debugPrint('>=');return '>='; %}
"<="                  %{ debugPrint('<=');return '<='; %}
"=="                  %{ debugPrint('==');return '=='; %}
"!="                  %{ debugPrint('!=');return '!='; %}

//Eeradores Logicos
"||"                  %{ debugPrint('||');return '||'; %}
"??"                  %{ debugPrint('??');return '??'; %}
"&&"                  %{ debugPrint('&&');return '&&'; %}
"!"                   %{ debugPrint('!');return '!'; %}
//Eeradores aritmeticos
"*"                   %{ debugPrint('*');return '*'; %}
"->"                 %{ debugPrint('->');return 'flecha'; %} 
"/"                   %{ debugPrint('/');return '/'; %}
"-"                   %{ debugPrint('-');return '-'; %}
"+"                   %{ debugPrint('+');return '+'; %}
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

">"                   %{ debugPrint('>');return '>'; %}
"<"                   %{ debugPrint('<');return '<'; %}
","                   %{ debugPrint(',');return ','; %}
"."                   %{ debugPrint('.');return '.'; %}
					  
":"                   %{ debugPrint(':');return ':'; %}
";"                   %{ debugPrint(';');return ';'; %}


"null"		      %{ debugPrint(yytext);return 'nulo'; %}
"true"		      %{ debugPrint(yytext);return 'verdadero'; %}
"false"		      %{ debugPrint(yytext);return 'falso'; %}
"println"		      %{ debugPrint(yytext);return 'println'; %}
"print"		      	  %{ debugPrint(yytext);return 'print'; %}
"typeof"		      	  %{ debugPrint(yytext);return 'tipode'; %}

/*Tipos */
"int"   			 %{ debugPrint(yytext);return 'tint'; %}
"double"   			 %{ debugPrint(yytext);return 'tdouble'; %}
"string"   			 %{ debugPrint(yytext);return 'tstring'; %}
"char"			 %{ debugPrint(yytext);return 'tchar'; %}
"boolean"   		 %{ debugPrint(yytext);return 'boolean'; %}
"void"   			 %{ debugPrint(yytext);return 'tvoid'; %}
([a-zA-Z]|"_"|"$")([a-zA-Z]|[0-9]|"_"|"$")* %{ debugPrint(yytext); return 'id'; %}

<<EOF>>               return 'EOF'
.                  %{  Utils.registrarErrorLexico(yylloc.first_line, yylloc.first_column, yytext, 'Caracter no válido.'); return 'INVALIDO' %}
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
			| error { 	
						Utils.registrarErrorSintactico(@1.first_line-1,@1.first_column-1, $1, $1);
						$$ = null;						
					}				
;


FUNCION : tvoid id '(' LPARAMETROS ')' BLOQUE 
			{ $$ = new Funcion(@1.first_line-1,@1.first_column-1, null/*Tipo*/, $2, $4,$6);}
		| tvoid id '('  ')' BLOQUE 
			{ $$ = new Funcion(@1.first_line-1,@1.first_column-1, null/*Tipo*/, $2, null, $5);}			
;

LPARAMETROS: LPARAMETROS PARAMETRO 
			| PARAMETRO 
;

PARAMETRO : TIPO id { $$ = new Parametro(@1.first_line-1,@1.first_column-1, $1, $2);}
;

TIPO :  tint { $$ = new Tipo(TipoPrimitivo.INT);}
		| tdouble { $$ = new Tipo(TipoPrimitivo.DOUBLE);}
		| tstring { $$ = new Tipo(TipoPrimitivo.STRING);}
		| tchar { $$ = new Tipo(TipoPrimitivo.CHAR);}
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
		$$ = $1;		
	}	
    | E '+' E
	{
		$$ = new Suma(@1.first_line-1,@1.first_column-1,$1,$3);	
	}	
	/*
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
    | E '^' E
	{
		$$ = new Potencia(@1.first_line-1,@1.first_column-1,$1,$3);
	}
    | '-' E %prec UMINUS
	{
		$$ = new Menos(@1.first_line-1,@1.first_column-1,$2);
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
	}*/
    | entero
	{
		$$ = new Entero(@1.first_line,@1.first_column, parseInt($1));		
	}	
	| double
	{
		$$ = new Double(@1.first_line,@1.first_column, parseFloat($1));
	}
    | id 
    {
		$$ = new ExpVariable(@1.first_line,@1.first_column,$1);
	}
	| texto
	{
		$$ = new ExpString(@1.first_line,@1.first_column,$1);
		
	}
    | caracter
	{
		$$ = new ExpString(@1.first_line,@1.first_column,$1);
	}
	| nulo
	{
		$$ = new Nulo(@1.first_line,@1.first_column);
	}
	| verdadero
	{
		$$ = new ExpBooleana(@1.first_line,@1.first_column, true);
	}
	| falso
	{
		$$ = new ExpBooleana(@1.first_line,@1.first_column, false);
	}	
	| tipode '(' E ')'
	{
		$$ = new TipoDe(@1.first_line,@1.first_column,$3);
	}
	;

