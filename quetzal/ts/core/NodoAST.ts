/* Area de utilidades */
class Utilidades
{
    listaErrores : Array<error>;
    consolaSalida : Array<string>;
    constructor()
    {
        this.listaErrores = new Array<error>();
        this.consolaSalida = new Array<string>();
    }

    /* Area de manejo de errores. */
    registrarErrorLexico(linea: bigint, columna:bigint, id:string, descripcion:string, archivo:string)
    {
        var nuevoError = new error(linea, columna, id, descripcion, archivo);
        nuevoError.setTipoLexico();
        this.listaErrores.push(nuevoError);
    }

    registrarErrorSintactico(linea: bigint, columna:bigint, id:string, descripcion:string, archivo:string)
    {
        var nuevoError = new error(linea, columna, id, descripcion, archivo);
        nuevoError.setTipoSintactico();
        this.listaErrores.push(nuevoError);
    }
    
    registrarErrorSemantico(linea: bigint, columna:bigint, id:string, descripcion:string, archivo:string)
    {
        var nuevoError = new error(linea, columna, id, descripcion, archivo);
        nuevoError.setTipoSemantico();
        this.listaErrores.push(nuevoError);
    }   
    
    /* Area de manejo de consola de salida */

    imprimirEnConsola(cadena : string)
    {
        this.consolaSalida.push(cadena);
    }

    /* Area de iniciacion */
    iniciacion()
    {
        this.consolaSalida = new Array<string>();
        this.listaErrores = new Array<error>();
    }
}




var global_utilidades = new Utilidades();


//áre de manejo de errores. 
enum TipoError
{
	LEXICO = 1,
	SINTACTICO = 2,
	SEMANTICO = 3
}


class error
{
	linea: bigint;
	columna: bigint;
	id: string;
	descripcion: string;	
	archivo: string;
	timestamp: string;
	tipo: TipoError;
	
	constructor(linea: bigint, columna:bigint, id:string, descripcion:string, archivo:string)
	{
		this.linea = linea;
		this.columna = columna;
		this.id = id;
		this.descripcion = descripcion;
		this.archivo = archivo;
		this.tipo = TipoError.SINTACTICO;
	}

	setTipoLexico()
	{
		this.tipo = TipoError.LEXICO;
	}	

	setTipoSintactico()
	{
		this.tipo = TipoError.SINTACTICO;
	}
	
	setTipoSemantico()
	{
		this.tipo = TipoError.SEMANTICO;
	}	

	getCadenaTipo() : string
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

//Fin manejo de errores

enum TipoPrimitivo
{
	NULO = 0,
	INT = 1,
	DOUBLE = 2, 
	CHAR = 3,
	STRING = 4, 
	BOOL = 5, 
	STRUCT = 6
}

class Tipo
{
	tipo : TipoPrimitivo;
	nombre : string;
	constructor(tipo: TipoPrimitivo)
	{
		this.tipo = tipo;
	}

	setNombre(nombre: string)
	{
		this.nombre = nombre;
	}

	getCadenaTipo(): string
	{
		switch(this.tipo)
		{
			case TipoPrimitivo.INT:
				return "Entero";
			case TipoPrimitivo.DOUBLE:
				return "Double";
			case TipoPrimitivo.CHAR:
				return "Caracter";
			case TipoPrimitivo.STRING:
				return "String";
			case TipoPrimitivo.BOOL:
				return "Bool";
			case TipoPrimitivo.STRUCT:				
		}	
		return this.nombre;	
	}

	esEntero():boolean
	{
		return this.tipo == TipoPrimitivo.INT;
	}

	esDouble():boolean
	{
		return this.tipo == TipoPrimitivo.DOUBLE;
	}

	esChar():boolean
	{
		return this.tipo == TipoPrimitivo.CHAR;
	}	

	esString():boolean
	{
		return this.tipo == TipoPrimitivo.STRING;
	}	

	esBool():boolean
	{
		return this.tipo == TipoPrimitivo.BOOL;
	}	

	esStruct():boolean
	{
		return this.tipo == TipoPrimitivo.STRUCT;
	}
	
	esStructNombre(nombre: string):boolean
	{
		return this.tipo == TipoPrimitivo.STRUCT && this.nombre==nombre;
	}	
	
	esNulo():boolean
	{
		return this.tipo == TipoPrimitivo.NULO;
	}
}

class Simbolo
{
	linea: bigint;
	columna: bigint;
	id: string;
	tipo : Tipo
	constructor(linea: bigint, columna: bigint, id: string, tipo: Tipo)
	{
		this.linea = linea;
		this.columna=columna;
		this.id = id;
		this.tipo = tipo;
	}

	getTipo() : Tipo
	{
		return this.tipo;
	}
}

class Variable extends Simbolo
{
	valor: any;

	constructor(linea: bigint, columna: bigint, id: string, tipo: Tipo, valor: any)
	{
		super(linea, columna, id, tipo);
		this.valor = valor;
	}

	getValor(): any
	{
		return this.valor;
	}
}

class Funcion extends Simbolo
{	
	//Lista de parametros : LinkedList<Parametros>
	constructor(linea: bigint, columna: bigint, id: string, tipo: Tipo)
	{
		super(linea, columna, id, tipo);		
	}	
}


class TablaSimbolos
{
	tabla: Map<string, Simbolo>;
	constructor()
	{
		this.tabla = new Map<string, Simbolo>();
	}	
}


class Entorno
{
	padre: Entorno;
	tabla: TablaSimbolos;
	constructor(padre : Entorno)
	{
		this.padre = padre;
		this.tabla = new TablaSimbolos();
	}
}

 abstract class NodoAST
{
	linea: bigint;
	columna: bigint;

	constructor(linea: bigint, columna: bigint)
	{
		this.linea = linea;
		this.columna = columna;
	}
}

abstract class Expresion extends NodoAST
{
	abstract getTipo(entorno: Entorno): Tipo;
	abstract getValor(entorno: Entorno): any;
}

class Entero extends Expresion
{
	valor: bigint;

	constructor(linea: bigint, columna: bigint, valor: bigint)
	{
		super(linea, columna);
		this.valor = valor;
	}

	getTipo(entorno: Entorno): Tipo {
		return new Tipo(TipoPrimitivo.INT);
	}
	getValor(entorno: Entorno) 
	{
		return this.valor;
	}
	
}


/* Implementación de las instrucciones */

abstract class Instruccion extends NodoAST
{
	abstract ejecutar(entorno: Entorno): any;
}

class Bloque extends Instruccion
{
	instrucciones : Array<Instruccion>;

	constructor(linea: bigint, columna : bigint)
	{
		super(linea, columna);
		this.instrucciones = new Array<Instruccion>();
	}

	registrarInstruccion(instruccion: Instruccion)
	{
		this.instrucciones.push(instruccion);
	}

	ejecutar(entorno: Entorno) 
	{
		this.instrucciones.forEach(function(instruccion)
		{
			instruccion.ejecutar(entorno);
		});
	}
	
}

class Imprimir extends Instruccion
{
	expresion : Expresion;	

	constructor(linea: bigint, columna : bigint, expresion: Expresion)
	{
		super(linea, columna);
		this.expresion = expresion;
	}

	ejecutar(entorno: Entorno) 
	{
		var tipo = this.expresion.getTipo(entorno);
		var valor = this.expresion.getValor(entorno);		
		/*Implementar verificación de tipos para imprimir de forma diferente el valor
		1. En arreglos 
		2. En structs
		*/

		// En caso contrario, solamente imprimimos		
		global_utilidades.imprimirEnConsola(`${valor}`);
	}
	
}
