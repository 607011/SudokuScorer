(function (window) {

    const ALL_DIGITS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const EMPTY = new Set([0]);
    const UNITS = ["row", "column", "block"];

    const DEMO_GAMES = {
        VeryEasy: "",
        Easy: "",
        EasyMedium: "",
        Medium: "",
        MediumHard: "",
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
    border: 1px solid #ccc;
}
.notes-container > div {
    padding: 2px;
    color: #999;
    visibility: hidden;
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

        constructor(data) {
            if (data instanceof String) {
                this.data = data;
            }
        }

        get candidates() {
            return this._candidates;
        }

        get data() {
            return this._data;
        }

        /**
          * @param {String} data - serialized board data
          */
        set data(data) {
            let i = 0;
            for (let row = 0; row < 9; ++row) {
                for (let col = 0; col < 9; ++col) {
                    let digit = parseInt(data[i++]);
                    this._data[row][col] = digit;
                }
            }
            this._calc_all_candidates();
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

        getCandidatesColumn(idx) {
            return this._candidates.map(d => d[idx]);
        }

        getCandidatesRow(idx) {
            return this._candidates[idx];
        }

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

        _calc_all_candidates() {
            this._candidates = [...Array(9)].map(() => Array(9));
            let col_forbidden = Array(9);
            let block_forbidden = [...Array(3)].map(() => Array(3));
            for (let row = 0; row < 9; ++row) {
                let row_forbidden = new Set(this.getRow(row)).difference(EMPTY);
                for (let col = 0; col < 9; ++col) {
                    if (!col_forbidden[col]) {

                        col_forbidden[col] = new Set(this.getColumn(col)).difference(EMPTY);
                    }
                    const block_row_idx = Math.floor(row / 3);
                    const block_col_idx = Math.floor(col / 3);
                    if (!block_forbidden[block_row_idx][block_col_idx]) {
                        block_forbidden[block_row_idx][block_col_idx] = new Set(this.getBlock(block_row_idx, block_col_idx)).difference(EMPTY);
                    }
                    if (this._data[row][col] !== 0) {
                        this._candidates[row][col] = new Set();
                    }
                    else {
                        this._candidates[row][col] = ALL_DIGITS
                            .difference(block_forbidden[block_row_idx][block_col_idx])
                            .difference(row_forbidden)
                            .difference(col_forbidden[col]);
                    }
                }
            }
        }

        find_first_naked_pair_in_unit(unit_type) {
            console.debug(`find_first_naked_pair_in_unit("${unit_type}")`);
            for (let unit_index = 0; unit_index < 9; ++unit_index) {
                let unit;
                switch (unit_type) {
                    case "row":
                        unit = this.getCandidatesRow(unit_index);
                        break;
                    case "column":
                        unit = this.getCandidatesColumn(unit_index);
                        break;
                    case "block":
                        const rowIdx = Math.floor(unit_index / 3);
                        const colIdx = unit_index % 3;
                        unit = this.getCandidatesBlock(rowIdx, colIdx);
                        break;
                }
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
                            pair
                        };
                    }
                }
            }
        }

        find_first_naked_pair() {
            for (const unit_type of UNITS) {
                const result = this.find_first_naked_pair_in_unit(unit_type);
                if (result)
                    return result
            }
        }

        find_first_hidden_pair_in_unit(unit_type) {
            for (let unit_index = 0; unit_index < 9; ++unit_index) {
                let unit;
                switch (unit_type) {
                    case "row":
                        unit = this.getCandidatesRow(unit_index);
                        break;
                    case "column":
                        unit = this.getCandidatesColumn(unit_index);
                        break;
                    case "block":
                        const rowIdx = Math.floor(unit_index / 3);
                        const colIdx = unit_index % 3;
                        unit = this.getCandidatesBlock(rowIdx, colIdx);
                        break;
                }
                let candidate_counts = {};
                for (const cell_candidates of unit) {
                    if (cell_candidates.size == 0)
                        continue;
                    for (const candidate of cell_candidates) {
                        candidate_counts[candidate] = candidate_counts[candidate] ? candidate_counts[candidate] + 1 : 1;
                    }
                }
                const potential_pairs = Object.entries(candidate_counts)
                    .filter(value => {
                        const [candidate, count] = value;
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

        find_first_hidden_pair() {
            for (const unit_type of UNITS) {
                const result = this.find_first_hidden_pair_in_unit(unit_type);
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
html, body {
    background-color: #efebdd;
    color: #222;
}
.board-container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(9, calc(4px + 3 * var(--cell-size)));
    gap: 0;
}
`
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
            this._sudoku.data = data;
            for (let row = 0; row < 9; ++row) {
                for (let col = 0; col < 9; ++col) {
                    const cell = this._board[row][col];
                    cell.digit = this._sudoku.data[row][col];
                    cell.candidates = this._sudoku.candidates[row][col];
                }
            }
            let result;
            result = this._sudoku.find_first_naked_pair();
            console.debug("naked pair", result);
            result = this._sudoku.find_first_hidden_pair();
            console.debug("hidden pair", result);
        }

    }

    let el = {};

    function main() {
        customElements.define("sudoku-cell", Cell);
        customElements.define("sudoku-game", SudokuElement);
        el.game = document.querySelector("sudoku-game");
        el.game.data = DEMO_GAMES.Expert;
    }

    window.addEventListener("pageshow", main);
})(window);
