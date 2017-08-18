import GridPanel from './components/GridPanel';

const gridPanel = new GridPanel({
    columns: [
        {
            id: 'name',
            text: 'Наименование',
            dataIndex: 'name',
            hold: true,
            visible: true,
            width: '50px'
        },
        {
            id: 'mode',
            text: 'Режим работы',
            dataIndex: 'mode',
            visible: true,
            width: '2fr',
            render: (...props) => {
                console.log('Render column mode:', props);
            }
        },
        {
            id: 'objectAddress',
            text: 'Режим работы',
            dataIndex: 'object',
            hold: true,
            visible: true,
            width: '1fr',
            render: (...props) => {
                console.log('Render column objectAddress:', props);
            }
        }
    ]
});

document.addEventListener("DOMContentLoaded", () => {

    console.log('INIT:', this, gridPanel);

    gridPanel.loadData({
        url: 'http://localhost:3000/db'
    }).then( props => {
        gridPanel.render('content');
    })catch( error => {
        gridPanel.showError('данные не подгрузились');
    });

});
