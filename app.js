/*const app = */Vue.createApp({
    data(){
        return {
            title: 'Scrolling text',
            text: '',
            xPointer: 0,
            gifWidth: 960,
            gifSpeed: 8,
            fps: 60,
            pipOrder: 'cyan magenta yellow',
            advanced: false,
            validColors: ["cyan", "magenta", "yellow", "royale", "harmony"]
        }
    },
    computed: {
        charList(){
            return Object.keys(characters).join("");
        }
    },
    methods: {
        createPNG(){
            this.text = this.text.toUpperCase();
            let colors = this.calculateColors();
            let canvas = document.createElement("canvas");
            canvas.setAttribute("width", this.calculateWidth());
            canvas.setAttribute("height", 120+24*2);
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = "#1c1b33";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.xPointer = 24;
            this.drawText(ctx, colors, this.text);
            this.downloadImage(canvas.toDataURL("data:image/png"), 'royaleText.png');
        },
        createGIF(){
            this.text = this.text.toUpperCase();
            let colors = this.calculateColors();
            let canvas = document.createElement("canvas");
            canvas.setAttribute("width", this.calculateWidth()+this.gifWidth*2);
            canvas.setAttribute("height", 120+24*2);
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = "#1c1b33";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.xPointer = 24+this.gifWidth;
            this.drawText(ctx, colors, this.text);

            let frameCanvas = document.createElement("canvas");
            frameCanvas.setAttribute("width", this.gifWidth);
            frameCanvas.setAttribute("height", canvas.height);
            let ctxFrame = frameCanvas.getContext("2d");

            let capturer = new CCapture( {
                framerate: this.fps,
                format: 'gif',
                workersPath: './libs/',
                verbose: true
            });

            capturer.start();

            for(let i=0; i<canvas.width-this.gifWidth; i+=this.gifSpeed){
                ctxFrame.drawImage(canvas,
                    i,0,this.gifWidth,canvas.height,
                    0,0,frameCanvas.width,frameCanvas.height);
                
                capturer.capture(frameCanvas);
            }

            capturer.stop();
            capturer.save();
        },
        drawPip(ctx, img, x, y){
            ctx.drawImage(img, x+3, y+3, 18, 18);
        },
        drawCharacter(ctx, img, ch) {
            if (ch in characters) {
                ch = characters[ch];
                for (let row = 0; row < ch.length; row++) {
                    for (let col = 0; col < ch[0].length; col++) {
                        if (ch[row][col]) {
                            this.drawPip(ctx, img, this.xPointer + 24 * col, 24 * row + 24);
                        }
                    }
                }
                this.xPointer += (ch[0].length + 1) * 24;
            }
        },
        drawText(ctx, colors, text) {
            text = text.split(" ");
            for (let i = 0; i < text.length; i++) {
                let c = colors[i % colors.length];
                for (const l of text[i]) {
                    this.drawCharacter(ctx, c, l);
                }
            }
        },
        calculateWidth(){
            let w = 0;
            for(const c of this.text){
                if(c in characters){
                    w += 24*(characters[c][0].length+1);
                }
            }
            return w+24;
        },
        calculateColors(){
            let colors = [];
            for(const c of this.pipOrder.split(' ')){
                if(this.validColors.includes(c)){
                    colors.push(document.getElementById(c+"_pip"));
                }
            }
            return colors;
        },
        toggleSettings(){
            this.advanced = !this.advanced;
        },
        downloadImage(img, name){
            let link = document.createElement('a');
            link.download = name;
            link.href = img;
            link.click();
        }
    }
}).mount('#app')