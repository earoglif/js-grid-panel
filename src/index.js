import GridPanel from './components/GridPanel';

const gridPanel = new GridPanel({
    id: 'myGrid',
    targetId: 'content',
    multiselect: false,
    selectableCells: false,
    selectableRows: false,
    // selectableCols: false,
    onRowSelect: (rowData, rowIndex) => {
        console.log('onRowSelect:', rowData, rowIndex);
    },
    onCellSelect: (value, el, colIndex, rowIndex) => {
        console.log('onCellSelect:', value, el, colIndex, rowIndex);
    },
    columns: [
        {
            id: 'name',
            text: 'Наименование',
            dataIndex: 'name',
            hold: true,
            visible: true,
            width: '150px'
        },
        {
            id: 'mode',
            text: 'Режим работы',
            dataIndex: 'mode',
            visible: true,
            width: '2fr',
            render: (value, props, extra) => {
                const mode = extra.itemsQuickLookItemMenuChangeModuleMode;
                return mode[ Object.keys(mode)[value] ];
            }
        },
        {
            id: 'objectAddress',
            text: 'Адрес',
            dataIndex: 'object',
            hold: true,
            visible: true,
            width: '1fr',
            render: (value, props, extra) => {
                return value.address || '<div style="border: 1px solid red;">—</div>';
            }
        }
    ]
});

document.addEventListener("DOMContentLoaded", () => {

    console.log('INIT:', this, gridPanel);

    gridPanel.loadData({
        url: 'http://localhost:3000/db'
    }).then( props => {
        gridPanel.render();
        gridPanel.setExtraData(props);
        gridPanel.addRows(props.modules);
    }).catch( error => {
        gridPanel.showError(error);
    });

});
