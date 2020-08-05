"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 模板
 * @const
 * @private
 */
const STYLE_TEMPLATE = `
.Qalaxy {width: 100%;height: 100%;position: relative;z-index: auto;}
.Qalaxy > .Qalaxy_Render {background-color: rgba(0, 0, 0, 0);position: absolute;z-index: -1;opacity: 0;top: 0;left: 0;}
.Qalaxy > .Qalaxy_Display {position: absolute;z-index: 10;top: 0;left: 0;}
`;
/**
 * 将样式表渲染到页面
 * @returns {void}
 * @public
 */
function default_1() {
    const elem = document.createElement("STYLE");
    elem.innerHTML = STYLE_TEMPLATE;
    document.head.appendChild(elem);
}
exports.default = default_1;
