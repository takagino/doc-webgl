uniform float uFrequency;
uniform float uTime;
uniform float uMove;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * uFrequency + uTime) * 0.1;
  modelPosition.x += uMove;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
