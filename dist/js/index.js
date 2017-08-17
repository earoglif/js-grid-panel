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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GridPanel_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__GridPanel_js__);

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__GridPanel_js__["default"]);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__) {

"use strict";
throw new Error("Module parse failed: C:\\projects\\js-grid-panel\\src\\components\\GridPanel\\GridPanel.js Unexpected token (37:74)\nYou may need an appropriate loader to handle this file type.\n|         });\r\n| \r\n|         let mainEl = `<div style=\"display: grid; grid-template-columns: ${}; grid-template-rows: 50px;\">${header}</div>`;\r\n| \r\n|         return mainEl;\r");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_GridPanel__ = __webpack_require__(0);


const gridPanel = new __WEBPACK_IMPORTED_MODULE_0__components_GridPanel__["a" /* default */]({
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
            render: (...props) => {
                console.log('Render column objectAddress:', props);
            }
        }
    ]
});

document.addEventListener("DOMContentLoaded", () => {

    console.log('INIT:', this, gridPanel);

    gridPanel.render('content');

});


/***/ })
/******/ ]);