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
    setInterval(() => qalaxy.append(MockValues()), 1000)
})