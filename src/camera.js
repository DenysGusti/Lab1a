import * as glm from './gl-matrix/index.js';
import {GlobalTransformationObject} from "./transformation_object/global_transformation_object.js";

export class Camera extends GlobalTransformationObject {
    defaultViewMatrix = glm.mat4.create();

    constructor(z) {
        super();
        const eye = [0, 0, z];

        const target = glm.vec3.create();
        glm.vec3.add(target, eye, [0, 0, -1]);

        glm.mat4.lookAt(this.defaultViewMatrix, eye, target, [0, 1, 0]);
    }

    getViewMatrix() {
        let viewMatrix = glm.mat4.create();
        glm.mat4.multiply(viewMatrix, super.getTransformationMatrix(), this.defaultViewMatrix);
        return viewMatrix;
    }
}