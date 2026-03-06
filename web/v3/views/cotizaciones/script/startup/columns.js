// Función para quitar columnas de una tabla, dado el selector de tabla y selector de la columna
// y respetando colSpan y rowSpan

var _removeColumn = function(tableSelector, colNum, rowElement) {
  // 1. Recorrer la tabla añadiendo los nodos del DOM y sus datos al arreglo

  var tableArray = [];
  var rowIndex = 0;
  if (rowElement === undefined) {
    var rows = $(tableSelector + ' tr');
    var currentRow = rows.eq(0);
  } else {
    //var rows = rowElement.slice(0, 1);
    var rows = rowElement.slice(0, 1);
    //var currentRow = rowElement.eq(0);
    var currentRow = rows;
  }
  var i = 0;
  do {
    var rowArray = [];
    var colIndex = 0;
    var currentCell = currentRow.find('> *').eq(0);
    var j = 0;
    do {
      var remainingColSpan = currentCell.prop('colSpan');
      while (remainingColSpan > 0) {
        var cellData = {
          row: i,
          col: j,
          cell: currentCell,
          colSpan: currentCell.prop('colSpan'),
          rowSpan: currentCell.prop('rowSpan'),
          isFirstColSpan: remainingColSpan === currentCell.prop('colSpan'),
          isSingleCol: currentCell.prop('colSpan') === 1 && remainingColSpan === currentCell.prop('colSpan')
        };
        rowArray.push(cellData);
        remainingColSpan--;
        j++;
      }
      currentCell = currentCell.next();
    } while (currentCell.length);
    tableArray.push(rowArray);
    i++;
    //currentRow = currentRow.next();
    currentRow = rows.eq(i - 1);
    console.log(rows.length);
    console.log(i - 1);
    console.log(currentRow);
  //} while (currentRow.length);
  } while (i <= rows.length && rows.length > 1);

  //console.log(tableArray);

  // 2. Quitar las celdas que coinciden con la columna dada, tomando el arreglo y el número dados

  for (var i = 0, tableLen = tableArray.length; i < tableLen; i++) {
    for (var j = 0, rowLen = tableArray[i].length; j < rowLen; j++) {
      if (j === colNum) {
        var cellStruct = tableArray[i][j];
        var cell = cellStruct.cell;
        if (cellStruct.isSingleCol) {
          cell.remove();
          //cell.css('backgroundColor', 'red');
        } else {
          cell.prop('colSpan', cellStruct.colSpan - 1);
        }
      }
    }
  }
};

var removeColumn = function(tableSelector, colSelector, rowElement) {

  if (rowElement === undefined) {
    var colNum = $(tableSelector + ' tbody tr:not(.title)').eq(0).find('> *' + colSelector).index();
    if ($(tableSelector).data('removed-col-nums') === undefined) {
      var colNums = [];
    } else {
      var colNums = $(tableSelector).data('removed-col-nums');
    }
    colNums.push(colNum);
    $(tableSelector).data('removed-col-nums', colNums);
    _removeColumn(tableSelector, colNum, rowElement);
  } else {

    // var colNums = $(tableSelector).data('removed-col-nums').slice().sort(function(a, b) { return a - b; }).reverse();
    var colNums = ($(tableSelector).data('removed-col-nums'))? $(tableSelector).data('removed-col-nums').slice().sort(function(a, b) { return a - b; }).reverse() : [];
    while (colNums.length) {
      _removeColumn(tableSelector, colNums.pop(), rowElement);
    }
  }
};


// Función para aplicar permisos
var columnsPermissions = function(rowElement) {
  if (rowElement === undefined) {
    // Si no está marcado Quitar sección venta
    if (!access._614) {
      // Quitar unidad
      if (access._616) {
        removeColumn('table.items.cotizacion', '.unidad', rowElement);
      }
    }

    // Si está marcado Ver proyectado
    if (access._545) {
      // Quitar proyectado moneda
      if (access._619) {
        removeColumn('table.items.cotizacion', '.currency.eficiencia', rowElement);
      }
      // Quitar proyectado porcentaje
      if (access._620) {
        removeColumn('table.items.cotizacion', '.percent.eficiencia', rowElement);
      }
    }
  } else {
    removeColumn('table.items.cotizacion', undefined, rowElement);
  }

};
