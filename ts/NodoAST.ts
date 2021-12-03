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
	
	constructor(linea: bigint, columna:bigint, id:string, descripcion:string, archivo:string)
	{
		this.linea = linea;
		this.columna = columna;
		this.id = id;
		this.descripcion = descripcion;
		this.archivo = archivo;
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
	abstract 
}
