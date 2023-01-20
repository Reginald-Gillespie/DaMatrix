const generatingChance = 6 / 100;
const cuttingChance = 7 / 100;
const frameDelay = 30;
const chars = true;


const rows = process.stdout.rows-1 || 20;
const cols = process.stdout.columns || 100;

//Reset terminal colors
console.log("\x1b[40m")
console.clear()

var setGreen = function (brightness, white=false) {
    if (white) { 
        console.log("\x1b[37m");
        return;
    }
    var b = 22 + (brightness*6)
    var c = `\x1b[38;5;${b}m`;
    // console.log(`\x1b[38;5;${b}m`);
    return c;
}
console.log(setGreen(2));

var charOptions = [];
// for (var c = 12400; c < 12500; c++) { charOptions += String.fromCharCode(c); }
for (var c = 65; c < 122; c++) { charOptions += String.fromCharCode(c); }
function getChar() {
    if (!chars) return 0.5<Math.random()?"0":"1";
    var char = charOptions[(Math.random()*charOptions.length)>>0];
    return char;
    // var id = 32 + Math.random() * 300;
    // if (id > 126) id += 32 //The 32 chars after 127 don't show up
    // var char = String.fromCharCode(id >> 0);
    // return char;
}

//Create matrix
var matrix = new Array(rows);
for (var i = 0; i < matrix.length; i++) {
    matrix[i] = (new Array(cols)).fill(" ");
}

var display = function() {
    var matrixStr = "";
    highlight(matrix).forEach(col => {
        matrixStr += col.join("");
    });
    console.clear()
    console.log(matrixStr)
}

var print = function(text, dim=0, white=false) {
    if (!white) console.log("\x1b[32m");
    else console.log("\x1b[37m");
    for (dim; dim--;) {
        console.log("\x1b[2m")
    }
    console.log(text)
}

var extend = function() {
    var downPoints = []
    var removePoints = []
    for (var row = 0; row < rows-2; row++) {
        for (var col = 0; col < cols; col++) {
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

var highlight = function() {
    var highlightedMatrix = JSON.parse(JSON.stringify(matrix));
    var downPoints = []
    for (var row = 0; row < rows-2; row++) {
        for (var col = 0; col < cols; col++) {
            if (highlightedMatrix[row][col] !== " " && highlightedMatrix[row+1][col] === " ") {
                downPoints.push({ row:row, col:col });
            }
        }
    }
    downPoints.forEach(p => {
        var char = highlightedMatrix[p.row][p.col];
        highlightedMatrix[p.row][p.col] = "\x1b[37m" + char + setGreen(2);
    })
    return highlightedMatrix;
}

var updateStart = function() {
    var row = matrix[0];
    for (var col = 0; col < cols; col++) {
        if (row[col] === " ") {
            if (generatingChance > Math.random()) row[col] = getChar();
        } 
        else if (row[col] !== " ") {
            if (cuttingChance > Math.random()) row[col] = " ";
        }
    }
}

setInterval(_=>{ updateStart(); extend(); display(); }, frameDelay)
