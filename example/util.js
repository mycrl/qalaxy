"use strict"

/**
 * 随机数
 * @returns {number}
 * @private
 */
function Rand(rang) {
    return Math.ceil(Math.random() * rang)
}

/**
 * 生成弹幕
 * @returns {object}
 * @private
 */
function Value() {
    const text = new Array(Rand(20)).fill(0).map(x => Rand(10)).join("")
    const color = new Array(3).fill(0).map(() => Rand(255))
    return {text, color: "rgba(" + color + ", 1)"}
}

/**
 * 模拟弹幕列表生成
 * @returns {object[]}
 * @public
 */
export function MockValues() {
    return new Array(Rand(200))
        .fill({})
        .map(Value)
}