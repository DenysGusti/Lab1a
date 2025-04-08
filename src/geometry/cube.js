// taken from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
export const CUBE_VERTICES = [
    // Front face
    -1, -1, 1,
    1, -1, 1,
    1, 1, 1,
    -1, 1, 1,

    // Back face
    -1, -1, -1,
    -1, 1, -1,
    1, 1, -1,
    1, -1, -1,

    // Top face
    -1, 1, -1,
    -1, 1, 1,
    1, 1, 1,
    1, 1, -1,

    // Bottom face
    -1, -1, -1,
    1, -1, -1,
    1, -1, 1,
    -1, -1, 1,

    // Right face
    1, -1, -1,
    1, 1, -1,
    1, 1, 1,
    1, -1, 1,

    // Left face
    -1, -1, -1,
    -1, -1, 1,
    -1, 1, 1,
    -1, 1, -1,
];

export const CUBE_COLORS = [
    [1, 1, 1], // Front face: white
    [1, 0, 0], // Back face: red
    [0, 1, 0], // Top face: green
    [0, 0, 1], // Bottom face: blue
    [1, 1, 0], // Right face: yellow
    [1, 0, 1], // Left face: purple
];

// gl.CULL_FACE compliant
export const CUBE_INDICES = new Uint16Array([
    0, 1, 2,
    0, 2, 3, // front
    4, 5, 6,
    4, 6, 7, // back
    8, 9, 10,
    8, 10, 11, // top
    12, 13, 14,
    12, 14, 15, // bottom
    16, 17, 18,
    16, 18, 19, // right
    20, 21, 22,
    20, 22, 23, // left
]);

// interleaved format: (x, y, z, r, g, b) (all f32)
export function createInterleavedCube(vertices, faceColors) {
    let interleavedArray = [];

    for (let i = 0; i < vertices.length; i += 12) { // Each face has 4 vertices
        const color = faceColors[i / 12]; // Get color for the face

        for (let j = 0; j < 12; j += 3) { // Each vertex has 3 components (x, y, z)
            interleavedArray.push(
                vertices[i + j], vertices[i + j + 1], vertices[i + j + 2],  // x, y, z
                color[0], color[1], color[2]  // r, g, b
            );
        }
    }

    return new Float32Array(interleavedArray);
}