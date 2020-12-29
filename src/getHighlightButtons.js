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

export default getHighlightButtons;