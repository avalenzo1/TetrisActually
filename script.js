const initialize = (canvas) => {
    let dpr = window.devicePixelRatio || 1;
    let rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    let ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
};

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};

let CANVAS_WIDTH = 1080 / 3,
    CANVAS_HEIGHT = 1920 / 3;

let Tetris = (function() {
    let blocksPlaced = new Array();
    let score = 0;
    let cont = {
        x: 60,
        y: 130,
        rows: 15,
        columns: 10,
        squareSize: 20
    };
    let isReady = false;
    let current;
    
    class Block {
            constructor(column, row, type, ctx) {
            this.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
            this.tetrisTypes = {
                    iBlock: [
                        [0, 0],
                        [0, 1],
                        [0, 2],
                        [0, 3],
                    ],
                    jBlock: [
                        [0,0],
                        [0,1],
                        [1,1],
                        [2,1]
                    ],
                    lBlock: [
                    	[0,1],
                        [1,1],
                        [2,1],
                        [2,0],
                    ],
                    oBlock: [
                    	[0,0],
                        [1,0],
                        [0,1],
                        [1,1]
                    ],
                    sBlock: [
                    	[0,1],
                        [1,1],
                        [1,0],
                        [2,0]
                    ],
                    tBlock: [
                    	[1,0],
                        [0,1],
                        [1,1],
                        [2,1]
                    ],
                    zBlock: [
                    	[0,0],
                        [1,0],
                        [1,1],
                        [2,1]
                    ],
                };
                
                this.current = this.tetrisTypes[type];
                
                if (type === 'random') {
                	this.current = randomProperty(this.tetrisTypes);
               }
                
                this.dim = this.calcDim();
                
                this.column = column;
                this.row = row;
                
                this.ctx = ctx;
                this.isMovable = true;
            }
        
        	
        
            calcDim() {
                let w = 0, h = 0;
                
                for (let i = 0; i < this.current.length; i++)
                {
                    
                    if (w <= this.current[i][0] + 1) {
                        w = this.current[i][0] + 1;
                    }
                    
                    if (h <= this.current[i][1] + 1) {
                        h = this.current[i][1] + 1;
                        
                    }
                }
                
                return [w, h];
            
                }
        
            right() {
                if (current.column + current.dim[0] < cont.columns) {
                	current.column++;
                }
                
                 this.checkCollision();
            }

            left() {
                if (current.column > 0) {
                    current.column--;
                }

                this.checkCollision();
            }
        
        	down() {
                if (current.row + current.dim[1] - 1 < cont.rows) {
                    current.row++;
                }
                
                this.checkCollision();
            }
        
        
        	checkCollision() {
                let collision = false;
                for (let i = 0; i < blocksPlaced.length; i++) {
                	for (let a = 0; a < blocksPlaced[i].current.length; a++) {
                        for (let b = 0; b < this.current.length; b++) {
                            let column = [this.current[b][0] + this.column, blocksPlaced[i].current[a][0] + blocksPlaced[i].column];
                            let row = [this.current[b][1] + this.row,  blocksPlaced[i].current[a][0] + blocksPlaced[i].row];
                        	if(column[0] >= column[1] && row[0] >= row[1]) {
                            	collision = true;
                            }
                    	}
                    }
                }
                
                if (current.row + current.dim[1] - 1 === cont.rows || collision) {
                    blocksPlaced.push(current);
                    collision = false;
                    current = new Block(4,0, 'random', ctx);
                }
            }
        
        	rotate() {
				
            }

            render() {
                this.ctx.fillStyle = this.fillStyle;
                
                this.current.forEach(el => {
                	this.ctx.fillRect(cont.x + (el[0] + this.column) * cont.squareSize, cont.y + (el[1] + this.row) * cont.squareSize, cont.squareSize, cont.squareSize);
                });
            }
        }

    return {
        cont,
        current,
        score,
        init: (canvas, ctx) => {
            current = new Block(4, 0, 'random', ctx);
            let interval_c = setInterval( () => {
				current.down();
            }, 100);
            
            isReady = true;
            
            canvas.addEventListener("keydown", (e) => {
            	switch (e.key) {
                    case 'ArrowRight':
                        current.right();
                        break;
                    case 'ArrowLeft':
                        current.left();
                        break;
                    case 'ArrowDown':
                        current.down();
                        break;
                    case 'ArrowUp':
                        current.rotate();
                }
            });
        },
        render: (ctx) => {
            this.ctx = ctx;
            if (isReady) {
                this.tile = [];
                this.tile.x = 0;
                this.tile.y = 0;
                
               	ctx.fillStyle = '#000';

                for (let row = 0; row <= cont.rows; row++) {
                    this.tile.y = cont.squareSize * row + cont.y;

                    for (let column = 0; column < cont.columns; column++) {
                        this.tile.x = cont.squareSize * column + cont.x;
                        this.ctx.fillRect(this.tile.x, this.tile.y, cont.squareSize, cont.squareSize);
                        this.ctx.strokeRect(this.tile.x, this.tile.y, cont.squareSize, cont.squareSize);
                    }
                }
                
                if (blocksPlaced) {
                	for (let i = 0; i < blocksPlaced.length; i++) {
                        
                    	blocksPlaced[i].render();
                    }
                }
                current.render();

            } else {
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`Loading`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            }
        }
    };
})();

let main = (function() {
    let canvas = document.getElementById("tetris");
    let ctx = initialize(canvas);
    const times = new Array();
    let fps;

    Tetris.init(canvas, ctx);

    let render = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        ctx.fillStyle = "#aac";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = "#000";
        ctx.font = 'bold 15px Verdana';
        ctx.strokeStyle = "#fff";
        ctx.fillText(`Broken Tetris`, 0, 15);
        ctx.fillText(`FPS: ${fps} Score: ${Tetris.score}`, 0, 35);

        try {
            Tetris.render(ctx);
        } catch (error) {
            ctx.textAlign = 'center';
            ctx.fillText(`${error}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            throw new Error(error);
        }
        window.requestAnimationFrame(() => {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            render();
        });
    };

    return {
        render
    };
})();

document.querySelector("button.t_l").addEventListener("mousedown", () => {
    Tetris.init.current.left();
});
document.querySelector("button.t_r").addEventListener("mousedown", () => {
    Tetris.init.current.right();
});


document.querySelector("button.left").addEventListener("mousedown", () => {
    Tetris.cont.x -= 30;
});
document.querySelector("button.right").addEventListener("mousedown", () => {
    Tetris.cont.x += 30;
});

document.querySelector("button.up").addEventListener("mousedown", () => {
    Tetris.cont.y -= 30;
});
document.querySelector("button.down").addEventListener("mousedown", () => {
    Tetris.cont.y += 30;
});
document.querySelector("button.lessR").addEventListener("mousedown", () => {
    Tetris.cont.rows -= 1;
});
document.querySelector("button.moreR").addEventListener("mousedown", () => {
    Tetris.cont.rows += 1;
});


document.querySelector("button.lessC").addEventListener("mousedown", () => {
    Tetris.cont.columns -= 1;
});
document.querySelector("button.moreC").addEventListener("mousedown", () => {
    Tetris.cont.columns += 1;
});

document.body.onload = main.render();