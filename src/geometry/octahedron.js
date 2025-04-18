export const OCTAHEDRON_VERTICES = [
    // Top front-left
    0, 1, 0,
    1, 0, 1,
    -1, 0, 1,

    // Top front-right
    0, 1, 0,
    1, 0, -1,
    1, 0, 1,

    // Top back-right
    0, 1, 0,
    -1, 0, -1,
    1, 0, -1,

    // Top back-left
    0, 1, 0,
    -1, 0, 1,
    -1, 0, -1,

    // Bottom front-left
    0, -1, 0,
    -1, 0, 1,
    1, 0, 1,

    // Bottom front-right
    0, -1, 0,
    1, 0, 1,
    1, 0, -1,

    // Bottom back-right
    0, -1, 0,
    1, 0, -1,
    -1, 0, -1,

    // Bottom back-left
    0, -1, 0,
    -1, 0, -1,
    -1, 0, 1,
];

export const OCTAHEDRON_COLORS = [
    [1, 0, 0],  // Red - Top front-left
    [0, 1, 0],  // Green - Top front-right
    [0, 0, 1],  // Blue - Top back-right
    [1, 1, 0],  // Yellow - Top back-left
    [1, 0, 1],  // Magenta - Bottom front-left
    [0, 1, 1],  // Cyan - Bottom front-right
    [1, 0.5, 0], // Orange - Bottom back-right
    [0.5, 0, 1]  // Purple - Bottom back-left
];

// gl.CULL_FACE compliant
export const OCTAHEDRON_INDICES = new Uint16Array([
    0, 2, 1,   // Top front-left
    3, 5, 4,   // Top front-right
    6, 8, 7,   // Top back-right
    9, 11, 10,  // Top back-left
    12, 14, 13,  // Bottom front-left
    15, 17, 16,  // Bottom front-right
    18, 20, 19,  // Bottom back-right
    21, 23, 22   // Bottom back-left
]);

// interleaved format: (x, y, z, r, g, b) (all f32)
export function createInterleavedOctahedron(vertices, faceColors) {
    let interleavedArray = [];

    for (let i = 0; i < vertices.length; i += 9) { // Each face has 3 vertices
        const color = faceColors[i / 9]; // Get color for the face

        for (let j = 0; j < 9; j += 3) { // Each vertex has 3 components (x, y, z)
            interleavedArray.push(
                vertices[i + j], vertices[i + j + 1], vertices[i + j + 2],  // x, y, z
                color[0], color[1], color[2]  // r, g, b
            );
        }
    }

    return new Float32Array(interleavedArray);
}