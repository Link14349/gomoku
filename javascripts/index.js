let chess = new Chess(document.getElementById("chess"), {
    padding: 30,
});
function UtoU() {
    chess.listenClick(function (self, e, x, y) {
        let winner = self.down({
            x: x,
            y: y,
        });
        if (winner == Chess.types.NONE) {
            return;
        }
        // alert(winner);
        let ctx = self.ctx();
        let {width, height} = self.size();
        ctx.clearRect(0, 0, width, height);
        self.draw();
        // console.log("w");
        ctx.fillStyle = "#fa0";
        ctx.font = "60px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let name = "Player-1";
        if (winner == Chess.types.WHITE) {
            name = "Player-2";
        }
        ctx.fillText(name + " won!", width / 2, height / 2);
        chess.listenClick(function () {});
        chess.listenHover(function () {});
    });
    chess.listenHover(function (self, e, x, y) {
        let ctx = self.ctx();
        let {width, height} = self.size();
        ctx.clearRect(0, 0, width, height);
        self.draw();
        self.hint({
            x: x,
            y: y,
        });
    });
}
function UtoC() {
    chess.listenClick(function (self, e, x, y) {
        let winner = self.down({
            x: x,
            y: y,
        });
        if (winner == Chess.types.NONE) {
            self.ai();
            return;
        }
        // alert(winner);
        let ctx = self.ctx();
        let {width, height} = self.size();
        ctx.clearRect(0, 0, width, height);
        self.draw();
        // console.log("w");
        ctx.fillStyle = "#fa0";
        ctx.font = "60px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let name = "You";
        if (winner == Chess.types.WHITE) {
            name = "Computer";
        }
        ctx.fillText(name + " won!", width / 2, height / 2);
        chess.listenClick(function () {});
        chess.listenHover(function () {});
    });
    chess.listenHover(function (self, e, x, y) {
        let ctx = self.ctx();
        let {width, height} = self.size();
        ctx.clearRect(0, 0, width, height);
        self.draw();
        self.hint({
            x: x,
            y: y,
        });
    });
}
function CtoC() {
    let loop = setInterval(function () {
        let ctx = chess.ctx();
        let {width, height} = chess.size();
        ctx.clearRect(0, 0, width, height);
        chess.draw();
        chess.ai();
        let winner = chess.check();
        if (winner == Chess.types.NONE) {
            return;
        }
        ctx.clearRect(0, 0, width, height);
        chess.draw();
        // console.log("w");
        ctx.fillStyle = "#fa0";
        ctx.font = "60px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let name = "Computer-1";
        if (winner == Chess.types.WHITE) {
            name = "Computer-2";
        }
        ctx.fillText(name + " won!", width / 2, height / 2);
        clearInterval(loop);
    }, 1000);
}
function start() {
    chess = new Chess(document.getElementById("chess"), document.getElementById("chess"), {
        padding: 30,
        size: document.getElementById("size").value,
        spacing: document.getElementById("spacing").value,
    });
    let model = document.getElementById("model").value;
    chess.draw();
    switch (model) {
        case "ptp":
            UtoU();
            break;
        case "ptc":
            UtoC();
            break;
        case "ctc":
            CtoC();
            break;
    }
}