function HexagonalLife(width, height)
{
    this.width = width;
    this.height = height;

    this.grid = new Array(width);

    for (var i = 0; i < width; ++i)
        this.grid[i] = new Array(height).fill(0);

    this.colors = ['black', 'white'];

    for (var i = 0; i < this.colors.length; ++i)
    {
        var color = this.colors[i];
        if (!(color instanceof jQuery.Color))
            color = jQuery.Color(color);

        this.colors[i] = [color.red()/255, color.green()/255, color.blue()/255];
    }

    this.gridWidth = 2 * maxXCoord / width;
    this.gridSize = this.gridWidth / sqrt(3);
    this.gridHeight = 3 * this.gridSize / 2;

    // Set up vertices of a prototype hex
    var hexWidth = this.gridWidth - 2*pixelSize;
    var hexSize = hexWidth / sqrt(3);
    var hexHeight = 2 * hexSize;

    var hexagonCoords = [ 0,             hexSize,
                          hexWidth/2,    hexSize/2,
                          hexWidth/2,   -hexSize/2,
                          0,            -hexSize,
                         -hexWidth/2,   -hexSize/2,
                         -hexWidth/2,    hexSize/2 ];

    this.vertices = {};

    this.vertices.data = new Float32Array(hexagonCoords);

    this.vertices.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices.data, gl.STATIC_DRAW);
}

HexagonalLife.prototype.getState = function(x, y) {
    return this.grid[mod(x,this.width)][mod(y,this.height)];
}

HexagonalLife.prototype.getColor = function(state) {
    return this.colors[state];
}


HexagonalLife.prototype.update = function() {

}

HexagonalLife.prototype.render = function() {
    gl.useProgram(shaderProgram.program);

    gl.uniform1f(shaderProgram.uScale, 1);
    gl.uniform1f(shaderProgram.uAngle, 0);

    gl.enableVertexAttribArray(shaderProgram.aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.bufferId);
    gl.vertexAttribPointer(shaderProgram.aPos, 2, gl.FLOAT, false, 0, 0);

    for (var x = -1; x <= this.width; ++x)
        for (var y = -1; y <= this.height; ++y) {
            gl.uniform2f(shaderProgram.uCenter, 
                         -maxXCoord + this.gridWidth*(x + 0.5*(mod(y,2))), 
                         -maxYCoord + this.gridHeight*(y + 0.5));

            var state = this.getState(x, y);

            var color = this.getColor(state);

            gl.uniform4f(shaderProgram.uColor,
                         color[0],
                         color[1],
                         color[2],
                         1);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
        }


    gl.disableVertexAttribArray(shaderProgram.aPos);
};

// "Destructor" - this has to be called manually
HexagonalLife.prototype.destroy = function() {
    gl.deleteBuffer(this.vertices.bufferId);
    delete this.vertices;
};

function pixelToAxial(x, y) {
    var a = 2/3 * x;
    var b = (- sqrt(3)*y - x)/3;
    var c = - a - b;

    var ra = round(a);
    var rb = round(b);
    var rc = round(c);

    var da = abs(a - ra);
    var db = abs(b - rb);
    var dc = abs(c - rc);

    if (da > db && da > dc)
        ra = -rb-rc;
    else if (db > dc)
        rb = -ra-rc;

    return {
        q: ra,
        r: rb,
    };
}