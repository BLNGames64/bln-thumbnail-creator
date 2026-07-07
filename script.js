// =========================
// BLN Thumbnail Creator
// Script v0.5 FIX TOTAL
// =========================

const imageInput = document.getElementById("imageInput");
const titleInput = document.getElementById("titleInput");
const colorPicker = document.getElementById("colorPicker");
const topColorPicker = document.getElementById("topColorPicker");
const bottomColorPicker = document.getElementById("bottomColorPicker");

const darknessSlider = document.getElementById("darknessSlider");

const singleMode = document.getElementById("singleMode");
const doubleMode = document.getElementById("doubleMode");

const singleColorBox = document.getElementById("singleColorBox");
const doubleColorBox = document.getElementById("doubleColorBox");
const exportBtn = document.getElementById("exportBtn");

const backgroundImage = document.getElementById("backgroundImage");
const titleContainer = document.getElementById("titleContainer");
const logoGames = document.querySelector(".logo-games");
const textBox = document.getElementById("textBox");

const boxWidthSlider = document.getElementById("boxWidthSlider");

// =========================
// ESTADO
// =========================

const state = {
    title: [],
    activeLines: [],

    gradientMode: "single",

    color: "#ff0000",

    topColor: "#ff0000",
    bottomColor: "#b30000"

};

function autoResizeTextarea(){

    titleInput.style.height = "auto";
    titleInput.style.height = titleInput.scrollHeight + "px";

}

// =========================
// INICIO
// =========================

init();

function init(){

    state.title = titleInput.value
        .split("\n")
        .filter(l => l.trim() !== "");

    state.activeLines = [state.title.length - 1];

    textBox.style.width = boxWidthSlider.value + "%";

    autoResizeTextarea();

    render();

    // 🔥 doble frame para estabilizar fonts + layout
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            fitText();
            adjustBoxHeight();
        });
    });
}

// =========================
// RENDER
// =========================

function render(){
    renderTitle();
    updateLogo();

    requestAnimationFrame(() => {
        fitText();
        adjustBoxHeight();
    });
}

// =========================
// TITULO
// =========================

function renderTitle(){

    titleContainer.innerHTML = "";

    state.title.forEach((line, index)=>{

        const wrapper = document.createElement("div");
        wrapper.className = "titleLine";

        const shadow = document.createElement("div");
        shadow.className = "titleShadow";
        shadow.textContent = line.toUpperCase();

        const text = document.createElement("div");
        text.className = "titleText";
        text.textContent = line.toUpperCase();

        if(state.activeLines.includes(index)){

            let top, bottom;

            if(state.gradientMode === "single"){

                const amount = parseInt(darknessSlider.value);

                top = state.color;
                bottom = darkenColor(state.color, amount);

            }else{

                top = state.topColor;
                bottom = state.bottomColor;
            }

            text.style.background = `linear-gradient(to bottom, ${top}, ${bottom})`;
            text.style.webkitBackgroundClip = "text";
            text.style.backgroundClip = "text";
            text.style.color = "transparent";
            text.style.webkitTextFillColor = "transparent";

        } else {
            text.style.color = "white";
        }

        shadow.style.position = "absolute";
        shadow.style.left = "2px";
        shadow.style.top = "3px";
        shadow.style.color = "rgba(0,0,0,0.55)";
        shadow.style.pointerEvents = "none";

        wrapper.addEventListener("click", ()=>{

            if(state.activeLines.includes(index)){
                state.activeLines = state.activeLines.filter(i => i !== index);
            } else {
                state.activeLines.push(index);
            }

            render();
        });

        wrapper.appendChild(shadow);
        wrapper.appendChild(text);
        titleContainer.appendChild(wrapper);

        wrapper.style.position = "relative";
        wrapper.style.width = "100%";

    });
}

// =========================
// AUTO ESCALA TEXTO
// =========================

function fitText(){

    const lines = document.querySelectorAll(".titleText");

    if(lines.length === 0) return;

    const containerWidth = titleContainer.clientWidth - 8;

    lines.forEach(line=>{

        const shadow = line.parentElement.querySelector(".titleShadow");

        // Estado limpio
        line.style.fontSize = "100px";
        line.style.letterSpacing = "0px";

        if(shadow){
            shadow.style.fontSize = "100px";
            shadow.style.letterSpacing = "0px";
        }

        const width = line.scrollWidth;

        if(width === 0) return;

        const size = Math.max(
            10,
            Math.min((containerWidth / width) * 99, 200)
        );

        const spacing = -size * 0.065;

        line.style.fontSize = size + "px";
        line.style.lineHeight = size * 0.72 + "px";
        line.style.letterSpacing = spacing + "px";

        if(shadow){

            shadow.style.fontSize = size + "px";
            shadow.style.lineHeight = size * 0.72 + "px";
            shadow.style.letterSpacing = spacing + "px";

        }

    });

}

