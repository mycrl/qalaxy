"use strict"

/**
 * 参数
 * @param {string} [option.el] 画布节点
 * @param {number} [option.rate?] 帧移动速率
 * @param {string} [option.color?] 默认字体颜色
 * @param {number} [option.opacity?] 默认字体透明度
 * @param {number} [option.size?] 默认字体大小
 * @param {string} [option.font?] 默认字体
 */
export interface Config {
    el: string
    rate: number
    color?: string
    opacity?: number
    size?: number
    font?: string
}

/**
 * 配置
 * @param {element} [option.el] 画布节点
 * @param {element} [option.render] 渲染画布节点
 * @param {number} [option.rate?] 帧移动速率
 * @param {string} [option.color?] 默认字体颜色
 * @param {number} [option.opacity?] 默认字体透明度
 * @param {number} [option.size?] 默认字体大小
 * @param {string} [option.font?] 默认字体
 */
export interface Option {
    render: HTMLCanvasElement
    el: Element
    rate: number
    color?: string
    opacity?: number
    size?: number
    font?: string
}

/**
 * 配置处理
 * 
 * @param {Config} config 配置
 * @returns {Option} 参数
 * @public
 */
export default (option: Config): Option => ({
    render: <HTMLCanvasElement>document.createElement("CANVAS"),
    el: document.querySelector(option.el)!,
    color: option.color || "#FFFFFF",
    font: option.font || "cursive",
    rate: option.rate || 10,
    size: option.size || 14,
    opacity: option.opacity
})
