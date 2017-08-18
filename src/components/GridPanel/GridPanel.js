export default class GridPanel {
    constructor(props) {
        const savedParams = {
              sortParams: JSON.parse(localStorage.getItem('sortParams')),
              columns: JSON.parse(localStorage.getItem('gridColumns'))
        }

        this.defaultStyle = {
            header: 'padding: 10px; border-bottom: 1px solid #999999; overflow: hidden; text-overflow: ellipsis;'
        }

        this.columns = savedParams.columns ? savedParams.columns : props.columns;
        this.showError = this.showError.bind(this);
        this.loadData = this.loadData.bind(this);

        console.log('GridPanel:', savedParams, props, this.columns);
    }

    showError(msg) {
        console.error('Ошибка:', msg);
    }

    emptyFn() {}

    setGridContainer() {
        const columns = this.columns || [],
              headerStyle = this.headerStyle || this.defaultStyle.header;

        if(!columns.length) {
            this.showError('отсутствуют параметры колонок!');
            return;
        }

        let header = '',
            gridTemplateColumns = [],
            gridLineIndex = 1,
            columnWidth;

        columns.forEach((item, i) => {
            if(item['visible']) {
                columnWidth = item.width || 'auto';
                gridTemplateColumns.push(columnWidth);
                header += `<div
                    style="grid-column: ${gridLineIndex++ + '/' + gridLineIndex}; grid-row: 1/2;${headerStyle}"
                    title="${item.text}"
                    >${item.text}</div>`;
            }
        });
        gridTemplateColumns = gridTemplateColumns.join(' ');

        let mainEl = `<div style="display: grid; grid-template-columns: ${gridTemplateColumns}; grid-template-rows: auto;">${header}</div>`;

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
                    resolve(xhr);
                }
            }

        });
    }

    addRows(newRows) {

    }

    render(tergetId) {
        const target = document.getElementById(tergetId),
              gridContainer = this.setGridContainer();

        target.innerHTML = gridContainer;

        console.log('GridPanel render!', target);
    }
}
