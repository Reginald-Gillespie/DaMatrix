const generatingChance = 6 / 100;
const cuttingChance = 7 / 100;
const frameDelay = 40;
const chars = false;


const rows = process.stdout.rows-1 || 20;
const cols = process.stdout.columns || 100;

//Reset terminal colors
console.log("\x1b[40m")
console.clear()

const setGreen = (brightness, white=false) => {
    if (white) { 
        console.log("\x1b[37m");
        return;
    }
    let b = 22 + (brightness*6)
    let c = `\x1b[38;5;${b}m`;
    // console.log(`\x1b[38;5;${b}m`);
    return c;
}
console.log(setGreen(2));

let charOptions = [];
// for (let c = 12400; c < 12500; c++) { charOptions += String.fromCharCode(c); }
for (let c = 65; c < 122; c++) { charOptions += String.fromCharCode(c); }
function getChar() {
    if (!chars) return setGreen((Math.random()*4)>>0) + (0.5<Math.random()?"0":"1");
    let char = charOptions[(Math.random()*charOptions.length)>>0];
    return setGreen((Math.random()*4)>>0) + char;
    // let id = 32 + Math.random() * 300;
    // if (id > 126) id += 32 //The 32 chars after 127 don't show up
    // let char = String.fromCharCode(id >> 0);
    // return char;
}

//Create matrix
let matrix = new Array(rows);
for (let i = 0; i < matrix.length; i++) {
    matrix[i] = (new Array(cols)).fill(" ");
}

let display = function() {
    let matrixStr = "";
    highlight(matrix).forEach(col => {
        matrixStr += col.join("");
    });
    console.clear()
    console.log(matrixStr)
}

let print = (text, dim=0, white=false) => {
    if (!white) console.log("\x1b[32m");
    else console.log("\x1b[37m");
    for (dim; dim--;) {
        console.log("\x1b[2m")
    }
    console.log(text)
}

let extend = function() {
    let downPoints = []
    let removePoints = []
    for (let row = 0; row < rows-2; row++) {
        for (let col = 0; col < cols; col++) {
            if (matrix[row][col] !== " " && matrix[row+1][col] === " ") {
                downPoints.push({ row:row+1, col:col });
            }
            else if (matrix[row][col] === " " && matrix[row+1][col] !== " ") {
                removePoints.push({ row:row+1, col:col });
            }
        }
    }
    downPoints.forEach(p => {
        matrix[p.row][p.col] = getChar();
    })
    removePoints.forEach(p => {
        matrix[p.row][p.col] = " ";
    })
}

const highlight = () => {
    let highlightedMatrix = JSON.parse(JSON.stringify(matrix));
    let downPoints = []
    for (let row = 0; row < rows-2; row++) {
        for (let col = 0; col < cols; col++) {
            if (highlightedMatrix[row][col] !== " " && highlightedMatrix[row+1][col] === " ") {
                downPoints.push({ row:row, col:col });
            }
        }
    }
    downPoints.forEach(p => {
        let char = highlightedMatrix[p.row][p.col];
        highlightedMatrix[p.row][p.col] = "\x1b[37m" + char.slice(-1) + setGreen(2);
    })
    return highlightedMatrix;
}

let updateStart = function() {
    let row = matrix[0];
    for (let col = 0; col < cols; col++) {
        if (row[col] === " ") {
            if (generatingChance > Math.random()) row[col] = getChar();
        } 
        else if (row[col] !== " ") {
            if (cuttingChance > Math.random()) row[col] = " ";
        }
    }
}

setInterval(_=>{ extend(); updateStart(); display(); }, frameDelay)
