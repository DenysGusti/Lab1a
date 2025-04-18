export const vertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 vertexPosition;
in vec3 vertexColor;

out vec3 fragmentColor;

uniform mat4 viewProjectionMatrix;
uniform mat4 modelMatrix;

void main() {
  fragmentColor = vertexColor;

  gl_Position = viewProjectionMatrix * modelMatrix * vec4(vertexPosition, 1.0);
}`;