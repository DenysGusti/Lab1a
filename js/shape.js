import * as glm from "./gl-matrix";

export class Shape {
    vertexData;
    indices;
    colors;
    boundingBoxTransform;
    scalingMatrix;
    positionTranslationMatrix;
    vaoIndex = -1; // index of Vertex Array Object

    constructor(vertexData, indices, colors, boundingBoxTransform) {
        this.vertexData = vertexData;
        this.indices = indices;
        this.colors = colors
        this.scalingMatrix = glm.mat4.create();
        this.positionTranslationMatrix = glm.mat4.create();
        this.boundingBoxTransform = boundingBoxTransform;
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    initializeBuffersAndVAO(gl, shader) {
        // Create our vertex array object
        this.createAndBindVAO(gl);

        // These steps are recorded into our VAO
        this.createAndBindVertexBuffer(gl);
        this.enableAndBindVertexAttribs(gl, shader);
        this.createAndBindColorBuffer(gl);
        this.enableAndBindColorAttribs(gl, shader);
        this.createAndBindIndexBuffer(gl);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    createAndBindVAO(gl) {
        this.vaoIndex = gl.createVertexArray();
        gl.bindVertexArray(this.vaoIndex);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    createAndBindVertexBuffer(gl) {
        const vertexBuffer = gl.createBuffer();
        // we use ARRAY_BUFFER for coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Store the data in the buffer
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.vertexData),
            gl.STATIC_DRAW
        );
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    createAndBindIndexBuffer(gl) {
        const indexBuffer = gl.createBuffer();
        // we use ELEMENT_ARRAY_BUFFER for indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // Store the data in the buffer
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices), // gl.UNSIGNED_SHORT
            gl.STATIC_DRAW
        );
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    createAndBindColorBuffer(gl) {
        const colorBuffer = gl.createBuffer();
        // We use ARRAY_BUFFER for colors
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // Store the data in the buffer
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.colors),
            gl.STATIC_DRAW
        );
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    enableAndBindVertexAttribs(gl, shader) {
        gl.enableVertexAttribArray(shader.locACoord);

        // Specify coordinate formate for vertex shader attribute
        gl.vertexAttribPointer(
            shader.locACoord,
            3, // size for one coordinate, vec3
            gl.FLOAT, // specify the data type of our coords
            false,
            0, // stride * sizeof float
            0 // offset
        );
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    enableAndBindColorAttribs(gl, shader) {
        gl.enableVertexAttribArray(shader.locAColor);

        gl.vertexAttribPointer(
            shader.locAColor,
            3, // size for one color, vec3
            gl.FLOAT, // specify the data type of our coords
            false,
            0, // stride * sizeof float
            0 // offset * sizeof float
        );
    }

    /**
     * Update the model matrix and send it to the shader program
     * @param {WebGL2RenderingContext} gl
     */
    update(gl, shader) {
        const modelMatrix = glm.mat4.create();

        glm.mat4.multiply(
            modelMatrix,
            this.boundingBoxTransform,
            modelMatrix
        ); // Bounding box centering/scaling

        glm.mat4.multiply(
            modelMatrix,
            this.scalingMatrix,
            modelMatrix
        ); // Scales the object

        glm.mat4.multiply(
            modelMatrix,
            this.positionTranslationMatrix,
            modelMatrix
        ); // Puts the object in the right position

        gl.uniformMatrix4fv(
            shader.locUTransform,
            false,
            modelMatrix
        );
    }

    translate(translationVector) {
        glm.mat4.translate(
            this.positionTranslationMatrix,
            this.positionTranslationMatrix,
            translationVector
        )
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    draw(gl, shader) {
        this.update(gl, shader);

        // Bind VAO
        gl.bindVertexArray(this.vaoIndex);

        // Draw
        gl.drawElements(
            gl.TRIANGLES, // <- indexBuffer contains triangles
            this.indices.length,
            gl.UNSIGNED_SHORT, // <- because we used Uint16Array before
            0 // Offset, 0 means we're not skipping anything
        );
    }
}