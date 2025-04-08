/**
 * Creates and compiles a shader (vertex or fragment) from source code.
 *
 * @param {WebGL2RenderingContext} gl - The WebGL context.
 * @param {GLenum} type - The type of shader
 * @param {string} source - The GLSL source code for the shader.
 * @returns {WebGLShader} The compiled shader.
 */
const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check if the shader compiled successfully
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
}


/**
 * Links a vertex and fragment shader to create a WebGL program.
 *
 * @param {WebGL2RenderingContext} gl - The WebGL context.
 * @param {WebGLShader} vertexShader - The compiled vertex shader.
 * @param {WebGLShader} fragmentShader - The compiled fragment shader.
 * @returns {WebGLProgram} The linked program.
 */
const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Checks if the linking worked
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
}


export class Shader {
    // Fields
    name = '';
    program = -1;
    locACoord = -1; // Location of vertex coordinates attribute
    locAColor = -1; // Location of vertex color attribute
    locUTransform = -1; // Location of the model transformation matrix
    locPTransform = -1; // Location of the projection matrix
    locVTransform = -1; // Location of the view matrix

    constructor(name) {
        this.name = name;
    }

    /**
     * Loads, compiles, and links the vertex and fragment shaders from
     * external files.
     *
     * @param {WebGL2RenderingContext} gl - The WebGL context.
     */
    async loadAndCompile(gl) {
        const vertShaderSrc = await fetch(`shaders/${this.name}.vert`)
            .then(r => r.text());
        const vertShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            vertShaderSrc
        );

        const fragShaderSrc = await fetch(`shaders/${this.name}.frag`)
            .then(r => r.text());
        const fragShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragShaderSrc
        );

        this.program = createProgram(
            gl,
            vertShader,
            fragShader
        );

        // Get attribute locations from the shader program
        this.locACoord = gl.getAttribLocation(
            this.program,
            "a_coords"
        );

        this.locAColor = gl.getAttribLocation(
            this.program,
            "a_color"
        );

        // Get uniform locations from the shader program
        this.locUTransform = gl.getUniformLocation(
            this.program,
            "u_transform"
        )


        this.locPTransform = gl.getUniformLocation(
            this.program,
            "u_projection"
        );

        this.locVTransform = gl.getUniformLocation(
            this.program,
            "u_view"
        );
    }

    /**
     * Passes the projection and view matrices to the shader program.
     *
     * @param {WebGL2RenderingContext} gl - The WebGL context.
     * @param {mat4} projectionMatrix - The projection matrix.
     * @param {mat4} viewMatrix - The view matrix.
     */
    uniformMatrices(gl, projectionMatrix, viewMatrix) {
        gl.uniformMatrix4fv(
            this.locPTransform,
            false,
            projectionMatrix
        );

        gl.uniformMatrix4fv(
            this.locVTransform,
            false,
            viewMatrix
        );
    }

    /**
     * Activate the shader program
     * @param {WebGL2RenderingContext} gl
     */
    bind(gl) {
        gl.useProgram(this.program);
    }
}