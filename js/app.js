(function (window) {

    const ALL_DIGITS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const EMPTY = new Set([0]);
    const UNITS = ["row", "column", "block"];

    const DEMO_GAMES = {
        /* 1 */ VeryEasy: [
            "607500100140600903980710605503000090060050010791268530074920360059146287216807400",
        ],
        /* 2 */ Easy: [
            "090000004600204305000509710060308100723046080014057200030015802006402053050890400",
        ],
        /* 3 */ EasyMedium: [
            "000090060001007000570006000200000004095003001000050800300009040610000007080601009",
            "030005000020190000800000004000000600706004000080000930007300005019600000000000000",
            "490000520700010000000000080300004000000000000900700046000000307020006000006530000",
            "001000900708200400000000080006000070000094000039500000060050040000010000200000010",
            "800050000000000530060010000024700000005006087000500000100000900708000000000300400",
            "014032000000400005800000090006000037000508000000000006780000000000000260093000000",
            "008000000007095010000007600000800007000000090605000003070000000300610400200300000",
            "000090700300000906000040000006080000004001020050000000008500000100300670090000030",
            "860000500075000080000030000400016000000000095000700002050040600004000000000369000",
            "050007000400500090000000012000080003000050400061029000040003000000010608070000000",
            "000000000080000600670000390003004000000100004000203007040807002000010900060050000",
            "000004000035000000000951200070005000006000400090000060009000005600732000000006070",
            "060070000300804000000020860000500000000000095204000006000048000007000300008100200",
            "105006000000307200000000030090000020040005600000200800000000000507000046029000003",
            "035000000004007000000010009000604020000005000800090000700000100000002040269500700",
            "060070040000004900001300080400006007030000106010000005003200000000000000700109000",
            "050000040000002090003000000045001000270050080000009500360070100000040000900000200",
            "000070000070200001940000000403010090006000030500700006000005600000040000080009200",
            "000000003070000901040065000090010400000002000000700086010004000450009000600030000",
            "030000000000042900015000007000010405070000000009000000100200000000609500040003008",
            "000204000600000030000300000002170003094000070000000200000090800020007000100006450",
            "008000600700000005000620804001000008000300000200000010900004070020836000000001000",
            "000250000000003500200700004004100000708000000000000080039000001000420009006080050",
            "076000001000000070000089600590004000800050300030000040200100509000300000007000000",
            "000050008001000005200006000000070096097030100008005000000400000000000300029801000",
            "010000003000200500000469800609007000001090000000003070070000000900005200400000060",
            "000008000000000517007900000060807040500000100000003900000009005000040200403010000",
            "006500000000001302000090705710030000008000010000600003000060500002000080300700000",
            "000000003090401020000000000000800006100004000605000900700002005509000080082300000",
            "200070600806030500000009040030850000008600002000000070700000030960000000000002000",
        ],
        /* 4 */ Medium: [
            "050000000006000700000002001209001060108300000000000800000070100300900000070860030",
            "070500000000600158120000006000060019006900042200400000069000030080030020000040001",
            "000001000050000000003700410700000300200805090000000000001030060004000100800900005",
            "000300000800000601000950030006708090000000200400000000500020000073500009100090700",
            "109000000000020000000090170000000000604800001020050700500600000080507030260000080",
            "004002030800000004000030568003006090000000027006090000028000000000400000700010003",
            "070020560009070000001060008207090000000005020000000004500003001000004680300000000",
            "000010205007000000000704000003000020400000309002000008000030000601870000090501400",
            "004900007900800000063000051080000630017030000000000000000070005400000100000289000",
            "080000100910000000003002400300180000050009000000000300000804050000300000007000092",
            "050030007000000000010200069001900000000000410060708000002009800400006000300000000",
            "000004007905020000000090003070010200040009001000080050718000000000007004000006000",
            "802000500005004000000360000030006800090000000010700020000208009007000010000100004",
            "000000000005700060007090003309000708008000000020400100000100005000002900010036000",
            "000090000060000900000007004050000600000010057000008020000006300081200040407000080",
        ],
        /* 5 */ MediumHard: [
            "000280500500000090470300010032010000910008200060000007600000000003000001000906000",
            "006009103000001000000000700049200000000500067000040000000003600080000009072400000",
            "045000000000930050700001000020000006800000700000050090070308000250100040000090010",
            "020004800900000000000001006609000040001006000000200300008700000000000004005830900",
            "000000004003000080000706000050080020470000000060100070000002031020008000600000009",
            "000000058070906000000007000004720000060000010000090020000004002738000000900030000",
            "000040610000000205900700000067000000000600000008205090800070040000010800002000000",
            "000040610000000205900700000067000000000600000008205090800070040000010800002000000",
            "020100830500000002000040060000000306000200000850000940000000001304070000000060080",
            "051008000000030490002000000070020000000790000800000050000001040000040005027000060",
            "200000093090000004007060100040050010080000000500023800060010000000900000400000700",
            "000008600800001000000900100040850020500000000060020000020000005070046000003010700",
        ],
        /* 6 */ Hard: [
            "051008000000030490002000000070020000000790000800000050000001040000040005027000060",
            "000900600000002050002070001000040082014080000600009000020000090008000007103006000",
            "004000510000003009000900000832000000100060000000080470610009003000000000000500200",
            "900100006000500000007006000500000000000070020000028400036000085010600000020000009",
            "000000043005000000901060000000000090007400100080703020200050600000000308019000000",
        ],
        /* 7 */ VeryHard: [
            "005007400060000000103008700090000003000002000840050600000910507000600090000000001",
            "000804200009000030040060000800000500400000100060720000002001809030007000090000000",
            "000000470080000000602800000800600005000005000041093000097000100000010046200000000",
            "000097040000800900700002005040000060000050002060000780000000000500003008900008030",
            "200500000000031070050060000000807000500000010060000054080009000000000280043000009",
        ],
        /* 8 */ Expert: [
            "423870061160023087708060023802730604300206708576080239931642875680307102207018306",
        ],
        /* 9 */ Master: [
            "000070000005000980040300700730006000000082030100000405000100000000049000600000050",
            "070000000005000002103090700009200008008000004000610000000000039600045100000700000",
        ],
        /* 10 */ Grandmaster: [
            "090000070000940052450000000002081000000007300000030041008000090001206500000000000",
            "000523000000100040000000760000004600030907000500000000014002009000000087007001000",
        ],
        /* 11 */ MadeInHell: [
            "006500801900470000003000000001000050040000000000608070800002000090040100050000006",
            "001000900060010000000800007700080020000037004000090100050000000000003090073205600",
            "006500801900470000003000000001000050040000000000608070800002000090040100050000006",
        ]
    };

    class Cell extends HTMLElement {

        _container;
        _notesContainer;
        _number;
        _candidates = [];
        _digit;

        constructor() {
            super();
        }

        connectedCallback() {
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            let styles = document.createElement("style");
            styles.textContent = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.cell-container {
    position: relative;
}
.notes-container {
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    grid-template-columns: repeat(3, var(--cell-size));
    grid-template-rows: repeat(3, var(--cell-size));
}
.notes-container > div {
    padding: 2px;
    color: #999;
    visibility: hidden;
    text-align: center;
}
.notes-container > div.show {
    visibility: visible;
}
input[type="text"] {
    border: none;
    width: calc(3 * var(--cell-size));
    height: calc(3 * var(--cell-size));
    font-size: 2.5rem;
    text-align: center;
    background-color: transparent;
}
.hide {
    visibility: hidden;
}
`
            this._container = document.createElement("div");
            this._container.className = "cell-container";
            this._notesContainer = document.createElement("div");
            this._notesContainer.className = "notes-container";
            this._number = document.createElement("input");
            this._number.type = "text";
            this._number.min = 1;
            this._number.max = 9;
            this._number.size = 1;
            for (let k = 0; k < 9; ++k) {
                const note = document.createElement("div");
                note.textContent = k + 1;
                this._notesContainer.appendChild(note);
            }
            this._container.append(this._number, this._notesContainer);
            this._shadowRoot.append(styles, this._container);
        }

        /**
         * @returns {Number} digit
         */
        get digit() {
            return parseInt(this._number.value);
        }

        /**
         * @param {Number} digit
         */
        set digit(digit) {
            this._number.value = digit;
            if (digit == 0) {
                this._number.classList.add("hide");
            }
            else {
                this._number.classList.remove("hide");
            }
        }

        /**
         * @returns {Set} digit
         */
        get candidates() {
            return this._candidates;
        }

        /**
         * @param {Set} candidates
         */
        set candidates(candidates) {
            this._candidates = candidates;
            for (let i = 0; i < 9; ++i) {
                this._notesContainer.childNodes[i].className =
                    candidates.has(i + 1)
                        ? "show"
                        : "";
            }
        }

    }

    class Sudoku {
        /**
         * @type {Number[][]}
         */
        _data = [...Array(9)].map(() => Array(9).fill(0));

        /**
         * @type {Set<number>[][]}
         */
        _candidates;

        /**
         * History of game states
         * @type {Sudoku[]}
         */
        _history = [];

        constructor(flattenedData) {
            if (typeof flattenedData === "string" || flattenedData instanceof String) {
                this.flattenedData = flattenedData;
            }
        }

        clone() {
            return new Sudoku(this.flattenedData);
        }

        get candidates() {
            return this._candidates;
        }

        get data() {
            return this._data;
        }

        /**
         * @returns {String} flattened board data
         */
        get flattenedData() {
            return this._data.flat().join("");
        }

        /**
          * @param {String} data - flattened board data
          */
        set flattenedData(data) {
            // console.debug(`Sudoku.data = "${data}"`);
            let i = 0;
            for (let row = 0; row < 9; ++row) {
                for (let col = 0; col < 9; ++col) {
                    this._data[row][col] = parseInt(data[i++]);
                }
            }
            this._calcAllCandidates();
            this.updateHash();
        }

        /**
         * 
         * @param {Number} idx - 0..2
         * @returns {Number[]}
         */
        getColumn(idx) {
            return this._data.map(d => d[idx]);
        }

        /**
         * 
         * @param {Number} idx - 0..2
         * @returns {Number[]}
         */
        getRow(idx) {
            return this._data[idx];
        }

        /**
         * 
         * @param {Number} rowIdx - 0..2
         * @param {Number} colIdx - 0..2
         * @returns {Number[]}
         */
        getBlock(rowIdx, colIdx) {
            let block = [];
            const rowStart = rowIdx * 3;
            const colStart = colIdx * 3;
            for (let y = 0; y < 3; ++y) {
                for (let x = 0; x < 3; ++x) {
                    block.push(this._data[rowStart + y][colStart + x]);
                }
            }
            return block;
        }

        /**
         * 
         * @param {string} unit_type - "row", "column", or "block"
         * @param {number} unit_index (0..8)
         * @returns Set<number>[]
         */
        getUnit(unit_type, unit_index) {
            switch (unit_type) {
                case "row":
                    return this.getCandidatesRow(unit_index);
                case "column":
                    return this.getCandidatesColumn(unit_index);
                case "block":
                    const rowIdx = Math.floor(unit_index / 3);
                    const colIdx = unit_index % 3;
                    return this.getCandidatesBlock(rowIdx, colIdx);
                default:
                    console.error(`Invalid unit type "${unit_type}`);
                    break;
            }
        }

        /**
         * Get the list of all notes in a row.
         * @param {number} colIdx
         * @returns {Set<number>[]}
         */
        getCandidatesColumn(colIdx) {
            return this._candidates.map(d => d[colIdx]);
        }

        /**
         * Get the list of all notes in a column.
         * @param {number} rowIdx
         * @returns {Set<number>[]}
         */
        getCandidatesRow(rowIdx) {
            return this._candidates[rowIdx];
        }

        /**
         * Get the list of all notes in a block.
         * @param {number} rowIdx - 0..2
         * @param {number} colIdx - 0..2
         * @returns {Set<number>[]}
         */
        getCandidatesBlock(rowIdx, colIdx) {
            let block = [];
            const rowStart = rowIdx * 3;
            const colStart = colIdx * 3;
            for (let y = 0; y < 3; ++y) {
                const row = this._candidates[rowStart + y];
                for (let x = 0; x < 3; ++x) {
                    block.push(row[colStart + x]);
                }
            }
            return block;
        }

        _calcAllCandidates() {
            this._candidates = [...Array(9)].map(() => Array(9));
            let colForbidden = Array(9);
            let blockForbidden = [...Array(3)].map(() => Array(3));
            for (let row = 0; row < 9; ++row) {
                let rowForbidden = new Set(this.getRow(row)).difference(EMPTY);
                for (let col = 0; col < 9; ++col) {
                    if (!colForbidden[col]) {
                        colForbidden[col] = new Set(this.getColumn(col)).difference(EMPTY);
                    }
                    const blockRowIdx = Math.floor(row / 3);
                    const blockColIdx = Math.floor(col / 3);
                    if (!blockForbidden[blockRowIdx][blockColIdx]) {
                        blockForbidden[blockRowIdx][blockColIdx] = new Set(this.getBlock(blockRowIdx, blockColIdx)).difference(EMPTY);
                    }
                    if (this._data[row][col] !== 0) {
                        this._candidates[row][col] = new Set();
                    }
                    else {
                        this._candidates[row][col] = ALL_DIGITS
                            .difference(blockForbidden[blockRowIdx][blockColIdx])
                            .difference(rowForbidden)
                            .difference(colForbidden[col]);
                    }
                }
            }
        }

        resolveSingle(row, col, number) {
            this._history.push(this.clone());
            // console.debug(`resolveSingle(${row}, ${col}) -> `, this._candidates[row][col].values().next().value)
            this._data[row][col] = number;
        }

        /**
         * 
         * @param {{row: number; col: number}[]} cells 
         * @param {Set<number>} pair 
         * @param {string} unit_type 
         * @return {number} number of cells removed
         */
        resolveNakedPair(cells, pair, unit_type) {
            console.debug("resolveNakedPair()", cells, pair, unit_type);
            let removedCount = 0;
            switch (unit_type) {
                case "row":
                    const row = cells[0].row;
                    const rowCandidates = this.getCandidatesRow(row);
                    for (let col = 0; col < rowCandidates.length; ++col) {
                        if (cells[0].row === row && cells[0].col === col)
                            continue
                        if (cells[1].row === row && cells[1].col === col)
                            continue
                        removedCount += rowCandidates[col].size - rowCandidates[col].difference(pair).size;
                        rowCandidates[col] = rowCandidates[col].difference(pair);
                    }
                    break;
                case "column":
                    const col = cells[0].col;
                    const colCandidates = this.getCandidatesColumn(col);
                    for (let row = 0; row < colCandidates.length; ++row) {
                        if (cells[0].row === row && cells[0].col === col)
                            continue
                        if (cells[1].row === row && cells[1].col === col)
                            continue
                        removedCount += colCandidates[row].size - colCandidates[row].difference(pair).size;
                        colCandidates[row] = colCandidates[row].difference(pair);
                    }
                    break;
                case "block":
                    const rowStart = Math.floor(cells[0].row / 3);
                    const colStart = Math.floor(cells[0].row / 3);
                    const blockCandidates = this.getCandidatesBlock(rowStart, colStart);
                    for (let rowOffset = 0; rowOffset < 3; ++rowOffset) {
                        for (let colOffset = 0; colOffset < 3; ++colOffset) {
                            const row = rowStart + rowOffset;
                            const col = colStart + colOffset;
                            if (cells[0].row === row && cells[0].col === col)
                                continue
                            if (cells[1].row === row && cells[1].col === col)
                                continue
                            const blockIdx = rowOffset * 3 + colOffset;
                            removedCount += blockCandidates[blockIdx].size - blockCandidates[blockIdx].difference(pair).size;
                            blockCandidates[blockIdx] = blockCandidates[blockIdx].difference(pair);
                        }
                    }
                    break;
            }
            return removedCount;
        }

        isSolved() {
            return this._data.every(row => row.every(cell => cell !== 0));
        }

        nextStep() {
            if (this.isSolved())
                return false;
            let resolutions = { obviousSingle: 0, hiddenSingle: 0, nakedPair: 0, hiddenPair: 0 };
            let progressMade = false;
            const result = this.findFirstObviousSingle();
            if (result) {
                const { row, col, number } = result;
                console.info(`obvious single ${number} found at ${row},${col}`);
                const currentGame = this.clone();
                this._history.push(currentGame);
                this.resolveSingle(row, col, number);
                this.updateHash();
                this._calcAllCandidates();
                progressMade = true;
                resolutions.obviousSingle += 1;
            }
            if (!progressMade) {
                const result = this.findFirstHiddenSingle();
                if (result) {
                    const { row, col, number } = result;
                    console.info(`hidden single ${number} found at ${row},${col}`);
                    this._history.push(this.clone());
                    this.resolveSingle(row, col, number);
                    this.updateHash();
                    this._calcAllCandidates();
                    progressMade = true;
                    resolutions.hiddenSingle += 1;
                }

            }
            if (!progressMade) {
                let result;
                do {
                    result = this.findFirstNakedPair();
                    if (result) {
                        const { cells, pair, unit_type } = result;
                        this._history.push(this.clone());
                        const removedCount = this.resolveNakedPair(cells, pair, unit_type);
                        // TODO: if `removedCount` is 0, no candidates have been removed,
                        // i.e. in the next iteration the same result will be found again.
                        // Thus, you must not search for the *first* naked pair, but for
                        // the next. 
                        this.updateHash();
                        this._calcAllCandidates();
                        progressMade = removedCount > 0;
                        resolutions.nakedPair += removedCount;
                    }
                } while (result && !progressMade)
            }
            if (this.isSolved())
                return false;
        }

        prevStep() {
            const prevGame = this._history.pop();
            if (!prevGame)
                return false;
            this.flattenedData = prevGame.flattenedData;
            console.debug(`Restoring previous game to `, this.flattenedData);
            return true;
        }

        solve() {
            while (!this.isSolved()) {
                this.nextStep();
            }
        }

        updateHash() {
            document.location.hash = this.flattenedData;
        }

        /**
         * @param {string} unit_type - "row", "column", or "block"
         * @returns {{row: number; col: number; number: number}};
         */
        findFirstObviousSingle() {
            for (let row = 0; row < 9; ++row) {
                for (let col = 0; col < 9; ++col) {
                    if (this._candidates[row][col].size === 1) {
                        const number = this._candidates[row][col].values().next().value;
                        return { row, col, number };
                    }
                }
            }
        }

        _findFirstHiddenSingleInUnit(unit_type) {
            for (let unit_index = 0; unit_index < 9; ++unit_index) {
                let digitHisto = new Array(9).fill(0);
                const unit = this.getUnit(unit_type, unit_index);
                for (let i = 0; i < 9; ++i) {
                    const candidates = unit[i];
                    for (const num of candidates) {
                        digitHisto[num - 1] += 1;
                    }
                }
                console.debug(`${unit_type} ${unit_index} histo = ${digitHisto.map((count, idx) => `${idx + 1}: ${count}`).join(", ")}`)
                digitHisto = digitHisto.map((count, number) => {
                    ++number;
                    return { number, count }
                }).filter(value => value.count === 1).map(value => value.number);
                if (digitHisto.length === 0)
                    continue;
                const number = digitHisto.shift();
                for (let i = 0; i < 9; ++i) {
                    if (!unit[i].has(number))
                        continue;
                    let row, col;
                    switch (unit_type) {
                        case "row":
                            [row, col] = [unit_index, i];
                            break;
                        case "column":
                            [row, col] = [i, unit_index];
                            break;
                        case "block":
                            const rowStart = Math.floor(unit_index / 3) * 3;
                            const colStart = (unit_index % 3) * 3;
                            row = rowStart + Math.floor(i / 3);
                            col = colStart + i % 3;
                            break;
                        default:
                            console.error(`Invalid unit type "${unit_type}"`);
                            break;
                    }
                    return { number, row, col };
                }
            }
        }

        findFirstHiddenSingle() {
            for (const unit_type of UNITS) {
                const result = this._findFirstHiddenSingleInUnit(unit_type);
                if (result)
                    return result
            }
        }

        _findNakedPairInUnit(unit_type, unit_index) {
            const unit = this.getUnit(unit_type, unit_index);
            for (let i = 0; i < 9; ++i) {
                for (let j = i + 1; j < 9; ++j) {
                    const cell1_candidates = unit[i];
                    const cell2_candidates = unit[j];
                    if (cell1_candidates.size == 0 && cell2_candidates.size == 0)
                        continue
                    const pair = cell1_candidates.intersection(cell2_candidates);
                    if (pair.size !== 2 || cell1_candidates.size !== 2 || cell2_candidates.size !== 2)
                        continue;
                    let row1, col1, row2, col2;
                    switch (unit_type) {
                        case "row":
                            [row1, col1] = [unit_index, i];
                            [row2, col2] = [unit_index, j];
                            break;
                        case "column":
                            [row1, col1] = [i, unit_index];
                            [row2, col2] = [j, unit_index];
                            break;
                        case "block":
                            const rowStart = Math.floor(unit_index / 3) * 3;
                            const colStart = (unit_index % 3) * 3;
                            row1 = rowStart + Math.floor(i / 3);
                            col1 = colStart + i % 3;
                            row2 = rowStart + Math.floor(j / 3);
                            col2 = colStart + j % 3;
                            break;
                    }
                    return {
                        cells: [
                            { row: row1, col: col1 },
                            { row: row2, col: col2 }
                        ],
                        pair,
                        unit_type,
                    };
                }
            }
        }

        /**
         * 
         * @returns {{cells: {row: number; col: number; }[]; pair: Set<number>}[]};
         }}
         */
        findAllNakedPairs() {
            for (const unit_type of UNITS) {
                const result = this._findNakedPairInUnit(unit_type);
                if (result)
                    return result
            }
        }

        /**
         * @param {string} unit_type - "row", "column", or "block"
         * @returns {{cells: {row: number; col: number; }[]; pair: Set<number>}};
         */
        _findFirstHiddenPairInUnit(unit_type) {
            for (let unit_index = 0; unit_index < 9; ++unit_index) {
                const unit = this.getUnit(unit_type, unit_index);
                let candidate_counts = {};
                for (const cell_candidates of unit) {
                    if (cell_candidates.size == 0)
                        continue;
                    for (const candidate of cell_candidates) {
                        candidate_counts[candidate] = candidate_counts[candidate] ? candidate_counts[candidate] + 1 : 1;
                    }
                }
                console.debug("candidate_counts = ", candidate_counts);
                const potential_pairs = Object.entries(candidate_counts)
                    .filter(value => {
                        const [_candidate, count] = value;
                        return count === 2;
                    }).map(value => parseInt(value[0]));
                if (potential_pairs.length < 2)
                    continue;
                // the nested loop is a decent way to iterate over all combinations of digit pairs
                for (let i = 0; i < 9; ++i) {
                    for (let j = i + 1; j < 9; ++j) {
                        const pair = new Set([potential_pairs[i], potential_pairs[j]])
                        const pair_cells = [];
                        let other_candidates_present = false;
                        for (let k = 0; k < unit.length; ++k) {
                            const cell_candidates = unit[k];
                            if (cell_candidates.size === 0 || !pair.isSubsetOf(cell_candidates))
                                continue;
                            pair_cells.push(k);
                            if (cell_candidates.size > 2) {
                                other_candidates_present = true;
                            }
                        }
                        if (pair_cells.length !== 2 || !other_candidates_present)
                            continue;
                        const [cell1_index, cell2_index] = pair_cells;
                        let row1, col1, row2, col2;
                        switch (unit_type) {
                            case "row":
                                [row1, col1] = [unit_index, cell1_index];
                                [row2, col2] = [unit_index, cell2_index];
                                break;
                            case "column":
                                [row1, col1] = [cell1_index, unit_index];
                                [row2, col2] = [cell2_index, unit_index];
                                break;
                            case "block":
                                const rowStart = Math.floor(unit_index / 3) * 3;
                                const colStart = (unit_index % 3) * 3;
                                const rowOffset1 = Math.floor(cell1_index / 3);
                                const colOffset1 = cell1_index % 3;
                                row1 = rowStart + rowOffset1;
                                col1 = colStart + colOffset1
                                const rowOffset2 = Math.floor(cell2_index / 3);
                                const colOffset2 = cell2_index % 3;
                                row2 = rowStart + rowOffset2;
                                col2 = colStart + colOffset2;
                                break;
                        }
                        return {
                            cells: [
                                { row: row1, col: col1 },
                                { row: row2, col: col2 }
                            ],
                            pair
                        };
                    }
                }
            }
        }

        /**
         * @returns {{cells: {row: number; col: number; }[]; pair: Set<number>}};
         }}
         */
        findFirstHiddenPair() {
            for (const unit_type of UNITS) {
                const result = this._findFirstHiddenPairInUnit(unit_type);
                if (result)
                    return result
            }
        }
    }

    class SudokuElement extends HTMLElement {

        /**
         * @type {Cell[][]}
         */
        _board;

        /**
         * @type {Sudoku}
         */
        _sudoku = new Sudoku;

        connectedCallback() {
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            let styles = document.createElement("style");
            styles.textContent = `
:host {
    --cell-size: max(16px, min(2vw, 2vh));
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.board-container {
    width: fit-content;
    display: grid;
    grid-template-columns: repeat(9, calc(3 * var(--cell-size)));
    gap: 1px;
    background-color: #555;
    border: 2px solid #555;
}
sudoku-cell {
    background-color: var(--bg-color);
}
`;
            for (let row = 0; row < 12; row += 3) {
                for (let col = 0; col < 9; ++col) {
                    styles.textContent += `
                    .board-container > sudoku-cell:nth-child(${1 + row * 9 + col}) { border-top: 1px solid #555 }
                    .board-container > sudoku-cell:nth-child(${1 + (row - 1) * 9 + col}) { border-bottom: 1px solid #555 }
                    `;
                }
            }
            for (let col = 0; col < 12; col += 3) {
                for (let row = 0; row < 9; ++row) {
                    styles.textContent += `
                    .board-container > sudoku-cell:nth-child(${1 + row * 9 + col}) { border-left: 1px solid #555 }
                    .board-container > sudoku-cell:nth-child(${row * 9 + col}) { border-right: 1px solid #555 }
                    `;
                }
            }

            this._boardContainer = document.createElement("div");
            this._boardContainer.className = "board-container";
            this._board = [];
            for (let i = 0; i < 9; ++i) {
                let row = [];
                for (let j = 0; j < 9; ++j) {
                    const cell = document.createElement("sudoku-cell");
                    this._boardContainer.appendChild(cell);
                    row.push(cell);
                }
                this._board.push(row);
            }
            this._shadowRoot.append(styles, this._boardContainer);
        }

        /**
         * @param {String} data - serialized board data
         */
        set data(data) {
            this._sudoku.flattenedData = data;
            for (let row = 0; row < 9; ++row) {
                for (let col = 0; col < 9; ++col) {
                    const cell = this._board[row][col];
                    cell.digit = this._sudoku.data[row][col];
                    cell.candidates = this._sudoku.candidates[row][col];
                }
            }
        }

        solve() {
            this._sudoku.solve();
        }

        updateBoard() {
            for (let row = 0; row < 9; ++row) {
                for (let col = 0; col < 9; ++col) {
                    const cell = this._board[row][col];
                    cell.digit = this._sudoku.data[row][col];
                    cell.candidates = this._sudoku.candidates[row][col];
                }
            }
        }

        nextStep() {
            this._sudoku.nextStep();
            this.updateBoard();
        }

        prevStep() {
            this._sudoku.prevStep();
            this.updateBoard();
        }

    }

    let el = {};

    function main() {
        customElements.define("sudoku-cell", Cell);
        customElements.define("sudoku-game", SudokuElement);
        el.game = document.querySelector("sudoku-game");
        el.game.data = DEMO_GAMES.Medium[0];

        document.querySelector("#step-back").addEventListener("click", e => {
            el.game.prevStep();
            e.stopImmediatePropagation();
            e.preventDefault();
        });
        document.querySelector("#step-forward").addEventListener("click", e => {
            el.game.nextStep();
            e.stopImmediatePropagation();
            e.preventDefault();
        });

        window.addEventListener("hashchange", () => {
            el.game.data = document.location.hash.substring(1);
        });
    }

    window.addEventListener("pageshow", main);
})(window);
