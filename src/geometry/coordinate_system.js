const AXIS_LIMIT = 2;

export const COORDINATE_SYSTEM_VERTICES = [
    -AXIS_LIMIT, 0, 0,
    AXIS_LIMIT, 0, 0,  // X-axis

    0, -AXIS_LIMIT, 0,
    0, AXIS_LIMIT, 0,  // Y-axis

    0, 0, -AXIS_LIMIT,
    0, 0, AXIS_LIMIT   // Z-axis
];

export const COORDINATE_SYSTEM_COLORS = [
    [1, 0, 0],  // Red for X-axis
    [0, 1, 0],  // Green for Y-axis
    [0, 0, 1]   // Blue for Z-axis
];

export const COORDINATE_SYSTEM_INDICES = new Uint16Array([
    0, 1,  // X-axis
    2, 3,  // Y-axis
    4, 5   // Z-axis
]);

export function createInterleavedCoordinateSystem(vertices, lineColors) {
    let interleavedArray = [];

    for (let i = 0; i < vertices.length; i += 6) { // Each line has 2 vertices
        const color = lineColors[i / 6]; // Get color for the line

        for (let j = 0; j < 6; j += 3) { // Each vertex has 3 components (x, y, z)
            interleavedArray.push(
                vertices[i + j], vertices[i + j + 1], vertices[i + j + 2],  // x, y, z
                color[0], color[1], color[2]  // r, g, b
            );
        }
    }

    return new Float32Array(interleavedArray);
}