uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv; //追加

void main(){
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime*5.0) * 0.1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime*5.0) * 0.1;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vUv = uv; //追加
}
