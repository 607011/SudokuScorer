(function (window) {

    const ALL_DIGITS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const EMPTY = new Set([0]);
    const UNITS = ["row", "column", "block"];

    const DEMO_GAMES = {
        VeryEasy: "607500100140600903980710605503000090060050010791268530074920360059146287216807400",
        Easy: "090000004600204305000509710060308100723046080014057200030015802006402053050890400",
        EasyMedium: "000090060001007000570006000200000004095003001000050800300009040610000007080601009",
        Medium: "070500000000600158120000006000060019006900042200400000069000030080030020000040001",
        MediumHard: "000280500500000090470300010032010000910008200060000007600000000003000001000906000",
        Hard: "",
        VeryHard: "",
        Expert: "423870061160023087708060023802730604300206708576080239931642875680307102207018306",
        Master: "",
        Grandmaster: "",
        MadeInHell: "",
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

        getColumn(idx) {
            return this._data.map(d => d[idx]);
        }

        getRow(idx) {
            return this._data[idx];
        }

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
         * @returns {Set[]}
         */
        getCandidatesColumn(colIdx) {
            return this._candidates.map(d => d[colIdx]);
        }

        /**
         * Get the list of all notes in a column.
         * @param {number} rowIdx
         * @returns {Set[]}
         */
        getCandidatesRow(rowIdx) {
            return this._candidates[rowIdx];
        }

        /**
         * Get the list of all notes in a block.
         * @param {number} rowIdx - 0..2
         * @param {number} colIdx - 0..2
         * @returns {Set[]}
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
         * @returns {{cells: {row: number; col: number; }[]; pair: Set<number>}};
         }}
         */
        findFirstNakedPair() {
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
        el.game.data = DEMO_GAMES.Expert;

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

        // el.game.solve();
    }

    window.addEventListener("pageshow", main);
})(window);
