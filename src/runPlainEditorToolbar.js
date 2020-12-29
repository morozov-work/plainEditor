import highLightButtons from './highLightButtons';

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




    
    highLightButtons(arrayOfToolbarElementWithHighlight);
}

export default runPlainEditorToolbar;


