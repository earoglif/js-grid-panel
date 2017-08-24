export default class GridPanel {
    constructor(props) {
        const savedParams = {
              sortParams: JSON.parse(localStorage.getItem('sortParams')),
              columns: JSON.parse(localStorage.getItem('gridColumns'))
        }

        this.defaultStyle = {
            header: 'padding: 10px; border-bottom: 1px solid #999999; overflow: hidden; text-overflow: ellipsis; font-weight: 600; white-space: nowrap;',
            cell: 'padding: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'
        }

        this.id = props.id;
        this.targetId = props.targetId;
        this.columns = savedParams.columns ? savedParams.columns : props.columns;
        this.stylePrefix = props.stylePrefix || props.id;
        this.selectableRows = props.selectableRows || true;
        this.extraData = null;
        this.store = [];

        console.log('GridPanel:', savedParams, props, this.columns);
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

    getStore(index) {
        const store = (index !== undefined) ? this.store[index] : this.store;
        return store;
    }

    setStore(data) {
        this.store = data;
    }

    addToStore(data) {
        this.setStore(this.store.concat(data));
    }

    setExtraData(extraData) {
        this.extraData = extraData;
    }

    setGridContainer() {
        const columns = this.columns || [],
              headerStyle = this.headerStyle || this.defaultStyle.header;

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
                    style="${headerStyleGrid} ${msHeaderStyleGrid} ${headerStyle}"
                    role="headercell"
                    data-col-index="${gridColIndex-1}"
                    title="${item.text}"
                    >${item.text}</div>`;

                gridColIndex++;
            }
        });
        gridTemplateColumns = gridTemplateColumns.join(' ');

        const gridPanelStyle = `display: grid; grid-template-columns: ${gridTemplateColumns}; grid-template-rows: auto;`,
              msGridPanelStyle = `display: -ms-grid; -ms-grid-columns: ${gridTemplateColumns}; -ms-grid-rows: auto;`,
              mainEl = `<div id="${this.id}" style="${gridPanelStyle} ${msGridPanelStyle}">${header}</div>`;

        console.log('setGridContainer:', mainEl);

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
              rowStyle = this.rowStyle || this.defaultStyle.cell,
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
        let cellStyle = itemRow.style || this.defaultStyle.cell,
        rowStyleGrid, msRowrStyleGrid;

        let value = (itemCol.render && this.isFunction(itemCol.render)) ?
                        itemCol.render(itemRow[itemCol.dataIndex], itemRow, this.extraData) :
                        itemRow[itemCol.dataIndex];

        rowStyleGrid = `grid-column: ${gridColumn + '/' + (gridColumn+1)}; grid-row: ${gridRow + '/' + (gridRow+1)};`;
        msRowrStyleGrid = `-ms-grid-column: ${gridColumn}; -ms-grid-row: ${gridRow};`;

        return `<div
                style="${rowStyleGrid} ${msRowrStyleGrid} ${cellStyle}"
                role="gridcell"
                data-col-index="${gridColumn-1}"
                data-row-index="${gridRow-2}"
                title="${this.stripSlashes(value)}"
                >${value}</div>`;
    }

    rowSetSelect(rowIndex) {
        const rowData = this.getStore(rowIndex);

        this.setCellClassByAttribute('toggle', 'data-row-index', rowIndex, this.stylePrefix + '-cell-select');

        console.log('rowSelect', rowIndex, rowData);
    }

    onGridHeaderCellClick(el) {
        const colIndex = el.getAttribute('data-col-index');
        this.setCellClassByAttribute('toggle', 'data-col-index', colIndex, this.stylePrefix + '-cell-select');

        console.log('onGridHeaderCellClick');
    }

    onGridCellClick(el) {
        //this.setCellClass('toggle', el, this.stylePrefix + '-cell-select');
        this.selectableRows && this.rowSetSelect(el.getAttribute('data-row-index'));
        console.log('onGridCellClick:', el);
    }

    onGridCellMouseOver(el) {
        const rowIndex = el.getAttribute('data-row-index');
        //this.setCellClass('add', el, this.stylePrefix + '-cell-mouseover');
        this.selectableRows && this.setCellClassByAttribute('add', 'data-row-index', rowIndex, this.stylePrefix + '-cell-mouseover');
        console.log('onGridCellMouseOver:', el);
    }

    onGridCellMouseOut(el) {
        const rowIndex = el.getAttribute('data-row-index');
        //this.setCellClass('remove', el, this.stylePrefix + '-cell-mouseover');
        this.selectableRows && this.setCellClassByAttribute('remove', 'data-row-index', rowIndex, this.stylePrefix + '-cell-mouseover');
        console.log('onGridCellMouseOut:', el);
    }

    /*
     *  eventName: действие с классом(add, remove, toggle)
     *  cell: выбранный DOM-элемент
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
                    //console.log('addCellEventListener:', event);
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
            console.log('headercell');
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
