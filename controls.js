// Toggle Drawing Aids
document.getElementById('toggleDrawingAids').addEventListener('click', function() {
    var drawingAids = document.getElementById('drawingAids');
    drawingAids.style.display = (drawingAids.style.display === 'none') ? 'block' : 'none';
});

// Toggle Palette
document.getElementById('togglePalette').addEventListener('click', function() {
    var palette = document.getElementById('paletteButtons');
    palette.style.display = (palette.style.display === 'none') ? 'block' : 'none';
});
