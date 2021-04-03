#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float ground[30];

layout(std140) uniform MyBlock
{
  float myDataArray[900 * 550];
};

vec4 outputColor;

void main(void)
{
  float lerpValue = gl_FragCoord.y / 500.0;

  outputColor = mix(vec4(1.0, 1.0, 1.0, 1.0),
      vec4(0.2, 0.2, 0.2, 1.0), lerpValue);
      
  gl_FragColor = outputColor;
}