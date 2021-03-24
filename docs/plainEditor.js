var plainEditor;plainEditor =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/getHighlightButtons.js":
/*!************************************!*\
  !*** ./src/getHighlightButtons.js ***!
  \************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
function getHighlightButtons(editorRoot) {

    let highLight = {};

    if (!editorRoot.textContent) {
        highLight.tagArr = ['document-fragment'];
        return highLight;
    }

    const selection = window.getSelection(), 
        getSelection = selection.getRangeAt(0).cloneContents(), 
        children = getSelection.children, 
        startCont = selection.getRangeAt(0).startContainer,
        endCont = selection.getRangeAt(0).endContainer;

    let tagArr = [], 
        justifyArr = [],
        fontFamilyArr = [],
        fontSizeArr = [],
        lineHeightArr = [],
        colorArr = [],
        backgroundColorArr = [],
        childArr = [],
        collectionItem;

    function pushToStyleArrays(element) { 
        if(element.style['text-align']) {
            justifyArr.push(element.style['text-align']); 
        }

        if(element.style['font-family']) {
            fontFamilyArr.push(element.style['font-family']); 
        }

        if(element.style['font-size']) {
            fontSizeArr.push(element.style['font-size']); 
        }

        if(element.style['line-height']) {
            lineHeightArr.push(element.style['line-height']); 
        }

        if(element.style.color) {
            colorArr.push(element.style.color); 
        }

        if(element.style['background-color']) {
            backgroundColorArr.push(element.style['background-color']); 
        }
    }


    function pushResult(collection) {
        function pushChildElements(child) { 
            if(child.children) {
                let childItem;
                for(childItem of child.children) {
                    childArr.push(childItem.nodeName); 
                    pushToStyleArrays(childItem);
                    pushChildElements(childItem);
                } 
            }
        }
        for(collectionItem of collection) {
            childArr.push(collectionItem.nodeName);
            pushToStyleArrays(collectionItem); 
            pushResult(collectionItem.children);
            pushChildElements(collectionItem);
            tagArr.push(childArr); 
            childArr = [];  
        }  
    }

    function pushIfStartIsEqualEnd() { 
        let parentElement = startCont.parentElement;
        while(parentElement !== editorRoot) {
            //if(parentElement !== null) { вылетает или виснет при использовании HR. родительская нода=null.
                childArr.push(parentElement.nodeName);
                pushToStyleArrays(parentElement); 
                parentElement = parentElement.parentNode;
            //}    
        }
        if(parentElement === editorRoot) {
            childArr.push('root');
            }
        tagArr.push(childArr);
        childArr = []; 
    }

    if(startCont.isEqualNode(endCont)) { 
        pushIfStartIsEqualEnd();
    } else {  
        childArr.push(startCont.parentElement.nodeName);
        tagArr.push(childArr); 
        childArr = [];
        pushResult(children);
    }
    tagArr = tagArr.filter(item => item.length !== 0); 

    highLight.tagArr = tagArr;
    highLight.justifyArr = justifyArr;
    highLight.fontFamilyArr = fontFamilyArr;
    highLight.fontSizeArr = fontSizeArr;
    highLight.lineHeightArr = lineHeightArr;
    highLight.colorArr = colorArr;
    highLight.backgroundColorArr = backgroundColorArr;  

    return highLight; 

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getHighlightButtons);

/***/ }),

/***/ "./src/highLightButtons.js":
/*!*********************************!*\
  !*** ./src/highLightButtons.js ***!
  \*********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _getHighlightButtons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getHighlightButtons */ "./src/getHighlightButtons.js");


