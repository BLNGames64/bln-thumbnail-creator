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


const versionButton = document.getElementById("versionButton");
const infoModal = document.getElementById("infoModal");
const closeInfo = document.getElementById("closeInfo");





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

document.fonts.ready.then(()=>{

    render();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            fitText();
            adjustBoxHeight();
        });
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

        applyGradientToText();

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

            /*text.style.backgroundImage = `linear-gradient(to bottom, ${top}, ${bottom})`;*/
            

            text.style.setProperty("--top-color", top);
            text.style.setProperty("--bottom-color", bottom);

            text.classList.add("gradient");

            text.style.color = top;
            
            
/*
            text.style.background = "";
            text.style.backgroundImage = "";
            text.style.backgroundColor = "";
            text.style.backgroundClip = "";
            text.style.webkitBackgroundClip = "";
            text.style.webkitTextFillColor = "";

            text.style.color = top;*/
            
            

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
        line.style.lineHeight = size * 0.74 + "px";
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

    text.style.setProperty("--top-color", top);
    text.style.setProperty("--bottom-color", bottom);

    

    text.style.color = top;

    applyGradientToLogo();
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

function applyGradientToText(){

    const texts = document.querySelectorAll(".titleText.gradient");

    texts.forEach(text=>{

        // Evita duplicar imágenes cada vez que renderiza
        const old = text.querySelector(".gradientCanvas");
        if(old) old.remove();


        const top = getComputedStyle(text)
            .getPropertyValue("--top-color");

        const bottom = getComputedStyle(text)
            .getPropertyValue("--bottom-color");


        const rect = text.getBoundingClientRect();

        const canvas = document.createElement("canvas");

        canvas.className = "gradientCanvas";

        const scale = 3;

        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;


        const ctx = canvas.getContext("2d");


        ctx.scale(scale, scale);


        const style = getComputedStyle(text);


        // Misma fuente que el HTML
        ctx.font =
        `${style.fontWeight} ${style.fontSize} "Futura Round", sans-serif`;


        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";


        const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            rect.height
        );


        gradient.addColorStop(0, top.trim());
        gradient.addColorStop(1, bottom.trim());


        ctx.fillStyle = gradient;


        // Ajuste vertical igual al texto HTML
        const y = rect.height * 0.97;


        const spacing = parseFloat(style.letterSpacing) || 0;

        const letters = text.textContent.split("");

        let totalWidth = 0;

        letters.forEach(letter => {
            totalWidth += ctx.measureText(letter).width + spacing;
        });

        let x=(rect.width-totalWidth)/2;


        letters.forEach(letter => {

            ctx.fillText(
                letter,
                x + ctx.measureText(letter).width / 2,
                y
            );

            x += ctx.measureText(letter).width + (spacing * 1.14);

        });


        const img = document.createElement("img");

        img.className="gradientCanvas";

        img.src = canvas.toDataURL();


        img.style.position="absolute";
        img.style.left="0";
        img.style.top="0";
        img.style.width="100%";
        img.style.height="100%";
        img.style.pointerEvents="none";


        // importante: no modifica el layout
        img.style.zIndex="3";


        text.style.color="transparent";

        text.appendChild(img);

    });

}

function applyGradientToLogo(){

    const text = document.querySelector(".logo-text");

    if(!text) return;


    const old = text.querySelector(".logoGradientCanvas");

    if(old) old.remove();


    if(!document.fonts.check('900 20px "Futura Round"')){
        return;
    }


    const top = getComputedStyle(text)
        .getPropertyValue("--top-color");


    const bottom = getComputedStyle(text)
        .getPropertyValue("--bottom-color");


    const rect = text.getBoundingClientRect();

    const textWidth = rect.width - 6;


    const canvas = document.createElement("canvas");

    canvas.className="logoGradientCanvas";


    const scale = 3;

    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;


    const ctx = canvas.getContext("2d");

    ctx.scale(scale,scale);


    const style = getComputedStyle(text);


    ctx.font =
        `${style.fontWeight} ${style.fontSize} "Futura Round", sans-serif`;


    ctx.textAlign="center";
    ctx.textBaseline="alphabetic";


    const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        rect.height
    );


    gradient.addColorStop(0, top.trim());
    gradient.addColorStop(1, bottom.trim());


    ctx.fillStyle=gradient;


    const y = rect.height * 0.97;


    const spacing = parseFloat(style.letterSpacing) || 0;


    const letters=text.textContent.split("");

    let totalWidth=0;


    letters.forEach(letter=>{

        totalWidth += 
            ctx.measureText(letter).width + spacing;

    });


    let x=(textWidth-totalWidth)/2 + 2.2;


    letters.forEach(letter=>{

        ctx.fillText(
            letter,
            x + ctx.measureText(letter).width/2,
            y
        );


        x += ctx.measureText(letter).width + spacing;

    });



    const img=document.createElement("img");

    img.className="logoGradientCanvas";


    img.src=canvas.toDataURL();


    img.style.position="absolute";
    img.style.left="0";
    img.style.top="0";
    img.style.width="100%";
    img.style.height="100%";
    img.style.pointerEvents="none";
    img.style.zIndex="3";


    text.style.color="transparent";

    text.appendChild(img);

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
/*exportBtn.addEventListener("click", () => {

    setTimeout(() => {

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

    }, 200);

});*/

exportBtn.addEventListener("click", async () => {

    const canvas = document.createElement("canvas");

    canvas.width = 3840;
    canvas.height = 2160;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#202020";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const img = new Image();

    img.src = canvas.toDataURL("image/png");

    const win = window.open();

    win.document.body.style.margin="0";
    win.document.body.appendChild(img);

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

fetch("manifest.json")
.then(response => response.json())
.then(data => {

    const versionButton = document.getElementById("versionButton");
    const modalVersion = document.getElementById("modalVersion");
    const modalChanges = document.getElementById("modalChanges");

    // Texto inferior de la aplicación
    versionButton.textContent = data.version;

    // Datos del popup
    modalVersion.textContent = data.version;

    modalChanges.innerHTML = data.message.replace(/\n/g, "<br>");

})
.catch(error => {
    console.error("Error cargando version.json:", error);
});


versionButton.addEventListener("click",()=>{

    infoModal.style.display="flex";

});


closeInfo.addEventListener("click",()=>{

    infoModal.style.display="none";

});


infoModal.addEventListener("click",(e)=>{

    if(e.target === infoModal){
        infoModal.style.display="none";
    }

});