export default class GridPanel {
    constructor(props) {
        const savedParams = {
              sortParams: JSON.parse(localStorage.getItem('sortParams')),
              columns: JSON.parse(localStorage.getItem('gridColumns'))
        }

        this.id = props.id; // Идентификатор таблицы
        this.targetId = props.targetId; // Идентификатор элемента в котором будет отрисована
        this.columns = savedParams.columns ? savedParams.columns : props.columns; // Параметры колонок
        this.stylePrefix = props.stylePrefix || props.id; // Префикс для CSS-классов
        this.sortInfo = {}; // Наименование колонки и направление сортировки
        this.extraData = null; // Дополнительные данные вне store
        this.store = []; // Основные данные
        this.selectedCells = []; // Выделенные ячейки
        this.selectedRows = []; // Выделенные строки
        this.selectedCols = []; // Выделенные колонки
        this.multiselect = (props.multiselect !== undefined) ? props.multiselect : true; // Разрешить/запретить множественное выделение
        this.selectableCells = (props.selectableCells !== undefined) ? props.selectableCells : true; // Разрешить/запретить выделять ячейки
        this.selectableRows = (props.selectableRows !== undefined) ? props.selectableRows : true; // Разрешить/запретить выделять строки
        this.selectableCols = (props.selectableCols !== undefined) ? props.selectableCols : true; // Разрешить/запретить выделять колонки
        this.onHeaderClick = props.onHeaderClick || this.emptyFn; // Функция, срабатывающая при клике на заголовок
        this.onCellClick = props.onCellClick || this.emptyFn; // Функция, срабатывающая при клике на ячейке
        this.onCellSelect = props.onCellSelect || this.emptyFn; // Функция, срабатывающая при выделении ячейки
        this.onRowSelect = props.onRowSelect || this.emptyFn; // Функция, срабатывающая при выделении строки
        this.onColSelect = props.onColSelect || this.emptyFn; // Функция, срабатывающая при выделении колонки
    }

    showError(msg) {
        console.error('Ошибка:', msg);
    }

    emptyFn() {}

