"use strict"

/**
 * 配置处理
 * 
 * @param {string} [option.el] 画布节点
 * @param {number} [option.rate?] 帧移动速率
 * @param {string} [option.color?] 默认字体颜色
 * @param {number} [option.opacity?] 默认字体透明度
 * @param {number} [option.size?] 默认字体大小
 * @param {string} [option.font?] 默认字体
 * 
 * @returns {element} [option.el] 画布节点
 * @returns {element} [option.render] 渲染画布节点
 * @returns {number} [option.rate] 帧移动速率
 * @returns {string} [option.color] 默认字体颜色
 * @returns {number} [option.opacity] 默认字体透明度
 * @returns {number} [option.size] 默认字体大小
 * @returns {string} [option.font] 默认字体
 * @public
 */
export default (option) => ({
    render: document.createElement("CANVAS"),
    el: document.querySelector(option.el),
    color: option.color || "#FFFFFF",
    font: option.font || "cursive",
    rate: option.rate || 10,
    size: option.size || 14,
    opacity: option.opacity
})