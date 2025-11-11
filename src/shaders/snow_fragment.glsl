varying vec3 vColor;
uniform sampler2D uTexture;

void main() {
    vec4 texColor = texture2D(uTexture, gl_PointCoord);
    gl_FragColor = vec4(vColor, texColor.a);
}