function highLightButtons(arrayOfToolbarElementWithHighlight) {

    const root = document.querySelector('.editor-textField');
    const justityButtonsArr = [ 
                                    [document.querySelector('.toolbar-justifyCenter'), 'center'],
                                    [document.querySelector('.toolbar-justifyFull'), 'justify'],
                                    [document.querySelector('.toolbar-justifyLeft'), 'left'],
                                    [document.querySelector('.toolbar-justifyRight'), 'right']
                                ];

    root.addEventListener('click', toggleSelectedButtons);
    root.addEventListener('keydown', toggleSelectedButtons);

    function toggleSelectedButtons() { 
        const highLight = (0,_getHighlightButtons__WEBPACK_IMPORTED_MODULE_0__.default)(root); 
        //console.log(highLight);
        const arrayOfHighlightButtons = highLight.tagArr; 


        function toggleSelectedButton(button, tag) { 
            if(arrayOfHighlightButtons.every(arr => arr.includes(tag))) {
                button.classList.add('selected'); 
            } else {
                button.classList.remove('selected'); 
            }
        }
        arrayOfToolbarElementWithHighlight.forEach(button => { 
            toggleSelectedButton(button.element, button.tag); 
        });


        justityButtonsArr.forEach(arr => { 
            toggleSelectedJustifyButton(arr[0], arr[1]);
        });

        function toggleSelectedJustifyButton(button, tag) {
            if( 
                highLight.justifyArr &&
                highLight.justifyArr[0] === tag &&
                highLight.justifyArr.every(item => item === highLight.justifyArr[0])
            ) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        }



        
        toggleSelectedSelectButtons('fontName', 
                                    'Шрифт', 
                                    highLight.fontFamilyArr,
                                    setValueOfSelect);

        toggleSelectedSelectButtons( 'fontSize', 
                                    'Размер', 
                                    highLight.fontSizeArr,
                                    setValueOfFontSize);


        function toggleSelectedSelectButtons(selectClass, defaultValue, targetArr, setNewValue) {

            const currentSelect = document.querySelector(`.toolbar-${selectClass}`);
            
            let currentValue = defaultValue; 

            if( targetArr && 
                targetArr.length !== 0 && 
                targetArr.every(item => item === targetArr[0]) 
                ) { 
                    const valueStr = targetArr[0],
                        re = /"/g,
                        newStr = valueStr.replace(re, ''); 
                    
                    currentValue = setNewValue(newStr, currentValue, selectClass);

                } else {       
                    currentValue = defaultValue; 
                } 
                            
            currentSelect.value = currentValue; 
        }


        function setValueOfSelect(newStr, currentValue, selectClass) { 

            const options = document.querySelectorAll(`.${selectClass}-option`);

            options.forEach(option => {
                if(option.value === newStr) {
                    currentValue = option.value;
                } 
            });
            
            return currentValue;
        }




        function setValueOfFontSize(newStr, currentValue) { 
            
            switch(newStr) {
                case 'x-small':
                    currentValue = 1;
                    break;
                case 'small':
                    currentValue = 2;
                    break;
                case 'medium':
                    currentValue = 3;
                    break;
                case 'large':
                    currentValue = 4;
                    break;
                case 'x-large':
                    currentValue = 5;
                    break;
                case 'xx-large':
                    currentValue = 6;
                    break;
                case 'xxx-large':
                    currentValue = 7;
                    break;
                default:
                    currentValue = 'Размер';
                }
                return currentValue;
        }




        function setValueOfLineHeightSelect() {
            const lineHeight = document.querySelector('.toolbar-lineHeight');
            const ancestorContainer = document.getSelection().getRangeAt(0).commonAncestorContainer;
            
            if(ancestorContainer.style && ancestorContainer.style['line-height']) {
                lineHeight.value = ancestorContainer.style['line-height'];
            } else if(ancestorContainer.parentElement.style && ancestorContainer.parentElement.style['line-height']) {
                lineHeight.value = ancestorContainer.parentElement.style['line-height'];
            } else {
                lineHeight.value = 'Интервал';
            }
        }

        setValueOfLineHeightSelect();




        toggleSelectedColorButtons('toolbar-foreColor', '#ff0000', highLight.colorArr);
        toggleSelectedColorButtons('toolbar-hiliteColor', '#ffff00', highLight.backgroundColorArr);

        function toggleSelectedColorButtons(selectClass, defaultValue, targetArr) {

            function rgbToHex(color) {
                let colorInRgb = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            
                return (colorInRgb && colorInRgb.length === 4) ? "#" +
                    ("0" + parseInt(colorInRgb[1],10).toString(16)).slice(-2) +
                    ("0" + parseInt(colorInRgb[2],10).toString(16)).slice(-2) +
                    ("0" + parseInt(colorInRgb[3],10).toString(16)).slice(-2) : '';
            }

            const currentSelect = document.querySelector(`.${selectClass}`);
            let currentValue = defaultValue;
            
            if( 
                targetArr && 
                targetArr.length !== 0 //&& 
                //targetArr.every(item => item === targetArr[0]) //  здесь че та не то я пока хз
                ) { 
                    const valueStr = targetArr[0],
                        valueInHex = rgbToHex(valueStr);

                    currentValue = valueInHex;
                } else {
                    currentValue = defaultValue;
                }

            currentSelect.value = currentValue;
        }
    }

    arrayOfToolbarElementWithHighlight.forEach(button => { 
        button.element.addEventListener('click', () => {
            button.element.classList.toggle('selected');
        });
    });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (highLightButtons);



/***/ }),