function adjustBoxHeight(){

    const lines = document.querySelectorAll(".titleLine");

    let totalHeight = 0;

    lines.forEach(line=>{
        totalHeight += line.offsetHeight;
    });

    textBox.style.height = (totalHeight + 20) + "px";

}


// =========================
// LOGO
// =========================

function updateLogo(){

    let top, bottom;

    if(state.gradientMode === "single"){

        const amount = parseInt(darknessSlider.value);

        top = state.color;
        bottom = darkenColor(state.color, amount);

    } else {
        top = state.topColor;
        bottom = state.bottomColor;
    }

    const text = document.querySelector(".logo-text");

    text.style.background = `linear-gradient(to bottom, ${top}, ${bottom})`;
    text.style.backgroundClip = "text";
    text.style.webkitBackgroundClip = "text";
    text.style.color = "transparent";
    text.style.webkitTextFillColor = "transparent";
}

function darkenColor(hex, percent){

    let r = parseInt(hex.substring(1,3),16);
    let g = parseInt(hex.substring(3,5),16);
    let b = parseInt(hex.substring(5,7),16);

    r = Math.floor(r * (100-percent)/100);
    g = Math.floor(g * (100-percent)/100);
    b = Math.floor(b * (100-percent)/100);

    return "#" +
        r.toString(16).padStart(2,"0") +
        g.toString(16).padStart(2,"0") +
        b.toString(16).padStart(2,"0");

}

// =========================
// EVENTOS
// =========================

// texto
titleInput.addEventListener("input",()=>{

    autoResizeTextarea();

    state.title = titleInput.value
        .split("\n")
        .filter(l => l.trim() !== "");

    // Mantener las líneas activas que sigan existiendo
    state.activeLines = state.activeLines.filter(i => i < state.title.length);

    // Si no queda ninguna activa, activar la última
    if(state.activeLines.length === 0){
        state.activeLines = [state.title.length - 1];
    }

    render();

    requestAnimationFrame(fitText);

});

// color
colorPicker.addEventListener("input",()=>{

    state.color = colorPicker.value;

    render();
});

// Deslizable
darknessSlider.addEventListener("input", () => { 
        render();
});

// Tamaño de la caja
boxWidthSlider.addEventListener("input", ()=>{

    textBox.style.width = boxWidthSlider.value + "%";

    fitText();
    adjustBoxHeight();
});


topColorPicker.addEventListener("input",()=>{

    state.topColor = topColorPicker.value;

    render();

});

bottomColorPicker.addEventListener("input",()=>{

    state.bottomColor = bottomColorPicker.value;

    render();

});


singleMode.addEventListener("click",()=>{

    state.gradientMode = "single";

    singleMode.classList.add("active");
    doubleMode.classList.remove("active");

    singleColorBox.style.display = "flex";
    doubleColorBox.style.display = "none";


    render();

});

doubleMode.addEventListener("click",()=>{

    state.gradientMode = "double";

    singleMode.classList.remove("active");
    doubleMode.classList.add("active");

    singleColorBox.style.display = "none";
    doubleColorBox.style.display = "flex";

    render();

});

// imagen
imageInput.addEventListener("change",(e)=>{

    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = ()=>{
        backgroundImage.src = reader.result;
        backgroundImage.style.display = "block";
    };

    reader.readAsDataURL(file);
});

// =========================
// RESIZE CAJA (ESQUINA)
// =========================

/*let resizing = false;

const handle = document.getElementById("resizeHandle");

handle.addEventListener("mousedown", ()=>{
    resizing = true;
});

document.addEventListener("mouseup", ()=>{
    resizing = false;
});

document.addEventListener("mousemove", (e)=>{

    if(!resizing) return;

    const rect = textBox.getBoundingClientRect();

    let newWidth = e.clientX - rect.left;
    //let newHeight = rect.bottom - e.clientY;

    // límites mínimos y máximos
    newWidth = Math.max(40, Math.min(newWidth, window.innerWidth * 0.9));
    //newHeight = Math.max(20, Math.min(newHeight, window.innerHeight * 0.8));

    textBox.style.width = newWidth + "px";
    //textBox.style.height = newHeight + "px";

    fitText();
    adjustBoxHeight();
});*/

// =========================
// EXPORTAR PNG
// =========================

exportBtn.addEventListener("click", () => {

    html2canvas(document.getElementById("preview"), {

        scale: 3,
        useCORS: true,
        backgroundColor: null

    }).then(canvas => {

        const link = document.createElement("a");

        link.download = "thumbnail.png";
        link.href = canvas.toDataURL("image/png");

        link.click();

    });

});

// =========================
// PWA
// =========================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("Service Worker registrado");
            })
            .catch(err => {
                console.error(err);
            });

    });

}
