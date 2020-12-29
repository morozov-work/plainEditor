import getHighlightButtons from './getHighlightButtons';

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
        const highLight = getHighlightButtons(root); 
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

export default highLightButtons;

