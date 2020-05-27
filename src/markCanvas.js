/*
 * @Author: your name
 * @Date: 2020-05-25 14:39:06
 * @LastEditTime: 2020-05-27 15:04:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ssa-watermark/src/markCanvas.js
 */ 

function transform(source, matrix) {
    return matrix.map(function (item) {
        return Math.floor(item.reduce(function (result, next, index) {
            return result + next * source[index];
        }, 0));
    });
}

function watermarkGenerate() {
    const DEAFULT_OP = {
        width: 160,
        height: 160,
        color: '#e1e1e1',
        font: '16px Arial',
        rotate: -Math.PI / 12,
        fontSize: '25px'
    }

    let canvas, ctx;

    return function(options) {
        if (!options.text) {
            return '';
        }

        if (!canvas || !ctx) {
            if (typeof document !== 'undefined') {
                canvas = document.createElement('canvas');
            } else {
                // 只支持浏览器生成水印
                return '';
            }
            ctx = canvas && canvas.getContext && canvas.getContext('2d');
            if (!canvas || !ctx) return '';
        }

        options = Object.assign({}, DEAFULT_OP, options);
        ctx.font = options.font;
        // 计算text宽度
        var textMetrics = ctx.measureText(options.text);
        var textWidth = Math.floor(options.width) + 1;
    
        var startX = 0;
        var startY = 240;
        var rotateRadian = options.rotate;
        var rotateCos = Math.cos(rotateRadian);
        var rotateSin = Math.sin(rotateRadian);
        var horizontalInterval = Math.floor(textWidth * rotateCos);
        var verticalInterval = 250;
        var deltaVertial = Math.floor(textWidth * rotateSin);
    
        ctx.canvas.width = horizontalInterval * 3;
        ctx.canvas.height = verticalInterval * 2;
        ctx.font = `200 ${options.fontSize} "pingFangSC-Regular", "Myriad Pro", "Hiragino Sans GB", "Microsoft Yahei", sans-serif`;
        ctx.fillStyle = options.color;
        ctx.rotate(-rotateRadian);
    
        /**
         * 计算水印meta块各点坐标
         * __________________________
         * |        (x3, y3)        |
         * |                        |
         * |(x1, y1)        (x5, y5)|
         * |                        |
         * |        (x4, y4)        |
         * |                        |
         * |(x2, y2)        (x6, y6)|
         * |________________________|
         * */
    
        var matrix = [[rotateCos, -rotateSin], [rotateSin, rotateCos]];
    
        var t1 = transform([startX, startY], matrix);
        var x1 = t1[0];
        var y1 = t1[1];
        ctx.fillText(options.text, x1 + 5, y1);
        var t2 = transform([startX, startY + verticalInterval], matrix);
        var x2 = t2[0];
        var y2 = t2[1];
        ctx.fillText(options.text, x2 + 5, y2);
        var t3 = transform([startX + horizontalInterval, startY - deltaVertial - verticalInterval / 2], matrix);
        var x3 = t3[0];
        var y3 = t3[1];
        ctx.fillText(options.text, x3, y3);
        var t4 = transform([startX + horizontalInterval, startY - deltaVertial + verticalInterval / 2], matrix);
        var x4 = t4[0];
        var y4 = t4[1];
        ctx.fillText(options.text, x4, y4);
        var t5 = transform([startX + 2 * horizontalInterval, startY - 2 * deltaVertial], matrix);
        var x5 = t5[0];
        var y5 = t5[1];
        ctx.fillText(options.text, x5, y5);
        var t6 = transform([startX + 2 * horizontalInterval, startY - 2 * deltaVertial + verticalInterval], matrix);
        var x6 = t6[0];
        var y6 = t6[1];
        ctx.fillText(options.text, x6, y6);

        return canvas.toDataURL();
    }
    
}

export default watermarkGenerate();