function getCubeSvg(cubeString) {
  const faces = ['U', 'R', 'F', 'D', 'L', 'B'];
  const faceColors = {};

  for (let i = 0; i < faces.length; i++) {
    faceColors[faces[i]] = cubeString.slice(i * 9, i * 9 + 9).split('');
  }

  faces.forEach(face => {
    const faceDiv = document.getElementById(face);
    if (!faceDiv) return;
    faceDiv.innerHTML = '';
    faceColors[face].forEach(color => {
      const tile = document.createElement('div');
      tile.className = `tile ${color}`;
      faceDiv.appendChild(tile);
    });
  });
}
