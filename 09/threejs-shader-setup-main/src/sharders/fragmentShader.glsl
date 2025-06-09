uniform sampler2D uTex;
varying vec2 vUv;

void main(){
  vec4 color = texture2D( uTex, vUv );

  gl_FragColor = color;
}
