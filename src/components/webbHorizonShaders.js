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

export const LIGHT_BG_FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uPair;
  uniform float uMorph;

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

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    float m = smootherstep(0.0, 1.0, clamp(uMorph, 0.0, 1.0));
    float yCenter = -0.19;
    vec2 q = vec2(p.x, p.y - yCenter);

    // 1. Vibrant Spring Day Landscape Gradient (Clear Celeste Sky -> Fresh Emerald/Mint Meadow)
    vec3 skyZenith   = vec3(0.66, 0.87, 0.98); // Luminous spring celeste sky (#A8DDFB)
    vec3 skyHorizon  = vec3(0.84, 0.95, 0.99); // Airy cyan-blue horizon breeze (#D6F2FC)
    vec3 meadowUpper = vec3(0.80, 0.95, 0.86); // Sunlit spring meadow mint (#CCF2DC)
    vec3 meadowDeep  = vec3(0.68, 0.91, 0.78); // Fresh chlorophyll valley green (#ADE8C7)

    vec3 skyGrad    = mix(skyHorizon, skyZenith, smoothstep(0.40, 1.0, uv.y));
    vec3 meadowGrad = mix(meadowDeep, meadowUpper, smoothstep(0.0, 0.44, uv.y));
    vec3 col = mix(meadowGrad, skyGrad, smoothstep(0.32, 0.54, uv.y));

    // Gentle rolling green hills silhouette along the horizon
    float hill1 = 0.38 + 0.035 * sin(p.x * 3.2 + 0.4) + 0.018 * cos(p.x * 7.5);
    float hill2 = 0.34 + 0.028 * cos(p.x * 4.1 - 0.8) + 0.014 * sin(p.x * 9.0);
    float hillMask1 = smoothstep(hill1 + 0.04, hill1 - 0.04, uv.y);
    float hillMask2 = smoothstep(hill2 + 0.03, hill2 - 0.03, uv.y);
    col = mix(col, vec3(0.62, 0.88, 0.74), hillMask1 * 0.38);
    col = mix(col, vec3(0.54, 0.84, 0.68), hillMask2 * 0.35);

    // 2. Diagonal Morning Sunbeams (Serene, slow crepuscular rays across the celeste sky)
    float rayCoord = (uv.x - 0.35) * 3.6 + (1.0 - uv.y) * 1.55;
    float rayWave = 0.5 + 0.5 * sin(rayCoord * 4.0 - uTime * 0.08)
                  + 0.35 * sin(rayCoord * 7.2 + uTime * 0.05);
    float sunShafts = pow(clamp(rayWave * 0.55, 0.0, 1.0), 2.4) * smoothstep(0.08, 0.95, uv.y);
    col = mix(col, vec3(0.96, 0.99, 0.95), sunShafts * 0.30);

    // 3. Domain-Warped Volumetric Botanical Watercolor & Pollen Clouds
    vec2 flowUv = q * 3.5 + vec2(uTime * 0.012, -uTime * 0.007);
    vec2 warp1 = vec2(fbm(flowUv + vec2(1.7, 9.2)), fbm(flowUv + vec2(8.3, 2.8)));
    vec2 warp2 = vec2(fbm(flowUv * 1.8 + warp1 * 1.6 + vec2(4.1, 1.3)), fbm(flowUv * 1.8 + warp1 * 1.6));
    float dustBillow = fbm(flowUv * 1.4 + warp2 * 1.4);
    float dustRidge  = clamp(1.0 - abs(dustBillow * 2.0 - 1.0), 0.0, 1.0);
    dustRidge = pow(dustRidge, 1.75);

    float r = length(vec2(q.x * 0.82, q.y * 1.08));
    float shapeCloud = exp(-r * 3.8) * (0.48 + 0.72 * dustBillow);
    vec3 cloudPigment = mix(vec3(0.06, 0.62, 0.42), vec3(0.08, 0.56, 0.82), dustRidge) * shapeCloud
                      + vec3(0.88, 0.58, 0.06) * pow(shapeCloud * dustRidge, 1.4) * 0.55;
    col = mix(col, clamp(cloudPigment, 0.0, 1.0), clamp(shapeCloud * 0.34, 0.0, 1.0));

    // 4. Multi-Layer Drifting & Twinkling Spring Pollen, Dew & Leaf Spores
    float stageMask = smoothstep(0.38, -0.05, p.y) * smoothstep(-0.54, -0.34, p.y);
    for (int layer = 0; layer < 2; layer++) {
      float fl = float(layer);
      float scale = layer == 0 ? 26.0 : 40.0;
      vec2 windVel = layer == 0 ? vec2(-0.016, 0.006) : vec2(-0.010, -0.005);
      vec2 grid = p * scale + uTime * windVel * scale * 0.12 + vec2(fl * 19.3, fl * 7.7);
      vec2 gId = floor(grid);
      vec2 gUv = fract(grid) - 0.5;
      float seed = hash21(gId);

      if (seed > 0.74) {
        float twinkle = pow(0.5 + 0.5 * sin(uTime * (0.75 + fract(seed * 11.0) * 0.95) + seed * 62.8), 1.7);
        vec2 offset = vec2(
          sin(uTime * 0.38 + seed * 29.0) * 0.26,
          cos(uTime * 0.45 + seed * 43.0) * 0.26
        );
        float dist = length(gUv - offset);
        float spark = smoothstep(0.22, 0.0, dist) * twinkle * stageMask;
        float glint = smoothstep(0.075, 0.0, dist) * twinkle * stageMask;

        vec3 moteCol = fract(seed * 7.3) > 0.62
          ? vec3(0.06, 0.62, 0.38)
          : (fract(seed * 13.1) > 0.30
            ? vec3(0.08, 0.56, 0.84)
            : vec3(0.88, 0.30, 0.52));

        col = mix(col, moteCol, spark * 0.55);
        col += vec3(0.16, 0.24, 0.18) * glint;
      }
    }

    // 5. Travelling Spring Sun Singularity
    vec2 sunPos = vec2(0.04 * sin(uTime * 0.25), yCenter + 0.02 * cos(uTime * 0.2));
    vec2 dSun = p - sunPos;
    float rSun = length(dSun);
    float pulse = 1.0 + 0.04 * sin(uTime * 0.85);

    float sunCore  = exp(-rSun * 22.0 / pulse);
    float sunBloom = exp(-rSun * 7.0 / pulse);
    float irisRing = exp(-pow((rSun - 0.075 * pulse) * 28.0, 2.0));
    float angle = atan(dSun.y, dSun.x) + uTime * 0.05;
    float sunRays = pow(max(0.0, cos(angle * 4.0)), 14.0) * exp(-rSun * 6.5);

    col = mix(col, vec3(0.12, 0.68, 0.52), sunBloom * 0.22 + irisRing * 0.28);
    col += vec3(0.24, 0.22, 0.08) * (sunCore * 0.55 + sunRays * 0.32);

    float grain = (hash21(uv * uResolution.xy) - 0.5) * 0.008;
    col = clamp(col + grain, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const LIGHT_PARTICLE_VERTEX_SHADER = `
  attribute vec3 aSeed;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform float uSceneA;
  uniform float uSceneB;
  uniform float uSceneMix;
  uniform float uMorph;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vStarType;
  varying float vAngle;

  float smootherstep(float a, float b, float x) {
    float t = clamp((x - a) / (b - a), 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  void computeProposal(
    int sc,
    float u,
    float v,
    float rnd,
    float aspect,
    float yCenter,
    out vec2 posN,
    out vec3 colN,
    out vec2 posQ,
    out vec3 colQ
  ) {
    posN = vec2(0.0);
    colN = vec3(0.1, 0.5, 0.3);
    posQ = vec2(0.0);
    colQ = vec3(0.1, 0.5, 0.7);

    // =========================================================================
    // 01. GIRASOL FIBONACCI <-> ESPIRAL ÁUREA & ARCOS DE FIBONACCI
    // =========================================================================
    if (sc == 0) {
      float idx0 = floor(((u * 0.5 + 0.5) * 0.7 + v * 0.3) * 3200.0);
      float theta0 = idx0 * 2.39996323 + uTime * 0.04;
      float rNorm0 = sqrt(idx0 / 3200.0);
      if (v < 0.74) {
        float r = rNorm0 * 0.24;
        posN = vec2(cos(theta0) * r * 1.15 * aspect * 0.52, yCenter + sin(theta0) * r * 0.92);
        colN = mix(vec3(0.06, 0.48, 0.30), vec3(0.88, 0.54, 0.04), smoothstep(0.15, 0.95, rNorm0));
      } else {
        float ang = u * 3.14159 + uTime * 0.025;
        float petalWave = abs(cos(ang * 10.5));
        float rPetal = 0.23 + (0.04 + 0.11 * petalWave) * ((v - 0.74) / 0.26);
        posN = vec2(cos(ang) * rPetal * 1.15 * aspect * 0.52, yCenter + sin(ang) * rPetal * 0.92);
        colN = mix(vec3(0.92, 0.58, 0.04), vec3(0.06, 0.60, 0.36), smoothstep(0.28, 0.36, rPetal));
      }

      if (v < 0.68) {
        float tSp = (u * 0.5 + 0.5) * 4.2 * 3.14159;
        float rSp = 0.012 * exp(0.24 * tSp);
        float spread = (fract(v * 19.0) - 0.5) * 0.018;
        float angSp = tSp - uTime * 0.08;
        posQ = vec2((cos(angSp) * (rSp + spread)) * 1.15 * aspect * 0.52, yCenter + sin(angSp) * (rSp + spread) * 0.92);
        colQ = mix(vec3(0.06, 0.58, 0.38), vec3(0.08, 0.52, 0.82), clamp(rSp / 0.32, 0.0, 1.0));
      } else {
        float ringPick = floor((v - 0.68) / 0.32 * 4.0);
        float fibRad = (ringPick == 0.0 ? 0.08 : ringPick == 1.0 ? 0.13 : ringPick == 2.0 ? 0.21 : 0.34);
        float ang = u * 3.14159;
        posQ = vec2(cos(ang) * fibRad * 1.15 * aspect * 0.52, yCenter + sin(ang) * fibRad * 0.92);
        colQ = ringPick == 2.0 ? vec3(0.86, 0.50, 0.04) : vec3(0.08, 0.56, 0.68);
      }
    }

    // =========================================================================
    // 02. FLOR SAKURA <-> ONDAS ARMÓNICAS DE FOURIER
    // =========================================================================
    else if (sc == 1) {
      float ang1 = u * 3.14159 + uTime * 0.03;
      float cos5 = cos(5.0 * ang1);
      float notch = 0.045 * pow(max(0.0, cos5), 8.0);
      float maxR1 = 0.07 + 0.24 * pow(0.5 + 0.5 * cos5, 0.65) - notch;
      if (v < 0.18) {
        float rStam = (v / 0.18) * 0.095;
        posN = vec2(cos(ang1) * rStam * 1.15 * aspect * 0.52, yCenter + sin(ang1) * rStam);
        colN = mix(vec3(0.06, 0.56, 0.36), vec3(0.88, 0.56, 0.06), smoothstep(0.05, 0.09, rStam));
      } else {
        float rFill = pow((v - 0.18) / 0.82, 0.75) * maxR1;
        posN = vec2(cos(ang1) * rFill * 1.18 * aspect * 0.52, yCenter + sin(ang1) * rFill * 0.96);
        colN = mix(vec3(0.84, 0.18, 0.44), vec3(0.12, 0.56, 0.78), smoothstep(0.12, 0.30, rFill));
      }

      float modeIdx = floor(v * 6.0);
      float freq = 1.0 + modeIdx * 1.5;
      float amp = 0.15 / (1.0 + modeIdx * 0.45);
      float xWave = u * 0.56;
      float phaseShift = uTime * (0.32 + modeIdx * 0.08) + modeIdx * 1.047;
      float yWave = yCenter + (modeIdx - 2.5) * 0.032
                  + amp * sin(xWave * freq * 5.5 - phaseShift)
                  + 0.025 * cos(xWave * 3.0 + uTime * 0.35);
      posQ = vec2(xWave * aspect * 0.52, yWave + (fract(v * 6.0) - 0.5) * 0.012);
      colQ = mix(
        vec3(0.06, 0.58, 0.40),
        mix(vec3(0.08, 0.52, 0.84), vec3(0.84, 0.20, 0.46), modeIdx / 5.0),
        0.5 + 0.5 * sin(xWave * 4.0 + modeIdx)
      );
    }

    // =========================================================================
    // 03. MARIPOSA MONARCA <-> ATRACTOR CAÓTICO DE LORENZ
    // =========================================================================
    else if (sc == 2) {
      float theta2 = u * 3.14159;
      float rButt = exp(sin(theta2)) - 2.0 * cos(4.0 * theta2) + pow(sin((2.0 * theta2 - 3.14159) / 24.0), 5.0);
      float wingFlap = 0.88 + 0.12 * sin(uTime * 1.15);
      float scaleR = 0.068 * sqrt(0.15 + 0.85 * v) * rButt;
      posN = vec2(cos(theta2) * scaleR * wingFlap * 1.25 * aspect * 0.52, (yCenter - 0.03) + sin(theta2) * scaleR * 0.92);
      colN = mix(vec3(0.08, 0.54, 0.84), vec3(0.06, 0.62, 0.38), smoothstep(0.35, 0.85, v));
      if (v < 0.38) colN = vec3(0.90, 0.42, 0.06);

      float lobe2 = u >= 0.0 ? 1.0 : -1.0;
      float tLoop = v * 6.28318 * 3.0 + uTime * 0.32;
      float rLoop = 0.04 + 0.16 * fract(abs(u) * 7.0 + v * 0.5);
      float lx = lobe2 * (0.19 + cos(tLoop) * rLoop);
      float ly = yCenter + sin(tLoop) * rLoop * 0.82 + lobe2 * cos(tLoop) * 0.04;
      posQ = vec2(lx * 1.25 * aspect * 0.52, ly);
      colQ = lobe2 > 0.0
        ? mix(vec3(0.06, 0.60, 0.38), vec3(0.08, 0.54, 0.84), rLoop / 0.20)
        : mix(vec3(0.08, 0.54, 0.84), vec3(0.86, 0.38, 0.12), rLoop / 0.20);
    }

    // =========================================================================
    // 04. HELECHO FRACTAL <-> ÁRBOL ISOLATION FOREST (P-06)
    // =========================================================================
    else if (sc == 3) {
      float frondIdx = floor((u * 0.5 + 0.5) * 7.0) - 3.0;
      float stemT = v;
      float sway = 0.016 * sin(uTime * 0.55 + frondIdx + stemT * 4.0);
      float angle = frondIdx * 0.36;
      float frondLen = 0.34 - abs(frondIdx) * 0.032;
      float spineX = sin(angle) * stemT * frondLen + sway;
      float spineY = -0.39 + cos(angle) * stemT * frondLen;
      float leafletSide = mod(floor(rnd * 20.0), 2.0) * 2.0 - 1.0;
      float leafletSpan = (1.0 - stemT * 0.72) * 0.095 * fract(u * 13.0);
      vec2 normalDir = vec2(cos(angle), -sin(angle));
      posN = vec2(
        (spineX + normalDir.x * leafletSide * leafletSpan) * aspect * 0.52,
        spineY + normalDir.y * leafletSide * leafletSpan * 0.65
      );
      colN = mix(vec3(0.04, 0.52, 0.30), vec3(0.18, 0.72, 0.36), stemT);

      float level = floor(v * 5.0);
      float nodesInLevel = exp2(level);
      float nodeIdx = floor((u * 0.5 + 0.5) * nodesInLevel);
      float xNode = ((nodeIdx + 0.5) / nodesInLevel) * 2.0 - 1.0;
      float parentIdx = floor(nodeIdx * 0.5);
      float xParent = ((parentIdx + 0.5) / max(1.0, nodesInLevel * 0.5)) * 2.0 - 1.0;
      float branchFrac = fract(v * 5.0);
      float treeX = mix(xParent, xNode, branchFrac) * 0.52;
      float treeY = 0.02 - (level + branchFrac) * 0.075;
      posQ = vec2(treeX * aspect * 0.52, treeY);
      bool isAnomalyNode = (level >= 2.0 && nodeIdx == nodesInLevel - 1.0);
      colQ = isAnomalyNode
        ? vec3(0.88, 0.28, 0.16)
        : mix(vec3(0.05, 0.56, 0.34), vec3(0.08, 0.56, 0.80), level / 4.0);
    }

    // =========================================================================
    // 05. DIENTE DE LEÓN ESFÉRICO <-> CONO DE CRECIMIENTO DE KELLY
    // =========================================================================
    else if (sc == 4) {
      if (v < 0.58) {
        float spokeIdx = floor((u * 0.5 + 0.5) * 32.0);
        float ang = spokeIdx * (6.28318 / 32.0) + uTime * 0.025;
        float rSpoke = (v / 0.58) * 0.22;
        float tipFan = smoothstep(0.75, 1.0, v / 0.58) * (fract(u * 32.0) - 0.5) * 0.045;
        posN = vec2((-0.14 + cos(ang + tipFan) * rSpoke * 1.15) * aspect * 0.52, yCenter + sin(ang + tipFan) * rSpoke * 0.92);
        colN = mix(vec3(0.05, 0.56, 0.34), vec3(0.08, 0.56, 0.82), v / 0.58);
      } else {
        float tWind = (v - 0.58) / 0.42;
        float seedId = floor((u * 0.5 + 0.5) * 18.0) / 18.0 * 2.0 - 1.0;
        float xSeed = 0.04 + tWind * 0.50;
        float ySeed = yCenter + seedId * 0.18 * sqrt(tWind + 0.06)
                    + 0.028 * sin(tWind * 8.0 - uTime * 0.45 + seedId * 9.0);
        posN = vec2(xSeed * aspect * 0.52, ySeed);
        colN = mix(vec3(0.08, 0.56, 0.82), vec3(0.88, 0.54, 0.04), tWind);
      }

      float curveIdx = floor(v * 8.0) / 8.0;
      float fLev = (u * 0.5 + 0.5);
      float fOpt = 0.46;
      float kellyG = 0.26 * (1.0 - pow((fLev - fOpt) / fOpt, 2.0)) * (0.40 + 0.60 * curveIdx);
      posQ = vec2((-0.50 + fLev * 1.0) * aspect * 0.52, -0.29 + kellyG);
      colQ = fLev <= fOpt
        ? mix(vec3(0.08, 0.54, 0.82), vec3(0.05, 0.62, 0.36), fLev / fOpt)
        : mix(vec3(0.88, 0.54, 0.04), vec3(0.84, 0.20, 0.36), (fLev - fOpt) / (1.0 - fOpt));
    }

    // =========================================================================
    // 06. BANDADA DE GOLONDRINAS <-> 3 REGÍMENES DE MARKOV
    // =========================================================================
    else if (sc == 5) {
      float s = u;
      float streamId = floor(v * 3.0) - 1.0;
      float ribbonX = s * 0.54 + 0.07 * sin(s * 4.2 - uTime * 0.45 + streamId);
      float ribbonY = yCenter + streamId * 0.065 + 0.12 * sin(s * 3.4 + uTime * 0.35) * cos(s * 2.1 - uTime * 0.2);
      float spread = (fract(v * 3.0) - 0.5) * (0.045 + 0.055 * sin(s * 5.0 + uTime * 0.4));
      posN = vec2((ribbonX + spread * 0.4) * aspect * 0.52, ribbonY + spread);
      colN = mix(vec3(0.06, 0.54, 0.82), vec3(0.06, 0.62, 0.38), 0.5 + 0.5 * sin(s * 3.0 + streamId));

      float stateId = floor((u * 0.5 + 0.5) * 3.0);
      vec2 center0 = vec2(-0.30, yCenter - 0.06);
      vec2 center1 = vec2(0.0,   yCenter + 0.11);
      vec2 center2 = vec2(0.30,  yCenter - 0.06);
      vec2 hub = stateId == 0.0 ? center0 : (stateId == 1.0 ? center1 : center2);
      vec2 nextHub = stateId == 0.0 ? center1 : (stateId == 1.0 ? center2 : center0);

      if (v < 0.62) {
        float ang = fract(u * 17.0) * 6.28318 + uTime * 0.45;
        float rOrb = sqrt(v / 0.62) * 0.105;
        posQ = vec2((hub.x + cos(ang) * rOrb * 1.15) * aspect * 0.52, hub.y + sin(ang) * rOrb);
      } else {
        float tStream = (v - 0.62) / 0.38;
        vec2 mid = (hub + nextHub) * 0.5 + vec2(0.0, stateId == 2.0 ? -0.07 : 0.05);
        vec2 arcPt = mix(mix(hub, mid, tStream), mix(mid, nextHub, tStream), tStream);
        posQ = vec2(arcPt.x * aspect * 0.52, arcPt.y);
      }
      colQ = stateId == 0.0
        ? vec3(0.06, 0.60, 0.36)
        : (stateId == 1.0 ? vec3(0.08, 0.54, 0.82) : vec3(0.86, 0.48, 0.06));
    }

    // =========================================================================
    // 07. CORDILLERA & RÍOS <-> TOPOGRAFÍA ISO-SHARPE & ALFA
    // =========================================================================
    else if (sc == 6) {
      float ridgeLayer = floor(v * 14.0) / 14.0;
      float xMtn = u * 0.58;
      float peak1 = 0.22 * exp(-pow((xMtn + 0.18) * 4.2, 2.0));
      float peak2 = 0.26 * exp(-pow((xMtn - 0.16) * 3.8, 2.0));
      float valleyRiver = -0.05 * exp(-pow(xMtn * 9.0, 2.0));
      float elev = peak1 + peak2 + valleyRiver + 0.025 * sin(xMtn * 18.0 + ridgeLayer * 9.0);
      float yMtn = -0.34 + (ridgeLayer - 0.5) * 0.16 + elev * (1.1 - ridgeLayer * 0.45);
      posN = vec2((xMtn + (ridgeLayer - 0.5) * 0.14) * aspect * 0.52, yMtn);
      if (abs(xMtn) < 0.095 && elev < 0.13) {
        colN = vec3(0.06, 0.56, 0.84);
      } else {
        colN = mix(vec3(0.05, 0.58, 0.34), vec3(0.12, 0.64, 0.68), smoothstep(0.04, 0.22, elev));
      }

      float ringIdx = floor(v * 10.0) / 10.0;
      float ang = u * 3.14159 + uTime * 0.04;
      float rx = (0.05 + ringIdx * 0.45) * (1.0 + 0.12 * cos(ang * 3.0));
      float ry = (0.035 + ringIdx * 0.20) * (1.0 + 0.12 * sin(ang * 2.0));
      float elevZ = (1.0 - ringIdx) * 0.14;
      posQ = vec2(cos(ang) * rx * aspect * 0.52, (yCenter - 0.06) + sin(ang) * ry + elevZ);
      colQ = mix(vec3(0.88, 0.54, 0.04), vec3(0.06, 0.58, 0.42), ringIdx);
    }

    // =========================================================================
    // 08. PANAL & LAVANDA <-> RED DE CORRELACIÓN (ENB)
    // =========================================================================
    else if (sc == 7) {
      float cellId = floor((u * 0.5 + 0.5) * 19.0);
      float row = floor(cellId / 5.0) - 1.5;
      float colIdx = mod(cellId, 5.0) - 2.0 + mod(abs(row), 2.0) * 0.5;
      vec2 hexCenter = vec2(colIdx * 0.19, yCenter + row * 0.11);
      float side = floor(v * 6.0);
      float edgeT = fract(v * 6.0);
      float a1 = side * 1.04719755;
      float a2 = (side + 1.0) * 1.04719755;
      vec2 hexPt = hexCenter + mix(vec2(cos(a1), sin(a1)), vec2(cos(a2), sin(a2)), edgeT) * 0.082;
      posN = vec2(hexPt.x * aspect * 0.52, hexPt.y);
      colN = mix(vec3(0.86, 0.54, 0.04), vec3(0.06, 0.58, 0.38), fract(cellId * 0.37));

      float nClusters = 7.0;
      float cIdx = floor((u * 0.5 + 0.5) * nClusters);
      float cAng = cIdx * (6.28318 / nClusters) + uTime * 0.04;
      vec2 hubPos = vec2(cos(cAng) * 0.34, yCenter + sin(cAng) * 0.18);
      if (v < 0.55) {
        float subAng = rnd * 6.28318;
        float subR = sqrt(v / 0.55) * 0.065;
        posQ = vec2((hubPos.x + cos(subAng) * subR) * aspect * 0.52, hubPos.y + sin(subAng) * subR);
        colQ = mix(vec3(0.06, 0.58, 0.38), vec3(0.08, 0.54, 0.84), cIdx / nClusters);
      } else {
        float nextAng = mod(cIdx + 2.0, nClusters) * (6.28318 / nClusters) + uTime * 0.04;
        vec2 nextHub = vec2(cos(nextAng) * 0.34, yCenter + sin(nextAng) * 0.18);
        vec2 edgePt = mix(hubPos, nextHub, (v - 0.55) / 0.45);
        posQ = vec2(edgePt.x * aspect * 0.52, edgePt.y);
        colQ = vec3(0.86, 0.52, 0.06);
      }
    }

    // =========================================================================
    // 09. FLOR DE LOTO & ESTANQUE <-> INTERFERENCIA DE ONDAS
    // =========================================================================
    else if (sc == 8) {
      float ang = u * 3.14159 + uTime * 0.03;
      if (v < 0.58) {
        float tier = floor((v / 0.58) * 3.0);
        float petals = tier == 0.0 ? 8.0 : (tier == 1.0 ? 12.0 : 16.0);
        float lotusWave = pow(abs(cos(ang * petals * 0.5 + tier * 0.4)), 0.7);
        float rBase = 0.04 + tier * 0.055;
        float rLotus = rBase + (0.045 + 0.045 * lotusWave) * fract((v / 0.58) * 3.0);
        posN = vec2(cos(ang) * rLotus * 1.15 * aspect * 0.52, yCenter + sin(ang) * rLotus * 0.90);
        colN = tier == 0.0
          ? vec3(0.88, 0.56, 0.04)
          : mix(vec3(0.86, 0.24, 0.48), vec3(0.06, 0.60, 0.40), tier / 2.0);
      } else {
        float rippleIdx = floor(((v - 0.58) / 0.42) * 5.0);
        float rRipple = 0.21 + rippleIdx * 0.045 + mod(uTime * 0.025, 0.045);
        posN = vec2(cos(ang) * rRipple * 1.35 * aspect * 0.52, yCenter + sin(ang) * rRipple * 0.72);
        colN = mix(vec3(0.06, 0.56, 0.82), vec3(0.08, 0.62, 0.44), rippleIdx / 4.0);
      }

      float gridX = u * 0.48;
      float gridY = (v - 0.5) * 0.36;
      float d1 = length(vec2(gridX + 0.16, gridY));
      float d2 = length(vec2(gridX - 0.16, gridY));
      float waveZ = 0.055 * (cos(d1 * 28.0 - uTime * 0.7) + cos(d2 * 28.0 - uTime * 0.7)) * exp(-length(vec2(gridX, gridY)) * 2.2);
      posQ = vec2((gridX + gridY * 0.25) * aspect * 0.52, yCenter + gridY * 0.75 + waveZ);
      colQ = mix(vec3(0.06, 0.54, 0.84), vec3(0.06, 0.62, 0.36), 0.5 + 0.5 * (waveZ / 0.08));
    }

    // =========================================================================
    // 10. CARACOLA NAUTILUS <-> CANAL DE REGRESIÓN OLS
    // =========================================================================
    else if (sc == 9) {
      float tShell = (u * 0.5 + 0.5) * 3.6 * 3.14159;
      float rOuter = 0.016 * exp(0.26 * tShell);
      float rInner = 0.016 * exp(0.26 * max(0.0, tShell - 6.28318));
      float angShell = tShell - uTime * 0.04;
      if (v < 0.65) {
        float rFill = mix(rInner, rOuter, v / 0.65);
        posN = vec2(cos(angShell) * rFill * 1.15 * aspect * 0.52, yCenter + sin(angShell) * rFill * 0.92);
        colN = mix(vec3(0.06, 0.54, 0.82), vec3(0.06, 0.62, 0.42), clamp(rOuter / 0.32, 0.0, 1.0));
      } else {
        float chamberIdx = floor((u * 0.5 + 0.5) * 24.0);
        float cTheta = chamberIdx * (3.6 * 3.14159 / 24.0) - uTime * 0.04;
        float rOutC = 0.016 * exp(0.26 * (chamberIdx * (3.6 * 3.14159 / 24.0)));
        float rInC  = rOutC * 0.54;
        float sFrac = (v - 0.65) / 0.35;
        float septaAng = cTheta - 0.38 * sin(sFrac * 3.14159);
        float rSepta = mix(rInC, rOutC, sFrac);
        posN = vec2(cos(septaAng) * rSepta * 1.15 * aspect * 0.52, yCenter + sin(septaAng) * rSepta * 0.92);
        colN = vec3(0.88, 0.54, 0.04);
      }

      float xCh = u * 0.54;
      float trendY = yCenter + xCh * 0.24;
      float elliottWave = 0.065 * sin(xCh * 9.0 - uTime * 0.45) + 0.032 * sin(xCh * 18.0 + uTime * 0.3);
      if (v < 0.52) {
        posQ = vec2(xCh * aspect * 0.52, trendY + elliottWave + (v - 0.26) * 0.025);
        colQ = elliottWave >= 0.0 ? vec3(0.05, 0.60, 0.36) : vec3(0.08, 0.54, 0.82);
      } else {
        float railPick = floor((v - 0.52) / 0.48 * 3.0) - 1.0;
        posQ = vec2(xCh * aspect * 0.52, trendY + railPick * 0.105);
        colQ = railPick == 0.0 ? vec3(0.88, 0.54, 0.04) : vec3(0.08, 0.56, 0.74);
      }
    }

    // =========================================================================
    // 11. ÁRBOL COPA & RAÍCES <-> GRAFO PIPELINE DAG (P-01..P-13)
    // =========================================================================
    else if (sc == 10) {
      if (v < 0.22) {
        float tTrunk = v / 0.22;
        float rootSpread = (1.0 - tTrunk) * (1.0 - tTrunk) * 0.26 * u;
        float trunkW = (0.022 + (1.0 - tTrunk) * 0.025) * u;
        posN = vec2((rootSpread + trunkW) * aspect * 0.52, -0.39 + tTrunk * 0.16);
        colN = mix(vec3(0.38, 0.26, 0.12), vec3(0.06, 0.52, 0.30), tTrunk);
      } else {
        float vCanopy = (v - 0.22) / 0.78;
        float branchId = floor((u * 0.5 + 0.5) * 15.0);
        float branchAng = -1.25 + (branchId / 14.0) * 2.50;
        float rBranch = pow(vCanopy, 0.75) * 0.27;
        float leafCluster = 0.032 * sin(vCanopy * 18.0 + branchId * 3.0);
        float xCan = sin(branchAng) * rBranch * 1.35 + cos(branchAng) * leafCluster;
        float yCan = -0.23 + cos(branchAng) * rBranch * 0.92 + sin(branchAng) * leafCluster;
        posN = vec2(xCan * aspect * 0.52, yCan);
        colN = vCanopy > 0.78
          ? mix(vec3(0.08, 0.58, 0.84), vec3(0.88, 0.30, 0.52), fract(branchId * 0.37))
          : mix(vec3(0.04, 0.52, 0.30), vec3(0.16, 0.72, 0.38), vCanopy);
      }

      float stage = floor((u * 0.5 + 0.5) * 4.0);
      float nodesInCol = stage == 0.0 ? 3.0 : (stage == 1.0 ? 4.0 : (stage == 2.0 ? 4.0 : 2.0));
      float nIdx = floor(v * nodesInCol);
      float subV = fract(v * nodesInCol);
      float xCol = -0.42 + stage * 0.28;
      float yNode = yCenter + ((nIdx + 0.5) / nodesInCol - 0.5) * 0.32;
      if (subV < 0.55) {
        float a = rnd * 6.28318;
        float rN = sqrt(subV / 0.55) * 0.036;
        posQ = vec2((xCol + cos(a) * rN) * aspect * 0.52, yNode + sin(a) * rN);
        colQ = stage < 2.0 ? vec3(0.06, 0.58, 0.38) : vec3(0.08, 0.54, 0.84);
      } else {
        float nextStage = min(3.0, stage + 1.0);
        float nextNodes = nextStage == 1.0 ? 4.0 : (nextStage == 2.0 ? 4.0 : 2.0);
        float nextIdx = mod(nIdx + floor(rnd * 2.0), nextNodes);
        float xNext = -0.42 + nextStage * 0.28;
        float yNext = yCenter + ((nextIdx + 0.5) / nextNodes - 0.5) * 0.32;
        float tE = (subV - 0.55) / 0.45;
        posQ = vec2(mix(xCol, xNext, tE) * aspect * 0.52, mix(yNode, yNext, tE));
        colQ = vec3(0.86, 0.54, 0.06);
      }
    }

    // =========================================================================
    // 12. ADN BOTÁNICO (DOBLE HÉLICE) <-> COINTEGRACIÓN (PAIRS TRADING)
    // =========================================================================
    else {
      float xHelix = u * 0.54;
      float phaseH = xHelix * 8.5 - uTime * 0.45;
      float yStrand1 = yCenter + 0.14 * sin(phaseH);
      float yStrand2 = yCenter - 0.14 * sin(phaseH);
      if (v < 0.36) {
        posN = vec2(xHelix * aspect * 0.52, yStrand1 + (v - 0.18) * 0.04);
        colN = vec3(0.05, 0.60, 0.36);
      } else if (v < 0.72) {
        posN = vec2(xHelix * aspect * 0.52, yStrand2 + (v - 0.54) * 0.04);
        colN = vec3(0.08, 0.54, 0.84);
      } else {
        float rungX = (floor((u * 0.5 + 0.5) * 18.0) / 17.0 * 2.0 - 1.0) * 0.52;
        float rPhase = rungX * 8.5 - uTime * 0.45;
        float yA = yCenter + 0.14 * sin(rPhase);
        float yB = yCenter - 0.14 * sin(rPhase);
        float tRung = (v - 0.72) / 0.28;
        posN = vec2(rungX * aspect * 0.52, mix(yA, yB, tRung));
        colN = mix(vec3(0.88, 0.54, 0.04), vec3(0.86, 0.26, 0.50), tRung);
      }

      float xTime = u * 0.54;
      float commonTrend = 0.08 * sin(xTime * 3.5 + uTime * 0.25);
      float spreadZ = 0.095 * cos(xTime * 10.0 - uTime * 0.45);
      if (v < 0.40) {
        posQ = vec2(xTime * aspect * 0.52, yCenter + commonTrend + spreadZ * 0.5);
        colQ = vec3(0.05, 0.60, 0.36);
      } else if (v < 0.80) {
        posQ = vec2(xTime * aspect * 0.52, yCenter + commonTrend - spreadZ * 0.5);
        colQ = vec3(0.08, 0.54, 0.84);
      } else {
        posQ = vec2(xTime * aspect * 0.52, yCenter + commonTrend);
        colQ = vec3(0.88, 0.54, 0.04);
      }
    }
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    float u = aSeed.x;
    float v = aSeed.y;
    float rnd = aSeed.z;

    float m = smootherstep(0.0, 1.0, clamp(uMorph, 0.0, 1.0));
    float yCenter = -0.19;

    // 14% free-floating Spring Leaves, Dew Drops & Petals
    if (rnd > 0.86) {
      float driftX = mod(u * 0.90 + uTime * (0.008 + 0.012 * fract(rnd * 19.0)) + 1.0, 2.0) - 1.0;
      float driftY = yCenter + (v - 0.45) * 0.62 + 0.025 * sin(uTime * 0.55 + u * 7.0 + rnd * 30.0);
      vec2 ambPos = vec2(driftX * aspect * 0.52, driftY);
      vec2 ndcAmb = vec2(ambPos.x / (aspect * 0.5), ambPos.y * 2.0);
      gl_Position = vec4(ndcAmb, 0.0, 1.0);

      float pulse = pow(0.5 + 0.5 * sin(uTime * (0.85 + fract(rnd * 31.0) * 1.1) + rnd * 90.0), 1.6);
      vAlpha = pulse * 0.84;
      vAngle = uTime * (0.28 + 0.25 * fract(rnd * 13.0)) + rnd * 6.283;

      float huePick = fract(rnd * 43.0);
      if (huePick < 0.36) vColor = vec3(0.05, 0.58, 0.34);
      else if (huePick < 0.68) vColor = vec3(0.06, 0.52, 0.82);
      else if (huePick < 0.86) vColor = vec3(0.86, 0.26, 0.50);
      else vColor = vec3(0.86, 0.54, 0.04);

      gl_PointSize = (4.6 + fract(rnd * 23.0) * 5.2) * uDpr;
      vStarType = 0.82 + 0.16 * fract(rnd * 17.0);
      return;
    }

    int scA = int(floor(mod(uSceneA, 12.0)));
    int scB = int(floor(mod(uSceneB, 12.0)));
    float mixAB = smootherstep(0.0, 1.0, clamp(uSceneMix, 0.0, 1.0));

    vec2 posNA; vec3 colNA; vec2 posQA; vec3 colQA;
    computeProposal(scA, u, v, rnd, aspect, yCenter, posNA, colNA, posQA, colQA);

    vec2 posNB; vec3 colNB; vec2 posQB; vec3 colQB;
    if (scA == scB || mixAB < 0.001) {
      posNB = posNA; colNB = colNA; posQB = posQA; colQB = colQA;
    } else {
      computeProposal(scB, u, v, rnd, aspect, yCenter, posNB, colNB, posQB, colQB);
    }

    vec2 pA = mix(posNA, posQA, m);
    vec2 pB = mix(posNB, posQB, m);
    vec3 cA = mix(colNA, colQA, m);
    vec3 cB = mix(colNB, colQB, m);

    vec2 worldPos = mix(pA, pB, mixAB);
    vColor = mix(cA, cB, mixAB);

    vec2 ndc = vec2(worldPos.x / (aspect * 0.5), worldPos.y * 2.0);
    gl_Position = vec4(ndc, 0.0, 1.0);

    float breeze = 0.62 + 0.38 * sin(uTime * (0.95 + fract(rnd * 19.0) * 0.75) + rnd * 50.0);
    vAngle = uTime * 0.25 + rnd * 6.28318;
    if (rnd < 0.40) {
      vAlpha = 0.095 * (0.75 + 0.25 * sin(uTime * 0.65 + rnd * 20.0));
      gl_PointSize = (14.0 + rnd * 15.0) * uDpr;
    } else if (rnd < 0.74) {
      vAlpha = breeze * 0.78;
      gl_PointSize = (3.4 + fract(rnd * 17.0) * 2.8) * uDpr;
    } else {
      vAlpha = breeze * 0.94;
      gl_PointSize = (7.2 + fract(rnd * 11.0) * 3.0) * uDpr;
    }
    vStarType = rnd;
  }
`;

export const LIGHT_PARTICLE_FRAGMENT_SHADER = `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vStarType;
  varying float vAngle;

  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float r = length(p);
    if (r > 1.0) discard;

    // 1. Volumetric watercolor & pollen dust puff
    if (vStarType < 0.40) {
      float puff = smoothstep(1.0, 0.0, r);
      puff = puff * puff * (3.0 - 2.0 * puff);
      gl_FragColor = vec4(vColor, puff * vAlpha);
      return;
    }

    // Rotate coordinates for organic botanical glyphs
    float c = cos(vAngle);
    float s = sin(vAngle);
    vec2 rp = vec2(c * p.x - s * p.y, s * p.x + c * p.y);

    // 2. Botanical Leaf / Seed Silhouette (replacing round dots!)
    if (vStarType < 0.74) {
      float leafDist = length(vec2(rp.x * 1.65, rp.y * 0.85));
      float mask = smoothstep(0.95, 0.25, leafDist);
      gl_FragColor = vec4(vColor, mask * vAlpha);
      return;
    }

    // 3. 5-Petal Sakura Blossom Glyph
    if (vStarType < 0.88) {
      float a = atan(rp.y, rp.x);
      float blossom = 0.52 + 0.44 * cos(a * 5.0);
      float mask = smoothstep(blossom, blossom * 0.18, r);
      gl_FragColor = vec4(vColor, mask * vAlpha);
      return;
    }

    // 4. 4-Point Sunlit Dew Sparkle / Diamond Pollen Glint
    float diamond = abs(rp.x) + abs(rp.y);
    float rays4 = exp(-abs(rp.x) * 6.5) * exp(-abs(rp.y) * 1.4)
                + exp(-abs(rp.y) * 6.5) * exp(-abs(rp.x) * 1.4);
    float spark = clamp(smoothstep(0.75, 0.1, diamond) * 0.7 + rays4 * 0.65, 0.0, 1.0);
    gl_FragColor = vec4(vColor, spark * vAlpha);
  }
`;


