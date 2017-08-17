export default class GridPanel {
    constructor(...props) {
        const savedParams = {
            sortParams: JSON.parse(localStorage.getItem('sortParams')),
            columns: JSON.parse(localStorage.getItem('gridColumns'))
        }

        this.columns = savedParams.columns ? savedParams.columns : props.columns;

        console.log('GridPanel:', lsSortParams, lsHeader, props);
    }

    showError(msg) {
        console.error('Ошибка:', msg);
    }

    setGridContainer() {
        const columns = this.columns || [];

        if(!columns.length) {
            this.showError('отсутствуют параметры колонок!');
            return;
        }

        let header = '',
            gridTemplateColumns = [],
            columnWidth;

        columns.forEach((item, i) => {
            if(item['visible']) {
                columnWidth = item.width || item.flex || '1fr';
                gridTemplateColumns.push(columnWidth);
                header += `<div style="grid-column: 1/2; grid-row: 1/2;">${item.text}</div>`;
            }
        });

        let mainEl = `<div style="display: grid; grid-template-columns: ${}; grid-template-rows: 50px;">${header}</div>`;

        return mainEl;
    }

    render(tergetId) {
        console.log('GridPanel render!');
    }
}