/***/ "./src/plainEditorScript.js":
/*!**********************************!*\
  !*** ./src/plainEditorScript.js ***!
  \**********************************/
/*! namespace exports */
/*! export init [provided] [maybe used in main (runtime-defined)] [usage prevents renaming] */
/*! other exports [not provided] [maybe used in main (runtime-defined)] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "init": () => /* binding */ init
/* harmony export */ });
/* harmony import */ var _renderPlainEditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderPlainEditor */ "./src/renderPlainEditor.js");
/* harmony import */ var _runPlainEditorToolbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./runPlainEditorToolbar */ "./src/runPlainEditorToolbar.js");



function init(root) {
    (0,_renderPlainEditor__WEBPACK_IMPORTED_MODULE_0__.default)(root);
    (0,_runPlainEditorToolbar__WEBPACK_IMPORTED_MODULE_1__.default)();
}





/***/ }),

/***/ "./src/renderPlainEditor.js":
/*!**********************************!*\
  !*** ./src/renderPlainEditor.js ***!
  \**********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
function renderPlainEditor(root) {

    
    const main = document.createElement('div');
    main.classList.add('editor-main');
    root.append(main);

    const toolbar = document.createElement('div');
    toolbar.classList.add('editor-toolbar');
    main.append(toolbar);

    const text = document.createElement('div');
    text.classList.add('editor-textField');
    text.setAttribute('contenteditable', 'true');
    text.setAttribute('spellcheck', 'false');
    main.append(text);





    class ToolbarContainer {
        constructor(htmlClass) {
            this.htmlClass = htmlClass;
        }
        createContainer() {
            const container = document.createElement('div');
            container.classList.add('toolbar-container', this.htmlClass);
            toolbar.append(container);
        }
    }






    class ToolbarButton {
        constructor(htmlClass, tooltip, content, parentClass) {
            this.htmlClass = htmlClass;
            this.tooltip = tooltip;
            this.content = content;
            this.parentContainer = document.querySelector(`.${parentClass}`);
        }
        
        createButton() {
            const btn = document.createElement('button');
            btn.classList.add('toolbar-btn', `toolbar-${this.htmlClass}`);
            btn.setAttribute('data-tooltip', this.tooltip);
            btn.insertAdjacentHTML('afterbegin', this.content);
            this.parentContainer.append(btn);
        }
    }

    new ToolbarContainer('actions-container').createContainer(); // контейнер с кнопками "отменить", "повторить".

    new ToolbarButton('undo', 'отменить', '↺', 'actions-container').createButton();
    new ToolbarButton('redo', 'повторить', '↻', 'actions-container').createButton();





    class ToolbarButtonWithSpanIcon extends ToolbarButton {
        constructor(htmlClass, tooltip, number, parentClass) {
            super(htmlClass, tooltip, parentClass);
            this.parentContainer = document.querySelector(`.${parentClass}`);
            this.number = number;
            this.content = createContent(this.htmlClass, this.number);
            
            function createContent(htmlClass, number) { 
                let icon = '';
                for(let i = 1; i <= number; i++) {
                    const line = `<span class="${htmlClass}-container-${i}"></span>`;
                    icon += line;
                }
                return icon;
            }
        }
    } 

    new ToolbarContainer('justify-container').createContainer(); 

    const arrayOfJustifyBtns = [
                                    ['justifyCenter', 'по центру', 3],
                                    ['justifyFull', 'по ширине', 3],
                                    ['justifyLeft', 'по левому краю', 3],
                                    ['justifyRight', 'по правому краю', 3]
                                ];

    arrayOfJustifyBtns.forEach(item => {
        new ToolbarButtonWithSpanIcon(item[0], item[1], item[2], 'justify-container').createButton();
    }); 



    new ToolbarContainer('textDecoration-container').createContainer(); 

    const arrayOftextDecorationBtns = [
                                        ['bold', 'жирный', '<b>B</b>'],
                                        ['italic', 'курсив', '<i>I</i>'],
                                        ['underline', 'подчеркнутый', '<u>U</u>'],
                                        ['strikethrough', 'зачеркнутый', '<strike>A</strike>'],
                                        ['superscript', 'верхний индекс', 'X<sup>y</sup>'],
                                        ['subscript', 'нижний индекс', 'X<sub>y</sub>'],
                                        ['insertUnorderedList', 'ненумерованный список', '•'],
                                        ['insertOrderedList', 'нумерованный список', '1.'],
                                        ['picture', 'изображение', 'img'],
                                        ['insertHorizontalRule', 'линия', '—'],
                                        ['BLOCKQUOTE', 'цитата', '" "'],
                                        ['H1', 'заголовок 1-го уровня', 'H1'],
                                        ['H2', 'заголовок 2-го уровня', 'H2'],
                                        ['H3', 'заголовок 3-го уровня', 'H3'],
                                        ['insertHTML', 'вставить код', '&#60;/&#62;']

                                    ];

    arrayOftextDecorationBtns.forEach(item => {
        new ToolbarButton(item[0], item[1], item[2], 'textDecoration-container').createButton();
    }); 



    class ToolbarSelect { 
        constructor(htmlClass, content, selectName, parentClass) {
            this.htmlClass = htmlClass;
            this.content = content;
            this.selectName = selectName;
            this.parentContainer = document.querySelector(`.${parentClass}`);
        }

        createSelect() {
            const select = document.createElement('select'); 
            select.classList.add('toolbar-select', `toolbar-${this.htmlClass}`);
            this.parentContainer.append(select);

            const selectName = document.createElement('option');
            selectName.textContent = this.selectName; 
            selectName.setAttribute('selected', 'selected');
            selectName.setAttribute('disabled', 'disabled');
            select.append(selectName);

            this.content.forEach(arr => { 
                const option = document.createElement('option');
                option.setAttribute('value', arr[0]);
                option.classList.add(`${this.htmlClass}-option`);
                option.textContent = arr[1];
                select.append(option);
            });

        }
    }

    new ToolbarContainer('selectableOptions-container').createContainer(); 

    const fontNameArray = [ 
                            ["arial", 'Arial'],
                            ["Courier New", 'Courier New'],
                            ["georgia", 'Georgia'],
                            ["impact", 'Impact'],
                            ["roboto", 'Tahoma'],
                            ["Times New Roman", 'Times New Roman'],
                            ["verdana", 'Verdana'] 
                        ];
                    
    new ToolbarSelect('fontName', fontNameArray, 'Шрифт', 'selectableOptions-container').createSelect();

    const fontSizeArray = [[1, '10px'], [2, '12px'], [3, '14px'], [4, '16px'], 
                        [5, '18px'], [6, '21px'], [7, '26px'],]; 

    new ToolbarSelect('fontSize', fontSizeArray, 'Размер', 'selectableOptions-container').createSelect();

    const lineHeightArray = [ [0.5, '0.5'], [0.75, '0.75'], [1, '1'], [1.5, '1.5'], [2, '2'] ];
    

    new ToolbarSelect('lineHeight', lineHeightArray, 'Интервал', 'selectableOptions-container').createSelect();
    




    class ToolbarInput {
        constructor(htmlClass, inputName, inputType, inputValue, parentClass) {
            this.htmlClass = htmlClass;
            this.inputName = inputName;
            this.inputType = inputType;
            this.inputValue = inputValue;
            this.parentContainer = document.querySelector(`.${parentClass}`);
        }
        createInput() {
            const inputName = document.createElement('span');
            inputName.textContent = this.inputName;
            this.parentContainer.append(inputName);

            const input = document.createElement('input');
            input.classList.add(`toolbar-${this.htmlClass}`);
            input.setAttribute('type', this.inputType);
            input.setAttribute('value', this.inputValue);
            this.parentContainer.append(input);
        }
    }

    new ToolbarInput('foreColor', 'Цвет', 'color', '#ff0000', 'selectableOptions-container').createInput();
    new ToolbarInput('hiliteColor', 'Фон', 'color', '#ffff00', 'selectableOptions-container').createInput();




    new ToolbarContainer('contextOptions-container').createContainer();

    const arrayOfContextOptions = [
                                    ['selectAll', '', 'Select All'],
                                    ['removeFormat', '', 'Clear All'],
                                    ['delete', 'удалить', '&#10007;'],
                                    ['cut', 'вырезать', '&#9988;']
                                ];

    arrayOfContextOptions.forEach(arr => {
        new ToolbarButton(arr[0], arr[1], arr[2], 'contextOptions-container').createButton();
    });


    new ToolbarButtonWithSpanIcon('copy', 'копировать', 2, 'contextOptions-container').createButton();


    new ToolbarButton('toUpperCase', 'верхний регистр', 'А&#8593;', 'contextOptions-container').createButton();
    new ToolbarButton('toLowerCase', 'нижний регистр', 'а&#8595;', 'contextOptions-container').createButton();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderPlainEditor);

/***/ }),

