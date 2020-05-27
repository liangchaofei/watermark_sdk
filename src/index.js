
import markCanvas from './markCanvas';

function once(fn, errMsg) {
    let done = false;
    return function(...args) {
        if (!done) {
            done = true;
            return fn(...args);
        } else {
            console.warn(errMsg)
        }
    };
}

function WaterMark({
    text = '水印',
    fontSize=25,
    opacity = 1,
    width = 30,
    height = 60,
    zIndex = 9999,
    color = '#e1e1e1',
    rotateDegree = 35,
    containerDom = document && document.body,
    ignoreAttr = [],
    onChange = Function.prototype,
}){

    if (!text) {
        console.warn(`text is undefined`);
    };
     if (!(containerDom instanceof HTMLElement)) {
        throw new Error('containerDom must be HTMLElement')
    }


    let _watermarkDom, _dom;

    let font = `${fontSize}px Arial`;
    let alpha = opacity;
    let rotate = rotateDegree * Math.PI / 180;

    let position = containerDom === document.body ? 'fixed' : 'absolute';

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    const _observer = function(observer) {
        const _childObserverConfig = {  
            childList: true, // 观察目标子节点的变化，添加或者删除
            attributes: true,
            subtree: false // 默认为 false，设置为 true 可以观察后代节点
        }
        const _bodyObserverConfig = {
            childList: true,
            attributes: false,
            subtree: false,
        }
        observer.observe(_watermarkDom, _childObserverConfig);
        observer.observe(containerDom, _bodyObserverConfig);
    }

    const observer = new MutationObserver((mutationsList) => {
        mutationsList.map((mutations) => {
            if (
                mutations.type === 'childList'
                && mutations.target === containerDom
                && mutations.removedNodes.length > 0
                && Array.prototype.indexOf.call(mutations.removedNodes, _watermarkDom) > -1
            ) {
                // 水印节点被移除, 重新添加水印节点
                observer.disconnect();
                _watermarkDom = _dom.cloneNode(true);
                containerDom.appendChild(_watermarkDom);
                onChange();
                _observer(observer);
            }
            else if (mutations.target === _watermarkDom) {
                if (ignoreAttr.length 
                    && mutations.type === 'attributes' 
                    && ignoreAttr.indexOf(mutations.attributeName) !== -1) {
                        return;
                }

                containerDom.removeChild(_watermarkDom);
            }
        })
    });
    
    // 水印base64生成
    const generateFunc = markCanvas;
    const markImage = generateFunc({
        text,
        width,
        height,
        color,
        rotate,
        fontSize,
    });

    const cssText = `
        position: ${position};
        width: 100%;
        height: 100%;
        z-index: ${zIndex};
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: url(${markImage})
    `
    _dom = document.createElement('div');
    _dom.style.cssText = cssText;
    _watermarkDom = _dom.cloneNode(true)
    containerDom.appendChild(_watermarkDom);
    _observer(observer);

    return {
        destroy: once(function() {
            observer.disconnect();
            containerDom.removeChild(_watermarkDom);
        }, 'watermark')
    }
    
}
WaterMark({})
window.WaterMark = WaterMark;
export default WaterMark;