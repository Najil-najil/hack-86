gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

(async () => {
    json0 = await fetch('https://raw.githubusercontent.com/isladjan/jsonFiles/main/json0.json').then(res => res.json());
    jsonData = json0;
    painting_Countdown();
})();
let json1 = fetch('https://raw.githubusercontent.com/isladjan/jsonFiles/main/json1.json').then(response => response.json());
let json2 = fetch('https://raw.githubusercontent.com/isladjan/jsonFiles/main/json2.json').then(response => response.json());
let json3 = fetch('https://raw.githubusercontent.com/isladjan/jsonFiles/main/json3.json').then(response => response.json());


const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});
document.body.appendChild(app.view);


const scene = new PIXI.Container();
scene.pivot.set(app.screen.width / 2, app.screen.height / 2)
scene.x = app.screen.width / 2;
scene.y = app.screen.height / 2;
app.stage.addChild(scene);


let jsonData = [],
amount = 1600,
row = 80,
column = 20,
element_width = Math.round(app.screen.width / 90),
element_height = Math.round(app.screen.width / 90),
frame = 0,
interval,
ms = 100;


function setupElements() {
    let temp = 0;
    let x = 0;
    let y;
    
    let spaceX = (app.screen.width - app.screen.width / row) / row;
    let spaceY = (app.screen.height - app.screen.height / column) / column;
    y = spaceY;

    for (let i = 1; i < amount + 1; i++) {
        if (temp === row) {
            temp = 0;
            x = 0;
            y += spaceY;
        }

        x += spaceX;
        temp++;

        if (scene.children.length === amount) {
            scene.children[i - 1].x = Math.round(x);
            scene.children[i - 1].y = Math.round(y);
        } else {
            let rect = new PIXI.Graphics();
            rect.beginFill(0xFFFFFF);       
            rect.tint = 0x000000;         
            rect.drawRoundedRect(0, 0, element_width, element_width, 5);
            rect.endFill();
            rect.pivot.set(element_width / 2, element_height / 2)
            rect.x = Math.round(x);
            rect.y = Math.round(y);
            //rect.cacheAsBitmap = true;
            scene.addChild(rect);
        }

        if (app.screen.height < 350) scene.children[i - 1].height = element_height / 1.8;
        else if (app.screen.height > 250 && app.screen.height < 550) scene.children[i - 1].height = element_height;
        else scene.children[i - 1].height = element_height * 1.5;

        if (app.screen.width < 1000) scene.children[i - 1].width = element_width / 1.7;
        else scene.children[i - 1].width = element_width;
    }
}
setupElements();


function painting_Countdown() {
    let angle = 30;
    let x = -800;
    let y = 100;
    let scale = 5;

    for (var i = 0; i < scene.children.length; i++) {
        let element = scene.children[i];
        let color = jsonData[frame][i];

        (color === "b") ? element.tint = 0x000000 : element.tint = "0x" + color;
    }

    if (frame === 1) {
        angle = 100;
        x = app.screen.width / 2;
        y = app.screen.height / 2 + 1100;
        scale = 5;
    }
    else if (frame === 2) {
        angle = -60;
        x = 1000;
        y = -80;
        scale = 3;
    }

    gsap.to(scene, {
        pixi: { scale: scale, rotation: angle, x: x, y: y },
        duration: 1.7,
        ease: "power3.in",
        onComplete: () => {
            gsap.set(scene, { pixi: { scale: 1, rotation: 0 } });
            scene.pivot.set(app.screen.width / 2, app.screen.height / 2)
            scene.x = app.screen.width / 2;
            scene.y = app.screen.height / 2;
            if (frame < 3) painting_Countdown();      
            else {
                for (let i = 0; i < scene.children.length; i++) { scene.children[i].tint = 0x000000 }  //fix
                jsonStart(json1)
                return;
            }
        }
    });
    frame++;
}


function painting() {
    if (frame === jsonData.length) {
        if (jsonData.length === 272) jsonStart(json2)
        else if (jsonData.length === 333) jsonStart(json3)
        else if (jsonData.length === 723) {
            ms = 70; 
            jsonStart(json1)
        }
        return;
    }

    for (var i = 0; i < scene.children.length; i++) {
        let element = scene.children[i];
        let color = jsonData[frame][i];

        (color === "b") ? element.tint = 0x000000 : element.tint = "0x" + color;
    }
    frame++
}


async function jsonStart(json) {
    clearInterval(interval);
    jsonData = await json.then((response) => { return response })
    frame = 0;
    painting()
    interval = window.setInterval(() => { painting() }, ms);
}


window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    setupElements()
});