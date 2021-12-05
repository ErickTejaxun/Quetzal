var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* Area de utilidades */
var Utilidades = /** @class */ (function () {
    function Utilidades() {
        this.listaErrores = new Array();
        this.consolaSalida = new Array();
    }
    /* Area de manejo de errores. */
    Utilidades.prototype.registrarErrorLexico = function (linea, columna, id, descripcion, archivo) {
        var nuevoError = new error(linea, columna, id, descripcion, archivo);
        nuevoError.setTipoLexico();
        this.listaErrores.push(nuevoError);
    };
    Utilidades.prototype.registrarErrorSintactico = function (linea, columna, id, descripcion, archivo) {
        var nuevoError = new error(linea, columna, id, descripcion, archivo);
        nuevoError.setTipoSintactico();
        this.listaErrores.push(nuevoError);
    };
    Utilidades.prototype.registrarErrorSemantico = function (linea, columna, id, descripcion, archivo) {
        var nuevoError = new error(linea, columna, id, descripcion, archivo);
        nuevoError.setTipoSemantico();
        this.listaErrores.push(nuevoError);
    };
    /* Area de manejo de consola de salida */
    Utilidades.prototype.imprimirEnConsola = function (cadena) {
        this.consolaSalida.push(cadena);
    };
    /* Area de iniciacion */
    Utilidades.prototype.iniciacion = function () {
        this.consolaSalida = new Array();
        this.listaErrores = new Array();
    };
    return Utilidades;
}());
var global_utilidades = new Utilidades();
//áre de manejo de errores. 
var TipoError;
(function (TipoError) {
    TipoError[TipoError["LEXICO"] = 1] = "LEXICO";
    TipoError[TipoError["SINTACTICO"] = 2] = "SINTACTICO";
    TipoError[TipoError["SEMANTICO"] = 3] = "SEMANTICO";
})(TipoError || (TipoError = {}));
var error = /** @class */ (function () {
    function error(linea, columna, id, descripcion, archivo) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.descripcion = descripcion;
        this.archivo = archivo;
        this.tipo = TipoError.SINTACTICO;
    }
    error.prototype.setTipoLexico = function () {
        this.tipo = TipoError.LEXICO;
    };
    error.prototype.setTipoSintactico = function () {
        this.tipo = TipoError.SINTACTICO;
    };
    error.prototype.setTipoSemantico = function () {
        this.tipo = TipoError.SEMANTICO;
    };
    error.prototype.getCadenaTipo = function () {
        switch (this.tipo) {
            case TipoError.LEXICO:
                return "Léxico";
            case TipoError.SINTACTICO:
                return "Sintáctico";
            case TipoError.SEMANTICO:
                return "Semántico";
        }
    };
    return error;
}());
//Fin manejo de errores
var TipoPrimitivo;
(function (TipoPrimitivo) {
    TipoPrimitivo[TipoPrimitivo["NULO"] = 0] = "NULO";
    TipoPrimitivo[TipoPrimitivo["INT"] = 1] = "INT";
    TipoPrimitivo[TipoPrimitivo["DOUBLE"] = 2] = "DOUBLE";
    TipoPrimitivo[TipoPrimitivo["CHAR"] = 3] = "CHAR";
    TipoPrimitivo[TipoPrimitivo["STRING"] = 4] = "STRING";
    TipoPrimitivo[TipoPrimitivo["BOOL"] = 5] = "BOOL";
    TipoPrimitivo[TipoPrimitivo["STRUCT"] = 6] = "STRUCT";
})(TipoPrimitivo || (TipoPrimitivo = {}));
var Tipo = /** @class */ (function () {
    function Tipo(tipo) {
        this.tipo = tipo;
    }
    Tipo.prototype.setNombre = function (nombre) {
        this.nombre = nombre;
    };
    Tipo.prototype.getCadenaTipo = function () {
        switch (this.tipo) {
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
    };
    Tipo.prototype.esEntero = function () {
        return this.tipo == TipoPrimitivo.INT;
    };
    Tipo.prototype.esDouble = function () {
        return this.tipo == TipoPrimitivo.DOUBLE;
    };
    Tipo.prototype.esChar = function () {
        return this.tipo == TipoPrimitivo.CHAR;
    };
    Tipo.prototype.esString = function () {
        return this.tipo == TipoPrimitivo.STRING;
    };
    Tipo.prototype.esBool = function () {
        return this.tipo == TipoPrimitivo.BOOL;
    };
    Tipo.prototype.esStruct = function () {
        return this.tipo == TipoPrimitivo.STRUCT;
    };
    Tipo.prototype.esStructNombre = function (nombre) {
        return this.tipo == TipoPrimitivo.STRUCT && this.nombre == nombre;
    };
    Tipo.prototype.esNulo = function () {
        return this.tipo == TipoPrimitivo.NULO;
    };
    return Tipo;
}());
var Simbolo = /** @class */ (function () {
    function Simbolo(linea, columna, id, tipo) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.tipo = tipo;
    }
    Simbolo.prototype.getTipo = function () {
        return this.tipo;
    };
    return Simbolo;
}());
var Variable = /** @class */ (function (_super) {
    __extends(Variable, _super);
    function Variable(linea, columna, id, tipo, valor) {
        var _this = _super.call(this, linea, columna, id, tipo) || this;
        _this.valor = valor;
        return _this;
    }
    Variable.prototype.getValor = function () {
        return this.valor;
    };
    return Variable;
}(Simbolo));
var Funcion = /** @class */ (function (_super) {
    __extends(Funcion, _super);
    //Lista de parametros : LinkedList<Parametros>
    function Funcion(linea, columna, id, tipo) {
        return _super.call(this, linea, columna, id, tipo) || this;
    }
    return Funcion;
}(Simbolo));
var TablaSimbolos = /** @class */ (function () {
    function TablaSimbolos() {
        this.tabla = new Map();
    }
    return TablaSimbolos;
}());
var Entorno = /** @class */ (function () {
    function Entorno(padre) {
        this.padre = padre;
        this.tabla = new TablaSimbolos();
    }
    return Entorno;
}());
var NodoAST = /** @class */ (function () {
    function NodoAST(linea, columna) {
        this.linea = linea;
        this.columna = columna;
    }
    return NodoAST;
}());
var Expresion = /** @class */ (function (_super) {
    __extends(Expresion, _super);
    function Expresion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Expresion;
}(NodoAST));
var Entero = /** @class */ (function (_super) {
    __extends(Entero, _super);
    function Entero(linea, columna, valor) {
        var _this = _super.call(this, linea, columna) || this;
        _this.valor = valor;
        return _this;
    }
    Entero.prototype.getTipo = function (entorno) {
        return new Tipo(TipoPrimitivo.INT);
    };
    Entero.prototype.getValor = function (entorno) {
        return this.valor;
    };
    return Entero;
}(Expresion));
/* Implementación de las instrucciones */
var Instruccion = /** @class */ (function (_super) {
    __extends(Instruccion, _super);
    function Instruccion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Instruccion;
}(NodoAST));
var Bloque = /** @class */ (function (_super) {
    __extends(Bloque, _super);
    function Bloque(linea, columna) {
        var _this = _super.call(this, linea, columna) || this;
        _this.instrucciones = new Array();
        return _this;
    }
    Bloque.prototype.registrarInstruccion = function (instruccion) {
        this.instrucciones.push(instruccion);
    };
    Bloque.prototype.ejecutar = function (entorno) {
        this.instrucciones.forEach(function (instruccion) {
            instruccion.ejecutar(entorno);
        });
    };
    return Bloque;
}(Instruccion));
var Imprimir = /** @class */ (function (_super) {
    __extends(Imprimir, _super);
    function Imprimir(linea, columna, expresion) {
        var _this = _super.call(this, linea, columna) || this;
        _this.expresion = expresion;
        return _this;
    }
    Imprimir.prototype.ejecutar = function (entorno) {
        var tipo = this.expresion.getTipo(entorno);
        var valor = this.expresion.getValor(entorno);
        /*Implementar verificación de tipos para imprimir de forma diferente el valor
        1. En arreglos
        2. En structs
        */
        // En caso contrario, solamente imprimimos		
        global_utilidades.imprimirEnConsola("".concat(valor));
    };
    return Imprimir;
}(Instruccion));
var ImprimirLn = /** @class */ (function (_super) {
    __extends(ImprimirLn, _super);
    function ImprimirLn(linea, columna, expresion) {
        var _this = _super.call(this, linea, columna) || this;
        _this.expresion = expresion;
        return _this;
    }
    ImprimirLn.prototype.ejecutar = function (entorno) {
        var tipo = this.expresion.getTipo(entorno);
        var valor = this.expresion.getValor(entorno);
        /*Implementar verificación de tipos para imprimir de forma diferente el valor
        1. En arreglos
        2. En structs
        */
        // En caso contrario, solamente imprimimos		
        global_utilidades.imprimirEnConsola("".concat(valor));
    };
    return ImprimirLn;
}(Instruccion));
