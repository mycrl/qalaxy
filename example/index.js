import Qalaxy from "../src/index.js"
import {MockValues} from "./util.js"

const CONFIGURE = {
    el: "#testing", 
    rate: 10, 
    opacity: 0.7,
    size: 14,
    font: "cursive",
    color: "#fff" 
}

window.addEventListener("load", function() {
    const qalaxy = new Qalaxy(CONFIGURE)
    setInterval(() => qalaxy.append(MockValues()), 300)
    
    const date = document.getElementById("time")
    date.innerText = "倒计时: 10"
    
    let index = 0
    let loop = setInterval(() => {
        index += 1
        date.innerText = "倒计时: " + String(10 - index)
        if (index >= 10) {
            clearInterval(loop)
            date.innerText = ""
        }
    }, 1000)
})