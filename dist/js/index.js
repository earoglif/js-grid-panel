/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GridPanel_js__ = __webpack_require__(1);

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__GridPanel_js__["a" /* default */]);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class GridPanel {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = GridPanel;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_GridPanel__ = __webpack_require__(0);


const gridPanel = new __WEBPACK_IMPORTED_MODULE_0__components_GridPanel__["a" /* default */]({
    id: 'myGrid',
    targetId: 'content',
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
                //console.log('Render column mode:', props);
            }
        },
        {
            id: 'objectAddress',
            text: 'Режим работы',
            dataIndex: 'object',
            hold: true,
            visible: true,
            width: '1fr',
            render: function(value, cellStyle, props, extra) {
                cellStyle += ' background-color: red;';

                console.log('Render column objectAddress:',  cellStyle);

                return value.address || '—';
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


/***/ })
/******/ ]);