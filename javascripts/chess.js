class Chess{
    constructor(d, {
        size = 15,
        spacing = 30,
        padding = 30,
    } = {}) {
        size--;
        let res = size * spacing + padding * 2;
        this.__dom = d;
        this.__ctx = d.getContext("2d");
        this.__size = size;// 格子数量(边长)
        this.__spacing = spacing;// 格子大小
        this.__padding = padding;// 与棋盘的间距
        this.data = [];
        for (let i = 0 ; i <= size ; i++) {
            this.data.push([]);
            for (let j = 0 ; j <= size ;  j++) {
                this.data[i].push(Chess.types.NONE);
            }
        }
        d.width = res;
        d.height = res;
        this.__black = true;
        this.chess();
        let winning = [];
        let count = 0;
        for (let i = 0 ; i <= size ; i++) {
            winning.push([]);
        }
    }
    padding() {
        return this.__padding;
    }
    spacing() {
        return this.__spacing;
    }
    blockSize() {
        return this.__size;
    }
    chess() {
        let size = this.__size;
        let padding = this.__padding;
        let spacing = this.__spacing;
        let ctx = this.__ctx;
        ctx.strokeStyle = "#bfbfbf";
        for (let i = 0 ; i <= size ; i++) {
            ctx.beginPath();
            ctx.moveTo(padding, padding + i * spacing);
            ctx.lineTo(padding + spacing * size, padding + i * spacing);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(padding + i * spacing, padding);
            ctx.lineTo(padding + i * spacing, padding + spacing * size);
            ctx.stroke();
            ctx.closePath();
        }
    }
    down({
             x = 1,
             y = 1,
             type = Chess.types.NONE,
         } = {}) {
        let size = this.__size;
        if (type == Chess.types.NONE) {
            if (this.__black) {
                type = Chess.types.BLACK;
            } else {
                type = Chess.types.WHITE;
            }
        }
        if (y > size || x > size || y < 0 || x < 0) return false;
        if (this.data[y][x] != Chess.types.NONE) return false;
        this.__black = !this.__black;
        this.data[y][x] = type;
        return this.check();
    }
    hint({
             x = 1,
             y = 1,
             type = Chess.types.NONE,
         } = {}) {
        let size = this.__size;
        if (type == Chess.types.NONE) {
            if (this.__black) {
                type = Chess.types.BLACK;
            } else {
                type = Chess.types.WHITE;
            }
        }
        if (y > size || x > size || y < 0 || x < 0) return;
        if (this.data[y][x] != Chess.types.NONE) return;
        let color = Chess.hints[type];
        let padding = this.__padding;
        let ctx = this.__ctx;
        let r = this.__spacing;
        ctx.beginPath();
        let grandient = ctx.createRadialGradient(padding + x * r + r / 6, padding + y * r - r / 6, r / 4, padding + x * r, padding + y * r, r / 2);
        grandient.addColorStop(0, color[0]);
        grandient.addColorStop(1, color[1]);
        ctx.fillStyle = grandient;
        ctx.arc(padding + x * r, padding + y * r, r / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    draw() {
        this.chess();
        for (let i in this.data) {
            for (let j in this.data[i]) {
                let type = this.data[i][j];
                if (type != Chess.types.NONE) {
                    let x = j;
                    let y = i;
                    let color = Chess.colors[type];
                    let padding = this.__padding;
                    let ctx = this.__ctx;
                    let r = this.__spacing;
                    ctx.beginPath();
                    let grandient = ctx.createRadialGradient(padding + x * r + r / 6, padding + y * r - r / 6, r / 4, padding + x * r, padding + y * r, r / 2);
                    grandient.addColorStop(0, color[0]);
                    grandient.addColorStop(1, color[1]);
                    ctx.fillStyle = grandient;
                    ctx.arc(padding + x * r, padding + y * r, r / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    check() {
        for (let i = 0 ; i < this.data.length ; i++) {
            for (let j = 0 ; j < this.data[0].length ; j++) {
                if (this.data[i][j] != Chess.types.NONE) {// 已经有子了
                    let count = 0;
                    let mit = [
                        [0, 1],
                        [0, -1],
                        [1, 0],
                        [-1, 0],
                        [1, -1],
                        [-1, -1],
                        [1, 1],
                        [-1, 1],
                    ];
                    let type = this.data[i][j];
                    for (let k = 0 ; k < 8 ; k++) {
                        count = 0;
                        let x = j;
                        let y = i;
                        for (let c = 0 ; c < 5 ; c++) {
                            x += mit[k][0];
                            y += mit[k][1];
                            if (x < 0 || y < 0 || x > this.__size || y > this.__size) break;
                            if (this.data[y][x] == type) {
                                count++;
                            } else {
                                break;
                            }
                        }
                        count++;
                        // console.log(count);
                        if (count >= 5) {
                            return type;
                        }
                    }
                }
            }
        }
        return Chess.types.NONE;
    }
    listenClick(cb) {
        let dom = this.__dom;
        let self = this;
        dom.onclick = function (e) {
            let x = e.offsetX;
            let y = e.offsetY;
            x -= self.__padding;
            y -= self.__padding;
            x /= self.__spacing;
            y /= self.__spacing;
            x = Math.round(x);
            y = Math.round(y);
            cb(self, e, x, y);
        }
    }
    listenHover(cb) {
        let dom = this.__dom;
        let self = this;
        dom.onmousemove = function (e) {
            let x = e.offsetX;
            let y = e.offsetY;
            x -= self.__padding;
            y -= self.__padding;
            x /= self.__spacing;
            y /= self.__spacing;
            x = Math.round(x);
            y = Math.round(y);
            cb(self, e, x, y);
        }
    }
    score(x, y, f) {
        let data = this.data[y][x];
        if (data != Chess.types.NONE) return 0;
        let mit = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [1, -1],
            [-1, -1],
            [1, 1],
            [-1, 1],
        ];
        let count = 0;
        for (let i = 0 ; i < 8 ; i++) {
            let tmpX = x, tmpY = y;
            for (let j = 0 ; j < 5 ; j++) {
                tmpX += mit[i][0];
                tmpY += mit[i][1];
                if (
                    tmpX < 0 || tmpY < 0
                    || tmpX >= this.data.length || tmpY >= this.data.length
                ) {
                    break;
                }
                if (this.data[tmpY][tmpX] == data) {
                    count++;
                }
            }
        }
        // console.log(x, y, s);
        return count;
    }
    have(x, y, size = 5) {
        let data = this.data[y][x];
        let mit = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [1, -1],
            [-1, -1],
            [1, 1],
            [-1, 1],
        ];
        for (let i = 0 ; i < 8 ; i++) {
            let tmpX = x, tmpY = y;
            for (let j = 0 ; j < size ; j++) {
                tmpX += mit[i][0];
                tmpY += mit[i][1];
                if (
                    tmpX < 0 || tmpY < 0
                    || tmpX >= this.data.length || tmpY >= this.data.length
                ) {
                    break;
                }
                if (this.data[tmpY][tmpX] != Chess.types.NONE) {
                    return this.data[tmpY][tmpX];
                }
            }
        }
        return Chess.types.NONE;
    }
    ai() {
        let choose = Math.floor(Math.random() * 100);
        if (choose <= 90) {
            this.__ai();
        } else {
            let tmp;
            let x, y;
            while (true) {
                x = Math.floor(Math.random() * this.__size);
                y = Math.floor(Math.random() * this.__size);
                tmp = this.down({
                    x: x,
                    y: y,
                });
                if (tmp !== false) break;
            }
        }
    }
    __ai() {
        // console.log(this.score(0, 0));
        let t = Chess.types.WHITE;
        if (this.__black) {
            t = Chess.types.BLACK;
        }
        let data = [];
        for (let i = 0 ; i < this.data.length ; i++) {
            data.push([]);
            for (let j = 0 ; j < this.data[0].length ; j++) {
                data[i].push({
                    type: this.have(j, i),
                    score: this.score(j, i)
                });
            }
        }
        // console.log(data);
        let myMaxScore = {
            x: 0,
            y: 0,
            score: 0,
        };
        let myMaxList = [];
        let emMaxScore = {
            x: 0,
            y: 0,
            score: 0,
        };
        let emMaxList = [];
        let emT = Chess.types.BLACK;
        if (this.__black) {
            emT = Chess.types.WHITE;
        }
        for (let i = 0 ; i < data.length ; i++) {
            for (let j = 0 ; j < data[0].length ; j++) {
                if (data[i][j].type == emT) {
                    if (emMaxScore.score < data[i][j].score) {
                        emMaxScore.x = j;
                        emMaxScore.y = i;
                        emMaxScore.score = data[i][j].score;
                    }
                    if (emMaxScore.score == data[i][j].score) {
                        emMaxList.push({
                            x: j,
                            y: i,
                        });
                    }
                }
                if (data[i][j].type == t) {
                    if (myMaxScore.score < data[i][j].score) {
                        myMaxScore.x = j;
                        myMaxScore.y = i;
                        myMaxScore.score = data[i][j].score;
                    }
                    if (myMaxScore.score == data[i][j].score) {
                        myMaxList.push({
                            x: j,
                            y: i,
                        });
                    }
                }
            }
        }
        // console.log(myMaxScore, emMaxScore);
        if (myMaxScore.score > emMaxScore.score) {
            let tmp = this.down({
                x: myMaxScore.x,
                y: myMaxScore.y,
            });
            if (tmp === false) {
                let x, y;
                while (true) {
                    x = Math.floor(Math.random() * this.__size);
                    y = Math.floor(Math.random() * this.__size);
                    tmp = this.down({
                        x: x,
                        y: y,
                    });
                    if (tmp !== false) return tmp;
                }
            }
            return tmp;
        } else {
            let tmp = this.down({
                x: emMaxScore.x,
                y: emMaxScore.y,
            });
            if (tmp === false) {
                let x, y;
                while (true) {
                    x = Math.floor(Math.random() * this.__size);
                    y = Math.floor(Math.random() * this.__size);
                    tmp = this.down({
                        x: x,
                        y: y,
                    });
                    if (tmp !== false) return tmp;
                }
            }
            return tmp;
        }
    }
    listen() {
        this.listenClick(function (self, e, x, y) {
            self.down({
                x: x,
                y: y
            });
        });
    }
    ctx() {
        return this.__ctx;
    }
    size() {
        return {
            width: this.__dom.width,
            height: this.__dom.height,
        };
    }
}
Chess.types = {
    WHITE: -1,
    NONE: 0,
    BLACK: 1,
};
Chess.colors = {
    "1": [
        "#636766", "#0a0a0a"
    ],
    "-1": [
        "#d1d1d1", "#636766"
    ],
};
Chess.hints = {
    "1": [
        "#636766", "#0a0a0a"
    ],
    "-1": [
        "#d1d1d1", "#636766"
    ],
};