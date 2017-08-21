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

        this.columns = savedParams.columns ? savedParams.columns : props.columns;
        this.targetId = props.targetId;
        this.id = props.id;
        this.extraData = null;

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
            columnWidth;

        columns.forEach((item, i) => {
            if(item['visible']) {
                columnWidth = item.width || 'auto';
                gridTemplateColumns.push(columnWidth);
                header += `<div
                    style="grid-column: ${gridColIndex++ + '/' + gridColIndex}; grid-row: 1/2; ${headerStyle}"
                    title="${item.text}"
                    >${item.text}</div>`;
            }
        });
        gridTemplateColumns = gridTemplateColumns.join(' ');

        let mainEl = `<div id="${this.id}" style="display: grid; grid-template-columns: ${gridTemplateColumns}; grid-template-rows: auto;">${header}</div>`;

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
            gridRowIndex = 2; //!!! Переделать! Необходимо считать общее количество элементов. !!!

        newRows.forEach((itemRow, i) => {
            newGridTemplateRows.push('auto');

            columns.forEach((itemCol, i) => {
                if(itemCol['visible']) {
                    appendInnerHtml += this.renderRow(itemCol, itemRow, gridColIndex++ + '/' + gridColIndex, gridRowIndex + '/' + (gridRowIndex+1));
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
        let cellStyle = itemRow.style || this.defaultStyle.cell;

        const value = (itemCol.render && this.isFunction(itemCol.render)) ?
                        itemCol.render(itemRow[itemCol.dataIndex], cellStyle, itemRow, this.extraData) :
                        itemRow[itemCol.dataIndex];

        console.log('renderRow:', cellStyle);

        return `<div
                style="grid-column: ${gridColumn}; grid-row: ${gridRow}; ${cellStyle}"
                title="${this.stripSlashes(value)}"
                >${value}</div>`;
    }

    render() {
        const target = document.getElementById(this.targetId),
              gridContainer = this.setGridContainer();

        target.innerHTML = gridContainer;

        console.log('GridPanel render!', target);
    }
}