/***/ "./src/runPlainEditorToolbar.js":
/*!**************************************!*\
  !*** ./src/runPlainEditorToolbar.js ***!
  \**************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _highLightButtons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./highLightButtons */ "./src/highLightButtons.js");


function runPlainEditorToolbar() {
    class ToolbarElement { 
        constructor(htmlClass, command) {
            this.htmlClass = htmlClass;
            this.command = command;
            this.element = document.querySelector(this.htmlClass);
        }

        addExecCommandForButton() {
            this.element.addEventListener('click', (defaultUI = false, valueArg = null) => {
                document.execCommand(this.command, defaultUI, valueArg);
            }); 
        }
    }




    class ToolbarElementInsertContent extends ToolbarElement { 
        constructor(htmlClass) {
            super(htmlClass);
            this.command = 'insertHTML';
        }

        insertPicture() {
            this.element.addEventListener('click', () => {
                const insertImg = prompt('Введите URL изображения');
                if(insertImg !== null) {
                    document.execCommand(this.command, false, `<img src=${insertImg}>`);
                }   
            });
        }

        insertHTML() {
            this.element.addEventListener('click', () => {
                if(document.getSelection().isCollapsed) { 
                    const insertText = prompt('Введите текст');
                    if(insertText !== null) {
                        document.execCommand('insertHTML', false, `<pre>${insertText}</pre>`); 
                    }
                } else { 
                    document.execCommand(this.command, false, `<pre>${document.getSelection().toString()}</pre>`);
                } 
            });
        }

        setLineHeight() {
            this.element.addEventListener('input', () => {
                const ancestorContainer = document.getSelection().getRangeAt(0).commonAncestorContainer;
                
                clearStyleOfDomFragment(ancestorContainer); 

                function clearStyleOfDomFragment(container) {

                    if(container.style) {
                        container.style['line-height'] = ''; 
                    } 
                    
                    if(container.children) {
                        const children = Array.from(container.children);
                        //console.log(children);
                        children.forEach(child => {
                            clearStyleOfDomFragment(child);
                        });
                    } 
                }
                
                if(ancestorContainer.style) {
                    ancestorContainer.style['line-height'] = this.element.value;
                } else if (ancestorContainer.parentElement.style) { 
                    ancestorContainer.parentElement.style['line-height'] = this.element.value;
                }   
            });  
        }
    }

    new ToolbarElementInsertContent('.toolbar-picture').insertPicture(); 

    new ToolbarElementInsertContent('.toolbar-insertHTML').insertHTML();

    new ToolbarElementInsertContent('.toolbar-lineHeight').setLineHeight();




    class ToolbarElementForToggleCase extends ToolbarElement { 
        constructor(htmlClass) {
            super(htmlClass);
            this.command = 'insertHTML';
        }

        UpperCase() {
            this.element.addEventListener('click', () => {
                document.execCommand( this.command, false, document.getSelection().toString().toUpperCase() );
            });
        }

        LowerCase() {
            this.element.addEventListener('click', () => {
                document.execCommand(this.command, false, document.getSelection().toString().toLowerCase());
            });
        }
    }
    new ToolbarElementForToggleCase('.toolbar-toUpperCase').UpperCase();

    new ToolbarElementForToggleCase('.toolbar-toLowerCase').LowerCase();




    class ToolbarElementContext extends ToolbarElement { 
        constructor(htmlClass, command) {
            super(htmlClass, command);
            arrayOfToolbarElement.push(this); 
        }
    } 

    const arrayOfToolbarElement = []; 

    const commandsElementContext = ['undo', 'redo', 'justifyCenter', 'justifyFull', 'justifyLeft', 
    'justifyRight', 'insertHorizontalRule', 'selectAll', 'delete', 'cut', 'copy', 'removeFormat'];

    function createToolbarElement(arr, className) { 
        arr.forEach(elem => {
            new className(`.toolbar-${elem}`, elem);
        });
    }

    createToolbarElement(commandsElementContext, ToolbarElementContext);




    class ToolbarElementWithTag extends ToolbarElement { 
        constructor(htmlClass, command, tag) { 
            super(htmlClass, command);
            this.tag = tag;
            arrayOfToolbarElement.push(this); 
            arrayOfToolbarElementWithHighlight.push(this); 
        }
    }

    const arrayOfToolbarElementWithHighlight = [];

    const commandsToolbarElementWithTag = [ 
                                            ['bold', 'B'], 
                                            ['italic', 'I'], 
                                            ['underline', 'U'],
                                            ['strikethrough', 'STRIKE'], 
                                            ['superscript', 'SUP'], 
                                            ['subscript', 'SUB'], 
                                            ['insertUnorderedList', 'UL'],
                                            ['insertOrderedList', 'OL'] 
                                        ];

    function createToolbarElementWithTag(arr) {
        arr.forEach(elem => {
            new ToolbarElementWithTag(`.toolbar-${elem[0]}`, elem[0], elem[1]);
        });
    }

    createToolbarElementWithTag(commandsToolbarElementWithTag);






    class ToolbarElementFormatBlock extends ToolbarElementWithTag {
        constructor(htmlClass, tag) {
            super(htmlClass);
            this.tag = tag;
            this.command = 'formatBlock';
            this.valueArg = this.tag.toLowerCase();
        }
        addExecCommandForButton() {
            this.element.addEventListener('click', (defaultUI = false) => {
                document.execCommand(this.command, defaultUI, this.valueArg);
            });
        }
    }

    const commandsToolbarElementFormatBlock = ['BLOCKQUOTE', 'H1', 'H2', 'H3'];

    createToolbarElement(commandsToolbarElementFormatBlock, ToolbarElementFormatBlock);

    arrayOfToolbarElement.forEach(element => {
        element.addExecCommandForButton();
    });




    class ToolbarElementWithInput extends ToolbarElement {
        constructor(htmlClass, command) {
            super(htmlClass, command);
            arrayOfToolbarElementWithInput.push(this);
        }
        addExecCommandForInput() {
            this.element.addEventListener('input', () => {
            document.execCommand('styleWithCSS', false, true);
            document.execCommand(this.command, false, this.element.value);
            document.execCommand('styleWithCSS', false, false);
            });
        }
    }

    const arrayOfToolbarElementWithInput = [];

    const commandsToolbarElementWithInput = ['fontName', 'fontSize', 'foreColor', 'hiliteColor'];

    createToolbarElement(commandsToolbarElementWithInput, ToolbarElementWithInput);

    arrayOfToolbarElementWithInput.forEach(element => {
        element.addExecCommandForInput();
    });




    
    (0,_highLightButtons__WEBPACK_IMPORTED_MODULE_0__.default)(arrayOfToolbarElementWithHighlight);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (runPlainEditorToolbar);




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/plainEditorScript.js");
/******/ })()
;
//# sourceMappingURL=plainEditor.js.map