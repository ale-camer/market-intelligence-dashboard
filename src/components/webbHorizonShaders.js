export const BG_VERTEX_SHADER = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

export const BG_FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uPair;
  uniform float uMorph;
  uniform float uShowHorizon;

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 5; i++) {
      v += a * noise2(p);
      p = rot * p * 2.03 + vec2(17.1, 31.7);
      a *= 0.5;
    }
    return v;
  }

  float smootherstep(float a, float b, float x) {
    float t = clamp((x - a) / (b - a), 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  float phaseWeight(float phase, float target) {
    float d = abs(mod(phase - target + 2.0, 4.0) - 2.0);
    return smootherstep(0.95, 0.05, d);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    float phase = mod(uPair, 4.0);
    float wVol   = phaseWeight(phase, 0.0);
    float wLens  = phaseWeight(phase, 1.0);
    float wDepth = phaseWeight(phase, 2.0);
    float wMonte = phaseWeight(phase, 3.0);
    float wSum = max(wVol + wLens + wDepth + wMonte, 0.001);
    wVol /= wSum; wLens /= wSum; wDepth /= wSum; wMonte /= wSum;

    float m = smootherstep(0.0, 1.0, clamp(uMorph, 0.0, 1.0));
    float yCenter = -0.19;
    vec2 q = vec2(p.x, p.y - yCenter);

    vec3 col = vec3(0.0);

    // 1. Subtle JWST Deep-Field Background Galaxies & Faint Stars in the lower stage
    float stageMask = smoothstep(0.22, -0.05, p.y) * smoothstep(-0.52, -0.35, p.y);
    vec2 starGrid = p * 34.0 + vec2(uTime * 0.015, 0.0);
    vec2 sgId = floor(starGrid);
    vec2 sgUv = fract(starGrid) - 0.5;
    float sSeed = hash21(sgId);
    if (sSeed > 0.90) {
      float twinkle = 0.55 + 0.45 * sin(uTime * 2.1 + sSeed * 40.0);
      float dStar = length(sgUv - (vec2(hash21(sgId + 1.3), hash21(sgId + 7.1)) - 0.5) * 0.55);
      float starSpark = smoothstep(0.10, 0.0, dStar) * twinkle;
      vec3 starHue = mix(vec3(1.0, 0.84, 0.62), vec3(0.62, 0.84, 1.0), fract(sSeed * 13.7));
      col += starHue * starSpark * stageMask * 0.55;
    }

    // 2. Domain-Warped Infrared Cosmic Dust Texture (JWST NIRCam / MIRI billow structure)
    vec2 flowUv = q * 3.8 + vec2(uTime * 0.025, -uTime * 0.018);
    vec2 warp1 = vec2(fbm(flowUv + vec2(1.7, 9.2)), fbm(flowUv + vec2(8.3, 2.8)));
    vec2 warp2 = vec2(fbm(flowUv * 1.8 + warp1 * 1.6 + vec2(4.1, 1.3)), fbm(flowUv * 1.8 + warp1 * 1.6));
    float dustBillow = fbm(flowUv * 1.4 + warp2 * 1.4);
    float dustRidge  = clamp(1.0 - abs(dustBillow * 2.0 - 1.0), 0.0, 1.0);
    dustRidge = pow(dustRidge, 1.8);

    // 3. Volumetric Backlit Dust Silhouettes for Each Pair (JWST 0% <-> QUANT 100%)
    // PAIR I: CARINA PILLARS & CLIFFS (0%) <-> 3D VOLATILITY SURFACE (100%)
    float p1x = q.x + 0.28 + q.y * 0.22;
    float p2x = q.x + 0.01 + q.y * 0.14;
    float p3x = q.x - 0.26 + q.y * 0.08;
    float pil1 = exp(-pow(p1x / (0.075 + 0.03 * dustBillow), 2.0)) * smoothstep(0.24, -0.22, q.y) * smoothstep(-0.28, -0.15, q.y);
    float pil2 = exp(-pow(p2x / (0.065 + 0.025 * dustBillow), 2.0)) * smoothstep(0.16, -0.22, q.y) * smoothstep(-0.28, -0.15, q.y);
    float pil3 = exp(-pow(p3x / (0.058 + 0.025 * dustBillow), 2.0)) * smoothstep(0.09, -0.22, q.y) * smoothstep(-0.28, -0.15, q.y);
    float carinaCliff = smoothstep(-0.10 + 0.06 * dustBillow, -0.26, q.y) * exp(-q.x * q.x * 2.4);
    float volJ0 = clamp(pil1 + pil2 * 0.9 + pil3 * 0.8 + carinaCliff * 0.85, 0.0, 1.0);

    float smileY = -0.12 + 0.62 * (q.x * q.x) - 0.06 * q.x + 0.025 * sin(q.x * 5.0 - uTime);
    float sheetThickness = 0.085 + 0.045 * abs(q.x);
    float volQ0 = exp(-pow((q.y - smileY) / sheetThickness, 2.0)) * smoothstep(0.68, 0.42, abs(q.x));

    float density0 = mix(volJ0, volQ0, m) * (0.45 + 0.75 * dustBillow);
    float rim0 = pow(clamp(density0 * (1.25 - density0) * 3.2, 0.0, 1.0), 1.4) * (0.6 + 0.7 * dustRidge);
    vec3 col0 = vec3(0.45, 0.16, 0.04) * density0
              + vec3(0.98, 0.58, 0.14) * rim0 * 1.35
              + vec3(1.0, 0.90, 0.58) * pow(rim0, 2.2) * 0.95
              + vec3(0.18, 0.55, 0.88) * (1.0 - m) * smoothstep(0.0, 0.22, q.y) * density0 * 0.55;

    // PAIR II: EINSTEIN LENS SMACS 0723 (0%) <-> MARKOWITZ FRONTIER & SHARPE (100%)
    float rLens = length(vec2(q.x * 0.82, q.y * 1.25));
    float einsteinRings = (exp(-pow((rLens - 0.11) * 28.0, 2.0)) + exp(-pow((rLens - 0.21) * 22.0, 2.0)) * 0.85)
                        * (0.55 + 0.45 * sin(atan(q.y, q.x) * 2.0 + warp1.x * 2.5));
    float clusterHalo = exp(-rLens * 6.5) * 0.75;
    float volJ1 = clamp(einsteinRings + clusterHalo, 0.0, 1.0);

    float minSigX = -0.38 + sqrt(0.012 + 3.4 * q.y * q.y);
    float frontierEdge = exp(-pow((q.x - minSigX) * 18.0, 2.0)) * smoothstep(0.22, 0.12, abs(q.y));
    float feasibleCloud = smoothstep(minSigX - 0.02, minSigX + 0.06, q.x) * exp(-max(0.0, q.x - minSigX) * 4.5) * exp(-q.y * q.y * 32.0);
    float calDist = abs(q.y - (-0.17 + (q.x + 0.44) * 0.42));
    float calBeam = exp(-calDist * 36.0) * smoothstep(0.55, 0.25, abs(q.x));
    float volQ1 = clamp(frontierEdge * 1.1 + feasibleCloud * 0.65 + calBeam * 0.9, 0.0, 1.0);

    float density1 = mix(volJ1, volQ1, m) * (0.5 + 0.65 * dustBillow);
    vec3 col1 = mix(vec3(0.10, 0.42, 0.85), vec3(0.32, 0.86, 1.0), dustRidge) * density1 * 1.25
              + vec3(1.0, 0.82, 0.36) * (mix(clusterHalo, calBeam + frontierEdge * 0.4, m)) * (0.65 + 0.5 * dustRidge);

    // PAIR III: L1527 BIPOLAR HOURGLASS (0%) <-> LIMIT ORDER BOOK DEPTH (100%)
    float coneWidth = 0.025 + abs(q.y) * 1.45;
    float hourglass = exp(-pow(q.x / coneWidth, 2.0)) * smoothstep(0.26, 0.08, abs(q.y));
    float darkEqDisk = 1.0 - 0.82 * exp(-pow(q.y * 55.0, 2.0)) * exp(-pow(q.x * 12.0, 2.0));
    float volJ2 = hourglass * darkEqDisk;

    float priceDist = abs(q.x);
    float wallTopY = -0.18 + 0.23 / (1.0 + exp(-(priceDist - 0.22) * 11.0)) + 0.03 * dustBillow;
    float insideWall = smoothstep(wallTopY + 0.04, wallTopY - 0.05, q.y) * smoothstep(-0.26, -0.16, q.y) * smoothstep(0.02, 0.06, priceDist) * smoothstep(0.62, 0.42, priceDist);
    float wallCrest = exp(-pow((q.y - wallTopY) * 26.0, 2.0)) * smoothstep(0.02, 0.06, priceDist) * smoothstep(0.60, 0.42, priceDist);

    vec3 colJ2 = (q.y >= 0.0 ? vec3(0.96, 0.46, 0.16) : vec3(0.16, 0.68, 0.92)) * volJ2 * (0.5 + 0.8 * dustBillow)
               + vec3(1.0, 0.85, 0.52) * pow(volJ2 * dustRidge, 1.5);
    vec3 sideHue = q.x < 0.0 ? vec3(0.06, 0.82, 0.52) : vec3(0.96, 0.22, 0.46);
    vec3 colQ2 = sideHue * (insideWall * (0.35 + 0.55 * dustBillow) + wallCrest * 1.15)
               + vec3(1.0, 0.90, 0.72) * wallCrest * dustRidge * 0.65;
    vec3 col2 = mix(colJ2, colQ2, m);

    // PAIR IV: SOUTHERN RING NEBULA (0%) <-> ITO DIFFUSION & FOKKER-PLANCK (100%)
    vec2 rotQ = vec2(q.x * 0.85 - q.y * 0.35, q.y * 1.35 + q.x * 0.25);
    float rRing = length(rotQ);
    float southernShells = (exp(-pow((rRing - 0.14) * 18.0, 2.0)) + exp(-pow((rRing - 0.24) * 13.0, 2.0)) * 0.7) * (0.5 + 0.6 * dustBillow);

    float tNorm = clamp((q.x + 0.46) / 0.88, 0.0, 1.0);
    float envWidth = 0.03 + 0.22 * sqrt(tNorm);
    float itoCone = exp(-pow(q.y / envWidth, 2.0)) * smoothstep(-0.48, -0.40, q.x) * smoothstep(0.46, 0.34, q.x);
    float bellRidge = exp(-pow((q.x - (0.32 + 0.18 * exp(-pow(q.y * 7.5, 2.0)))) * 24.0, 2.0)) * smoothstep(0.24, 0.08, abs(q.y));

    vec3 colJ3 = mix(vec3(0.20, 0.82, 0.96), vec3(0.86, 0.34, 0.96), smoothstep(0.10, 0.26, rRing)) * southernShells
               + vec3(0.95, 0.62, 0.22) * pow(southernShells * dustRidge, 1.6);
    vec3 colQ3 = mix(vec3(0.58, 0.28, 0.92), vec3(0.22, 0.78, 0.98), dustRidge) * itoCone * (0.35 + 0.65 * dustBillow)
               + vec3(1.0, 0.76, 0.28) * bellRidge * (0.8 + 0.5 * dustRidge);
    vec3 col3 = mix(colJ3, colQ3, m);

    col += col0 * wVol + col1 * wLens + col2 * wDepth + col3 * wMonte;

    // 4. Dynamic JWST 6-Spike Focal Singularity (Travels to the exact key point!)
    vec2 focal0 = mix(vec2(0.01, yCenter + 0.13), vec2(0.0, yCenter - 0.12), m);
    vec2 focal1 = mix(vec2(0.0, yCenter), vec2(-0.04, yCenter + 0.04), m);
    vec2 focal2 = mix(vec2(0.0, yCenter), vec2(0.0, yCenter - 0.08), m);
    vec2 focal3 = mix(vec2(0.0, yCenter), vec2(-0.44, yCenter), m);

    vec2 sunPos = focal0 * wVol + focal1 * wLens + focal2 * wDepth + focal3 * wMonte;
    vec2 dSun = p - sunPos;
    float rSun = length(dSun);
    float pulse = 1.0 + 0.05 * sin(uTime * 1.8);

    float sunCore   = exp(-rSun * 34.0 / pulse);
    float sunInner  = exp(-rSun * 10.5 / pulse);
    float sunCorona = exp(-rSun * 4.2);

    float angle = atan(dSun.y, dSun.x);
    float rays6 = pow(max(0.0, cos(angle * 3.0)), 18.0) * exp(-rSun * 7.5);
    float horizStreak = exp(-abs(dSun.y) * 48.0) * exp(-abs(dSun.x) * 4.2);

    vec3 sunCol = vec3(1.0, 0.98, 0.94) * (sunCore * 1.45)
                + vec3(1.0, 0.76, 0.46) * (sunInner * 0.75 + rays6 * 0.45 + horizStreak * 0.35)
                + vec3(0.75, 0.34, 0.14) * (sunCorona * 0.28);
    col += sunCol;

    // 5. Upper Viewport Pure #000000 Guarantee & ACES Filmic Tone Mapping
    float topBlackout = smoothstep(0.68, 0.45, uv.y);
    col *= topBlackout;

    col = (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14);
    col = pow(clamp(col, 0.0, 1.0), vec3(0.95));

    gl_FragColor = vec4(col, 1.0);
  }
`;
export const PARTICLE_VERTEX_SHADER = `
  attribute vec3 aSeed;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform float uPair;
  uniform float uMorph;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vStarType;

  float smootherstep(float a, float b, float x) {
    float t = clamp((x - a) / (b - a), 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  float phaseWeight(float phase, float target) {
    float d = abs(mod(phase - target + 2.0, 4.0) - 2.0);
    return smootherstep(0.95, 0.05, d);
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    float u = aSeed.x;
    float v = aSeed.y;
    float rnd = aSeed.z;

    float phase = mod(uPair, 4.0);
    float w0 = phaseWeight(phase, 0.0);
    float w1 = phaseWeight(phase, 1.0);
    float w2 = phaseWeight(phase, 2.0);
    float w3 = phaseWeight(phase, 3.0);
    float wSum = max(w0 + w1 + w2 + w3, 0.001);
    w0 /= wSum; w1 /= wSum; w2 /= wSum; w3 /= wSum;

    float m = smootherstep(0.0, 1.0, clamp(uMorph, 0.0, 1.0));
    float yCenter = -0.19;

    // PAIR 1: CARINA PILLARS OF CREATION (0%) <-> 3D VOLATILITY SURFACE (100%)
    float pIdx = floor(clamp((u * 0.5 + 0.5) * 3.0, 0.0, 2.0));
    float localU = fract((u * 0.5 + 0.5) * 3.0) * 2.0 - 1.0;
    float pillarBaseX = (pIdx - 1.0) * 0.34;
    float pillarHeight = pIdx == 0.0 ? 0.42 : (pIdx == 1.0 ? 0.33 : 0.25);
    float pillarWidth = (0.085 - v * 0.045) * (1.0 + 0.25 * sin(v * 12.0 + pIdx * 2.0));
    float trunkTilt = -v * 0.09 * (1.2 - pIdx * 0.3) + 0.018 * sin(v * 9.0 + uTime * 0.7);
    vec2 posJ0 = vec2(
      (pillarBaseX + trunkTilt + localU * pillarWidth) * aspect * 0.52,
      -0.42 + v * pillarHeight + 0.01 * cos(localU * 3.14)
    );
    float rimGlow0 = smoothstep(0.35, 0.95, abs(localU)) + smoothstep(0.85, 1.0, v);
    vec3 colJ0 = mix(vec3(0.78, 0.36, 0.12), vec3(1.0, 0.88, 0.52), rimGlow0);

    float ribbonT = floor(v * 18.0) / 18.0 + (fract(v * 18.0) - 0.5) * 0.018;
    float strikeK = u;
    float smileZ = (0.19 * strikeK * strikeK - 0.045 * strikeK) * (1.15 - 0.55 * ribbonT)
                 + 0.012 * sin(strikeK * 4.0 - uTime * 1.1);
    vec2 posQ0 = vec2(
      (strikeK * 0.56 + (ribbonT - 0.5) * 0.22) * aspect * 0.52,
      yCenter - 0.14 + (ribbonT - 0.5) * 0.20 + smileZ
    );
    vec3 colQ0 = mix(vec3(0.96, 0.52, 0.14), vec3(1.0, 0.92, 0.62), clamp(smileZ * 4.5 + 0.3, 0.0, 1.0));

    // PAIR 2: EINSTEIN GRAVITATIONAL LENS (0%) <-> MARKOWITZ FRONTIER & SHARPE (100%)
    float ringIdx = floor(v * 5.0);
    float theta = u * 3.14159 + ringIdx * 0.65 + uTime * 0.08 * (mod(ringIdx, 2.0) * 2.0 - 1.0);
    float rad = 0.06 + (ringIdx / 5.0) * 0.26 + (fract(v * 5.0) - 0.5) * 0.014;
    vec2 posJ1 = vec2(cos(theta) * rad * 1.25 * aspect * 0.48, yCenter + sin(theta) * rad * 0.78);
    vec3 colJ1 = ringIdx < 1.0
      ? vec3(1.0, 0.86, 0.55)
      : mix(vec3(0.24, 0.72, 1.0), vec3(1.0, 0.78, 0.38), smoothstep(0.6, 0.95, abs(sin(theta * 2.0))));

    vec2 posQ1;
    vec3 colQ1;
    if (rnd < 0.26) {
      float tCal = (u * 0.5 + 0.5);
      float calX = -0.52 + tCal * 1.04;
      float calY = -0.36 + tCal * 0.38;
      float isTangency = exp(-pow((tCal - 0.52) * 14.0, 2.0));
      posQ1 = vec2(calX * aspect * 0.52, calY + (v - 0.5) * 0.008);
      colQ1 = mix(vec3(1.0, 0.82, 0.32), vec3(1.0, 1.0, 1.0), isTangency);
    } else {
      float retMu = u * 0.19;
      float minSigma = sqrt(0.012 + 3.2 * retMu * retMu);
      float fillDepth = pow(v, 1.8) * 0.38;
      float sigX = -0.46 + minSigma + fillDepth;
      posQ1 = vec2(sigX * aspect * 0.52, yCenter + retMu);
      float isEfficientRim = smoothstep(0.18, 0.0, v) * smoothstep(-0.02, 0.05, retMu);
      colQ1 = mix(vec3(0.16, 0.48, 0.82), vec3(0.38, 0.92, 1.0), isEfficientRim);
    }

    // PAIR 3: L1527 BIPOLAR HOURGLASS (0%) <-> LIMIT ORDER BOOK DEPTH (100%)
    float lobe = u >= 0.0 ? 1.0 : -1.0;
    float coneH = v * 0.23 * lobe;
    float coneW = (0.022 + pow(v, 1.15) * 0.34) * (fract(abs(u) * 11.0) * 2.0 - 1.0);
    vec2 posJ2 = vec2(coneW * aspect * 0.52, yCenter + coneH);
    vec3 colJ2 = v < 0.08
      ? vec3(1.0, 0.92, 0.75)
      : (lobe > 0.0 ? mix(vec3(0.96, 0.48, 0.18), vec3(0.32, 0.78, 1.0), abs(coneW) * 2.5)
                    : mix(vec3(0.18, 0.72, 0.92), vec3(0.95, 0.38, 0.22), abs(coneW) * 2.5));

    float bookSide = u >= 0.0 ? 1.0 : -1.0;
    float priceDist = abs(u);
    float stepPrice = floor(priceDist * 14.0) / 14.0;
    float depthWallH = 0.24 / (1.0 + exp(-(stepPrice - 0.28) * 9.0));
    float layerZ = floor(v * 8.0) / 8.0;
    float fillWall = fract(v * 8.0);
    float yBook = -0.37 + depthWallH * (0.25 + 0.75 * smoothstep(0.0, 0.3, fillWall)) + layerZ * 0.09;
    float xBook = bookSide * (0.035 + priceDist * 0.52) + (layerZ - 0.5) * 0.08;
    vec2 posQ2 = vec2(xBook * aspect * 0.52, yBook);
    vec3 colQ2 = bookSide < 0.0
      ? mix(vec3(0.04, 0.58, 0.38), vec3(0.25, 1.0, 0.72), smoothstep(0.2, 0.9, fillWall))
      : mix(vec3(0.68, 0.12, 0.28), vec3(1.0, 0.36, 0.58), smoothstep(0.2, 0.9, fillWall));

    // PAIR 4: SOUTHERN RING NEBULA (0%) <-> ITO DIFFUSION & FOKKER-PLANCK (100%)
    float shellIdx = floor(v * 6.0) / 6.0;
    float ang4 = u * 3.14159 + shellIdx * 0.5;
    float rx4 = (0.08 + shellIdx * 0.32) * (1.0 + 0.08 * sin(ang4 * 5.0 + uTime));
    float ry4 = (0.05 + shellIdx * 0.19) * (1.0 + 0.08 * cos(ang4 * 4.0 - uTime));
    vec2 rotP = vec2(cos(ang4) * rx4 - sin(ang4) * ry4 * 0.35, sin(ang4) * ry4 + cos(ang4) * rx4 * 0.25);
    vec2 posJ3 = vec2(rotP.x * aspect * 0.52, yCenter + rotP.y);
    vec3 colJ3 = shellIdx < 0.18
      ? vec3(1.0, 0.95, 0.85)
      : mix(vec3(0.24, 0.86, 0.96), vec3(0.88, 0.38, 0.98), shellIdx);

    vec2 posQ3;
    vec3 colQ3;
    if (rnd > 0.72) {
      float xVal = u * 0.22;
      float pdfHeight = 0.22 * exp(-pow(xVal * 7.5, 2.0)) + 0.04 / (1.0 + pow(xVal * 12.0, 2.0));
      posQ3 = vec2((0.36 + pdfHeight * (0.3 + 0.7 * v)) * aspect * 0.52, yCenter + xVal);
      colQ3 = mix(vec3(0.98, 0.68, 0.22), vec3(1.0, 0.95, 0.75), exp(-pow(xVal * 6.0, 2.0)));
    } else {
      float pathId = floor((u * 0.5 + 0.5) * 32.0) / 32.0 * 2.0 - 1.0;
      float tStep = v;
      float wienerWiggle = 0.042 * sin(tStep * 18.0 + pathId * 37.0 - uTime * 1.4)
                         + 0.022 * cos(tStep * 31.0 - pathId * 19.0);
      float yPath = yCenter + (pathId * 0.21 * sqrt(tStep + 0.01) + wienerWiggle * sqrt(tStep));
      float xPath = -0.54 + tStep * 0.88;
      posQ3 = vec2(xPath * aspect * 0.52, yPath);
      float isEnvelope = smoothstep(0.75, 0.98, abs(pathId));
      colQ3 = mix(vec3(0.68, 0.36, 0.98), vec3(0.28, 0.88, 1.0), isEnvelope);
    }

    vec2 p0 = mix(posJ0, posQ0, m);
    vec2 p1 = mix(posJ1, posQ1, m);
    vec2 p2 = mix(posJ2, posQ2, m);
    vec2 p3 = mix(posJ3, posQ3, m);

    vec3 c0 = mix(colJ0, colQ0, m);
    vec3 c1 = mix(colJ1, colQ1, m);
    vec3 c2 = mix(colJ2, colQ2, m);
    vec3 c3 = mix(colJ3, colQ3, m);

    vec2 worldPos = p0 * w0 + p1 * w1 + p2 * w2 + p3 * w3;
    vColor = c0 * w0 + c1 * w1 + c2 * w2 + c3 * w3;

    vec2 ndc = vec2(worldPos.x / (aspect * 0.5), worldPos.y * 2.0);
    gl_Position = vec4(ndc, 0.0, 1.0);

    float twinkle = 0.72 + 0.28 * sin(uTime * 2.6 + rnd * 50.0);
    // 55% of particles are soft overlapping volumetric dust clouds (not sharp points!),
    // 37% are fine illuminated dust grains, and 8% are 6-spike JWST protostars
    if (rnd < 0.55) {
      vAlpha = 0.055;
      gl_PointSize = (15.0 + rnd * 16.0) * uDpr;
    } else if (rnd < 0.95) {
      vAlpha = twinkle * 0.48;
      gl_PointSize = (2.2 + fract(rnd * 17.0) * 2.0) * uDpr;
    } else {
      vAlpha = twinkle * 0.95;
      gl_PointSize = 8.5 * uDpr;
    }
    vStarType = rnd;
  }
`;

export const PARTICLE_FRAGMENT_SHADER = `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vStarType;

  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0) discard;

    if (vStarType < 0.55) {
      // Soft volumetric backlit cosmic dust puff (smooth Gaussian nebula cloud)
      float puff = smoothstep(1.0, 0.0, r);
      puff = puff * puff * (3.0 - 2.0 * puff);
      gl_FragColor = vec4(vColor * puff, puff * vAlpha);
      return;
    }

    float core = exp(-r * r * 6.0);
    float spikes = 0.0;
    if (vStarType >= 0.95) {
      float a = atan(p.y, p.x);
      spikes = pow(max(0.0, cos(a * 3.0)), 18.0) * exp(-r * 2.6) * 0.75;
    }

    float intensity = core + spikes;
    gl_FragColor = vec4(vColor * intensity, intensity * vAlpha);
  }
`;

