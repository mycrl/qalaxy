"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 配置处理
 *
 * @param {Config} config 配置
 * @returns {Option} 参数
 * @public
 */
exports.default = (option) => ({
    render: document.createElement("CANVAS"),
    el: document.querySelector(option.el),
    color: option.color || "#FFFFFF",
    font: option.font || "cursive",
    rate: option.rate || 10,
    size: option.size || 14,
    opacity: option.opacity
});
