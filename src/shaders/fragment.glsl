varying vec3 vColor;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - smoothstep(0.3, 0.5, dist);

    vec3 centerColor = vec3(1.0, 1.0, 1.0);
    vec3 finalColor = mix(centerColor, vColor, dist);

    gl_FragColor = vec4(finalColor, strength);
}