    stripSlashes(str) {
        str += '';
        str = str.replace(/\"/g, '&quot;');
        return str;
    }

    isFunction(functionToCheck) {
        const getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    getSortInfo() {
        return this.sortInfo;
    }

    setSortInfo(props) {
        this.sortInfo = props;
    }

    getStore(index) {
        const store = (index !== undefined) ? this.store[index] : this.store;
        return store;
    }

    setStore(data=[]) {
        this.store = data;
    }

    addToStore(data) {
        this.setStore(this.store.concat(data));
    }

    /*
     *  sorter: {Strung} наименование сортируемой колонки
     *  direction: {Strung} направление сортировки ('ASC', 'DESC')
     *  localSort: {Boolean} сортировать локально, или на сервере
     */
    sort(sorter, direction, localSort=true) {
        if(localSort) {
            let data = this.getStore();
            data.sort((a, b) => {
                if(direction === 'DESC') {
                    return (a[sorter] < b[sorter]) ? 1 : -1
                }else{
                    return (a[sorter] > b[sorter]) ? 1 : -1
                }
            });

            this.setStore();
            this.render();
            this.addRows(data);
        }

        this.setSortInfo({sorter, direction});
    }

    setExtraData(extraData) {
        this.extraData = extraData;
    }

    setGridContainer() {
        const columns = this.columns || [],
              headerStyle = this.headerStyle || '';

        if(!columns.length) {
            this.showError('отсутствуют параметры колонок!');
            return;
        }

        let header = '',
            gridTemplateColumns = [],
            gridColIndex = 1,
            columnWidth, headerStyleGrid, msHeaderStyleGrid;

        columns.forEach((item, i) => {
            if(item['visible']) {
                columnWidth = item.width || 'auto';
                gridTemplateColumns.push(columnWidth);
                headerStyleGrid = `grid-column: ${gridColIndex + '/' + (gridColIndex+1)}; grid-row: 1/2;`;
                msHeaderStyleGrid = `-ms-grid-column: ${gridColIndex}; -ms-grid-row: 1;`;

                header += `<div
                    class="${this.stylePrefix}-cell-header"
                    style="${headerStyleGrid} ${msHeaderStyleGrid} ${headerStyle}"
                    role="headercell"
                    data-header-col-index="${gridColIndex-1}"
                    title="${item.text}"
                    >${item.text}</div>`;

                gridColIndex++;
            }
        });
        gridTemplateColumns = gridTemplateColumns.join(' ');

        const gridPanelStyle = `display: grid; grid-template-columns: ${gridTemplateColumns}; grid-template-rows: auto;`,
              msGridPanelStyle = `display: -ms-grid; -ms-grid-columns: ${gridTemplateColumns}; -ms-grid-rows: auto;`,
              mainEl = `<div id="${this.id}" style="${gridPanelStyle} ${msGridPanelStyle}">${header}</div>`;

        return mainEl;
    }

    loadData(options) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest(),
                  params = options.params || null,
                  method = options.method || 'GET';

            xhr.open(method, options.url);
            xhr.send(params);

            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    reject(xhr);
                } else {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                }
            }

        });
    }

    addRows(newRows) {
        const gridPanel = document.getElementById(this.id),
              columns = this.columns || [];

        let newGridTemplateRows = [],
            appendInnerHtml = '',
            gridColIndex = 1,
            gridRowIndex = this.getStore().length + 2;

        this.addToStore(newRows);

        newRows.forEach((itemRow, i) => {
            //newGridTemplateRows.push('auto');

            columns.forEach((itemCol, i) => {
                if(itemCol['visible']) {
                    appendInnerHtml += this.renderRow(itemCol, itemRow, gridColIndex, gridRowIndex);
                    gridColIndex++
                }
            });

            gridRowIndex++;
            gridColIndex = 1;

        });
        newGridTemplateRows = newGridTemplateRows.join(' ');

        gridPanel.style.gridTemplateRows += ' ' + newGridTemplateRows;
        gridPanel.innerHTML += appendInnerHtml;
    }

    renderRow(itemCol, itemRow, gridColumn, gridRow) {
        let cellStyle = itemRow.style || '',
        rowStyleGrid, msRowrStyleGrid;

        let value = (itemCol.render && this.isFunction(itemCol.render)) ?
                        itemCol.render(itemRow[itemCol.dataIndex], itemRow, this.extraData) :
                        itemRow[itemCol.dataIndex];

        rowStyleGrid = `grid-column: ${gridColumn + '/' + (gridColumn+1)}; grid-row: ${gridRow + '/' + (gridRow+1)};`;
        msRowrStyleGrid = `-ms-grid-column: ${gridColumn}; -ms-grid-row: ${gridRow};`;

        return `<div
                class="${this.stylePrefix}-cell"
                style="${rowStyleGrid} ${msRowrStyleGrid} ${cellStyle}"
                role="gridcell"
                data-col-index="${gridColumn-1}"
                data-row-index="${gridRow-2}"
                title="${this.stripSlashes(value)}"
                >${value}</div>`;
    }

    deselectAllRows() {
        this.selectedRows.length && this.selectedRows.forEach(item => {
            this.rowSetSelect(item.rowIndex, 'remove');
        });
    }
    rowSetSelect(rowIndex, classEvent = 'add') {
        this.selectedRows.length && this.selectedRows.some((item, i, array) => {
            if(item.rowIndex === rowIndex) {
                array.splice(i, 1);
                classEvent = 'remove';
                return true;
            }
        });

        if(classEvent === 'add') {
            const rowData = this.getStore(rowIndex);
            (this.selectedRows.length && !this.multiselect) && this.deselectAllRows();
            this.selectedRows.push({
                rowIndex,
                data: rowData
            });
            this.onRowSelect(rowData, rowIndex);
        }

        this.setCellClassByAttribute(classEvent, 'data-row-index', rowIndex, this.stylePrefix + '-cell-select');
    }

    deselectAllCells() {
        this.selectedCells.length && this.selectedCells.forEach(item => {
            this.cellSetSelect(item.el, item.colIndex, item.rowIndex, 'remove');
        });
    }
    cellSetSelect(el, colIndex, rowIndex, classEvent = 'add') {
        this.selectedCells.length && this.selectedCells.some((item, i, array) => {
            if(item.colIndex === colIndex && item.rowIndex === rowIndex) {
                array.splice(i, 1);
                classEvent = 'remove';
                return true;
            }
        });

        if(classEvent === 'add') {
            const dataIndex = this.columns[colIndex].dataIndex,
                  store = this.getStore(),
                  value = store[rowIndex][dataIndex];

            (this.selectedCells.length && !this.multiselect) && this.deselectAllCells();
            this.selectedCells.push({
                el,
                colIndex,
                rowIndex,
                value
            });

            this.onCellSelect(value, el, colIndex, rowIndex);
        }

        this.setCellClass(classEvent, el, this.stylePrefix + '-cell-select');
    }

    //TODO: Разобрать реакцию на выделение колонок
    deselectAllCols() {
        this.selectedCols.length && this.selectedCols.forEach(item => {
            this.colSetSelect(item.colIndex, 'remove');
        });
    }
    colSetSelect(colIndex, classEvent = 'add') {
        this.selectedCols.length && this.selectedCols.some((item, i, array) => {
            if(item.colIndex === colIndex) {
                array.splice(i, 1);
                classEvent = 'remove';
                return true;
            }
        });

        if(classEvent === 'add') {
            const colInfo = this.columns[colIndex],
                  colData = [],
                  store = this.getStore();
            store.forEach((item) => {
                colData.push(item[colInfo.dataIndex]);
            });
            (this.selectedCols.length && !this.multiselect) && this.deselectAllCols();
            this.selectedCols.push({
                colIndex,
                dataIndex: colInfo.dataIndex,
                data: colData
            });
            this.onColSelect(colData, colIndex, colInfo.dataIndex);
        }

        this.setCellClassByAttribute(classEvent, 'data-col-index', colIndex, this.stylePrefix + '-cell-select');
    }

    onGridHeaderCellClick(el) {
        const colIndex = el.getAttribute('data-header-col-index'),
              colProps = this.columns[colIndex];

        this.onHeaderClick(colProps, el);
    }

    onGridCellClick(el) {
        this.selectableCells && this.cellSetSelect(el, el.getAttribute('data-col-index'), el.getAttribute('data-row-index'));
        this.selectableRows && this.rowSetSelect(el.getAttribute('data-row-index'));
        this.selectableCols && this.colSetSelect(el.getAttribute('data-col-index'));
    }

    onGridCellMouseOver(el) {
        const rowIndex = el.getAttribute('data-row-index'),
              colIndex = el.getAttribute('data-col-index');
        this.selectableCells && this.setCellClass('add', el, this.stylePrefix + '-cell-mouseover');
        this.selectableRows && this.setCellClassByAttribute('add', 'data-row-index', rowIndex, this.stylePrefix + '-cell-mouseover');
        this.selectableCols && this.setCellClassByAttribute('add', 'data-col-index', colIndex, this.stylePrefix + '-cell-mouseover');
    }

    onGridCellMouseOut(el) {
        const rowIndex = el.getAttribute('data-row-index'),
              colIndex = el.getAttribute('data-col-index');
        this.selectableCells && this.setCellClass('remove', el, this.stylePrefix + '-cell-mouseover');
        this.selectableRows && this.setCellClassByAttribute('remove', 'data-row-index', rowIndex, this.stylePrefix + '-cell-mouseover');
        this.selectableCols && this.setCellClassByAttribute('remove', 'data-col-index', colIndex, this.stylePrefix + '-cell-mouseover');
    }

    /*
     *  eventName: {Strung} действие с классом(add, remove, toggle)
     *  cell: {DOM-element} выбранный DOM-элемент
     *  className: {String} наименование CSS класса
     */
    setCellClass(eventName, cell, className) {
        cell && cell.classList[eventName](className);
    }

    setCellClassByAttribute(eventName, attrName, attrVal, className) {
        const cells = document.querySelectorAll(`[${attrName}="${attrVal}"]`);
        cells && cells.forEach(cell => {
            this.setCellClass(eventName, cell, className);
        });
    }

    addCellEventListener(role, eventName, fn) {
        document.getElementById(this.id).addEventListener(eventName, event => {
            event.path.some(el => {
                if(el.getAttribute('role') === role) {
                    fn && fn(el);
                    return true;
                } else if(el.id === this.id) {
                    return true;
                }
            });
        });
    }

    render() {
        const target = document.getElementById(this.targetId),
              gridContainer = this.setGridContainer();

        target.innerHTML = gridContainer;

        this.addCellEventListener('headercell', 'click', el => {
            this.onGridHeaderCellClick(el);
        });

        this.addCellEventListener('gridcell', 'click', el => {
            this.onGridCellClick(el);
        });
        this.addCellEventListener('gridcell', 'mouseover', el => {
            this.onGridCellMouseOver(el);
        });
        this.addCellEventListener('gridcell', 'mouseout', el => {
            this.onGridCellMouseOut(el);
        });
    }
}
