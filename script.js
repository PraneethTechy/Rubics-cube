class RubiksCube {
  constructor() {
    this.faces = {
      U: Array(9).fill('w'),
      D: Array(9).fill('y'),
      F: Array(9).fill('g'),
      B: Array(9).fill('b'),
      L: Array(9).fill('o'),
      R: Array(9).fill('r')
    };
    this.scrambleMoves = [];
    this.updateDisplay();
  }

  getCubeString() {
    return this.faces.U.join('') +
           this.faces.R.join('') +
           this.faces.F.join('') +
           this.faces.D.join('') +
           this.faces.L.join('') +
           this.faces.B.join('');
  }

  updateDisplay() {
    const str = this.getCubeString();
    getCubeSvg(str);
  }

  rotateFaceClockwise(face) {
    const f = this.faces[face];
    this.faces[face] = [
      f[6], f[3], f[0],
      f[7], f[4], f[1],
      f[8], f[5], f[2]
    ];
  }

  getRow(face, row) {
    return this.faces[face].slice(row * 3, row * 3 + 3);
  }

  setRow(face, row, values) {
    for (let i = 0; i < 3; i++) {
      this.faces[face][row * 3 + i] = values[i];
    }
  }

  getCol(face, col) {
    return [
      this.faces[face][col],
      this.faces[face][col + 3],
      this.faces[face][col + 6]
    ];
  }

  setCol(face, col, values) {
    for (let i = 0; i < 3; i++) {
      this.faces[face][col + i * 3] = values[i];
    }
  }

  rotate(face, clockwise = true, record = true) {
    if (clockwise) this.rotateFaceClockwise(face);
    else for (let i = 0; i < 3; i++) this.rotateFaceClockwise(face);

    if (record) this.scrambleMoves.push({ face, clockwise });

    const rev = arr => arr.slice().reverse();

    if (face === 'U') {
      const [f, r, b, l] = ['F','R','B','L'].map(x => this.getRow(x, 0));
      const order = clockwise ? [l, f, r, b] : [r, b, l, f];
      ['F','R','B','L'].forEach((face, i) => this.setRow(face, 0, order[i]));
    }

    if (face === 'D') {
      const [f, r, b, l] = ['F','R','B','L'].map(x => this.getRow(x, 2));
      const order = clockwise ? [r, b, l, f] : [l, f, r, b];
      ['F','R','B','L'].forEach((face, i) => this.setRow(face, 2, order[i]));
    }

    if (face === 'F') {
      const u = this.getRow('U', 2);
      const r = this.getCol('R', 0);
      const d = rev(this.getRow('D', 0));
      const l = rev(this.getCol('L', 2));
      if (clockwise) {
        this.setRow('U', 2, l);
        this.setCol('R', 0, u);
        this.setRow('D', 0, r.slice().reverse());
        this.setCol('L', 2, d.slice().reverse());
      } else {
        this.setRow('U', 2, r);
        this.setCol('R', 0, d.slice().reverse());
        this.setRow('D', 0, l.slice().reverse());
        this.setCol('L', 2, u.slice().reverse());
      }
    }

    if (face === 'B') {
      const u = this.getRow('U', 0);
      const r = this.getCol('R', 2);
      const d = rev(this.getRow('D', 2));
      const l = rev(this.getCol('L', 0));
      if (clockwise) {
        this.setRow('U', 0, r);
        this.setCol('R', 2, d.slice().reverse());
        this.setRow('D', 2, l.slice().reverse());
        this.setCol('L', 0, u.slice().reverse());
      } else {
        this.setRow('U', 0, l.slice().reverse());
        this.setCol('R', 2, u.slice().reverse());
        this.setRow('D', 2, r.slice().reverse());
        this.setCol('L', 0, d.slice().reverse());
      }
    }

    if (face === 'L') {
      const u = this.getCol('U', 0);
      const f = this.getCol('F', 0);
      const d = this.getCol('D', 0);
      const b = rev(this.getCol('B', 2));
      if (clockwise) {
        this.setCol('U', 0, b);
        this.setCol('F', 0, u);
        this.setCol('D', 0, f);
        this.setCol('B', 2, rev(d));
      } else {
        this.setCol('U', 0, f);
        this.setCol('F', 0, d);
        this.setCol('D', 0, rev(b));
        this.setCol('B', 2, rev(u));
      }
    }

    if (face === 'R') {
      const u = this.getCol('U', 2);
      const f = this.getCol('F', 2);
      const d = this.getCol('D', 2);
      const b = rev(this.getCol('B', 0));
      if (clockwise) {
        this.setCol('U', 2, f);
        this.setCol('F', 2, d);
        this.setCol('D', 2, b);
        this.setCol('B', 0, rev(u));
      } else {
        this.setCol('U', 2, rev(b));
        this.setCol('F', 2, u);
        this.setCol('D', 2, f);
        this.setCol('B', 0, d);
      }
    }

    this.updateDisplay();
  }

  scramble(moves = 5) {
    this.scrambleMoves = [];
    const faces = ['U','D','F','B','L','R'];
    for (let i = 0; i < moves; i++) {
      const face = faces[Math.floor(Math.random() * 6)];
      const clockwise = Math.random() > 0.5;
      this.rotate(face, clockwise, true);
    }
  }

  solve() {
    const moves = [...this.scrambleMoves].reverse();
    let i = 0;
    const applyMove = () => {
      if (i >= moves.length) {
        this.scrambleMoves = [];
        return;
      }
      const { face, clockwise } = moves[i];
      this.rotate(face, !clockwise, false);
      i++;
      setTimeout(applyMove, 300);
    };
    applyMove();
  }
}

const cube = new RubiksCube();
document.getElementById("scrambleBtn").onclick = () => cube.scramble();
document.getElementById("solveBtn").onclick = () => cube.solve();
