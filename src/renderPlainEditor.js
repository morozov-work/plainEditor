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

export default renderPlainEditor;