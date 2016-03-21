// Render scale is the percentage of the viewport's height that will be filled by
// the coordinate range [-1, 1].
// The scaling is done in the shaders, but it has to be taking into account
// in obtaining coordinates from the mouse position.
var renderScale = 0.9;
var maxYCoord = 1/renderScale;
var maxXCoord; // needs to be determined dynamically based on the aspect ratio

// A square this big in our [-1, 1] coordinate system will be roughly
// the size of a pixel. This also needs to be determined at runtime.
var pixelSize;

// Useful default radius for small circles
var markerRadius;
// Default line width
var lineThickness;

var gridWidth = 50;