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

">="                  %{ debugPrint('>=');return '>='; %}
"<="                  %{ debugPrint('<=');return '<='; %}
"=="                  %{ debugPrint('==');return '=='; %}
"!="                  %{ debugPrint('!=');return '!='; %}
">"                   %{ debugPrint('>');return '>'; %}
"<"                   %{ debugPrint('<');return '<'; %}
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
"begin"                 %{ debugPrint(yytext);return 'Rbegin'; %}
"end"                 %{ debugPrint(yytext);return 'Rend'; %}


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

%start E

%% /* language grammar */


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
		| '[' E ']' {$$ = new Array; $$.push($2);}
		| '[' INICIOA ':' FINA ']' { $$= new Limites(@1.first_line-1,@1.first_column-1,$2,$4);} 
;

INDICE : '[' E ']' {$$ = new Array; $$.push($2);}
;

/*FRAGMENTOARRAY : '[' INICIOA ':' FINA ']' { $$= new Fragmento(@1.first_line-1,@1.first_column-1,$1,$3,$5);} 
;
*/
INICIOA: E {$$= $1;}
       | Rbegin{$$=null;} 
;
FINA : E {$$= $1;}
		| Rend {$$=null;}
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

ACTUALIZACION : AUMENTO{$$=$1;}
				|DECREMENTO {$$=$1;}
;

AUMENTO : id '++' {$$= new Aumento(@1.first_line-1,@1.first_column-1,new ExpVariable(@1.first_line-1,@1.first_column-1,$1));}
;
DECREMENTO : id '--' {$$= new Decremento(@1.first_line-1,@1.first_column-1,new ExpVariable(@1.first_line-1,@1.first_column-1,$1));}
;


