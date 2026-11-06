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
    for (int i = 0; i < 4; i++) {
      v += a * noise2(p);
      p = rot * p * 2.02 + vec2(13.4, 27.1);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    // Warm spring daylight base (soft ivory / alabaster paper)
    vec3 skyTop = vec3(0.965, 0.958, 0.930);
    vec3 meadowHorizon = vec3(0.945, 0.935, 0.895);
    vec3 col = mix(meadowHorizon, skyTop, smoothstep(0.0, 1.0, uv.y));

    // Subtle organic watercolor washes shifting by scene (0..7)
    float scene = floor(mod(uPair, 8.0));
    vec2 wUv = p * 2.4 + vec2(uTime * 0.018, -uTime * 0.012);
    float wash = fbm(wUv);
    float wash2 = fbm(wUv * 1.6 + vec2(4.2, 7.1));

    vec3 tintA = vec3(0.95, 0.86, 0.62); // Golden pollen
    vec3 tintB = vec3(0.76, 0.90, 0.80); // Botanical sage
    if (scene == 1.0) {
      tintA = vec3(0.97, 0.80, 0.85); // Sakura blossom pink
      tintB = vec3(0.84, 0.92, 0.82); // Spring bud green
    } else if (scene == 2.0) {
      tintA = vec3(0.74, 0.91, 0.80); // Emerald canopy
      tintB = vec3(0.82, 0.92, 0.90); // Dew turquoise
    } else if (scene == 3.0) {
      tintA = vec3(0.84, 0.88, 0.97); // Spring breeze sky
      tintB = vec3(0.96, 0.89, 0.72); // Warm dandelion sun
    } else if (scene == 4.0) {
      tintA = vec3(0.98, 0.84, 0.70); // Monarch amber
      tintB = vec3(0.80, 0.88, 0.97); // Iridescent morpho blue
    } else if (scene == 5.0) {
      tintA = vec3(0.80, 0.90, 0.96); // Swallow sky
      tintB = vec3(0.94, 0.84, 0.76); // Terracotta wing
    } else if (scene == 6.0) {
      tintA = vec3(0.76, 0.90, 0.86); // Alpine glacier & valley
      tintB = vec3(0.93, 0.86, 0.74); // Earth ochre ridge
    } else if (scene == 7.0) {
      tintA = vec3(0.97, 0.88, 0.66); // Honeycomb gold
      tintB = vec3(0.88, 0.82, 0.95); // Lavender nectar
    }

    float stageZone = smoothstep(0.32, -0.08, p.y) * smoothstep(-0.52, -0.32, p.y);
    col = mix(col, tintA, wash * 0.24 * stageZone);
    col = mix(col, tintB, wash2 * 0.20 * stageZone);

    // Soft morning sunbeam glow near the focal center
    vec2 sunPos = vec2(0.0, -0.17);
    float dSun = length(p - sunPos);
    col += vec3(0.04, 0.03, 0.01) * exp(-dSun * 4.5);

    // Subtle fine paper grain
    float grain = (hash21(uv * uResolution.xy) - 0.5) * 0.012;
    col = clamp(col + grain, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const LIGHT_PARTICLE_VERTEX_SHADER = `
  attribute vec3 aSeed;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform float uPair;
  uniform float uMorph;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vStarType;
  varying float vAngle;

  float smootherstep(float a, float b, float x) {
    float t = clamp((x - a) / (b - a), 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    float u = aSeed.x; // [-1, 1]
    float v = aSeed.y; // [0, 1]
    float rnd = aSeed.z; // [0, 1]

    float m = smootherstep(0.0, 1.0, clamp(uMorph, 0.0, 1.0));
    float yCenter = -0.17;
    int scene = int(floor(mod(uPair, 8.0)));

    vec2 posNat = vec2(0.0);
    vec3 colNat = vec3(0.2);
    vec2 posQuant = vec2(0.0);
    vec3 colQuant = vec3(0.2);

    // =========================================================================
    // SCENE 0: FIBONACCI SUNFLOWER (PHYLLOTAXIS) <-> 3D VOLATILITY SURFACE
    // =========================================================================
    if (scene == 0) {
      float idx = floor(((u * 0.5 + 0.5) * 0.7 + v * 0.3) * 3200.0);
      float goldenAngle = 2.39996323; // 137.508 deg in radians
      float theta = idx * goldenAngle + uTime * 0.12;
      float rNorm = sqrt(idx / 3200.0);
      if (v < 0.74) {
        // Fibonacci seed spiral head
        float r = rNorm * 0.24;
        posNat = vec2(cos(theta) * r * 1.15 * aspect * 0.52, yCenter + sin(theta) * r * 0.92);
        colNat = mix(vec3(0.42, 0.18, 0.05), vec3(0.86, 0.52, 0.06), smoothstep(0.15, 0.95, rNorm));
      } else {
        // Golden sunflower petals ring
        float petalCount = 21.0;
        float ang = u * 3.14159 + uTime * 0.06;
        float petalWave = abs(cos(ang * petalCount * 0.5));
        float rPetal = 0.23 + (0.04 + 0.11 * petalWave) * ((v - 0.74) / 0.26);
        posNat = vec2(cos(ang) * rPetal * 1.15 * aspect * 0.52, yCenter + sin(ang) * rPetal * 0.92);
        colNat = mix(vec3(0.92, 0.56, 0.04), vec3(0.18, 0.58, 0.34), smoothstep(0.30, 0.36, rPetal));
      }

      float ribbonT = floor(v * 18.0) / 18.0 + (fract(v * 18.0) - 0.5) * 0.018;
      float strikeK = u;
      float smileZ = (0.19 * strikeK * strikeK - 0.045 * strikeK) * (1.15 - 0.55 * ribbonT)
                   + 0.012 * sin(strikeK * 4.0 - uTime * 1.1);
      posQuant = vec2(
        (strikeK * 0.56 + (ribbonT - 0.5) * 0.22) * aspect * 0.52,
        yCenter - 0.11 + (ribbonT - 0.5) * 0.20 + smileZ
      );
      colQuant = mix(vec3(0.82, 0.42, 0.04), vec3(0.12, 0.56, 0.36), clamp(smileZ * 4.5 + 0.35, 0.0, 1.0));
    }

    // =========================================================================
    // SCENE 1: SAKURA CHERRY BLOSSOM (POLAR ROSE) <-> MARKOWITZ FRONTIER
    // =========================================================================
    else if (scene == 1) {
      float ang = u * 3.14159 + uTime * 0.08;
      // 5-petal Sakura blossom with heart-shaped notch at tip
      float cos5 = cos(5.0 * ang);
      float notch = 0.045 * pow(max(0.0, cos(5.0 * ang)), 8.0);
      float maxR = 0.07 + 0.24 * pow(0.5 + 0.5 * cos5, 0.65) - notch;
      if (rnd < 0.14) {
        // Drifting petals on the spring breeze
        float driftX = mod(u * 0.65 + uTime * 0.09 + rnd, 1.4) - 0.7;
        float driftY = yCenter + (v - 0.5) * 0.44 + 0.04 * sin(uTime * 1.5 + u * 6.0);
        posNat = vec2(driftX * aspect * 0.52, driftY);
        colNat = vec3(0.92, 0.34, 0.54);
      } else if (v < 0.16) {
        // Crimson & gold stamens
        float rStam = (v / 0.16) * 0.095;
        posNat = vec2(cos(ang) * rStam * 1.15 * aspect * 0.52, yCenter + sin(ang) * rStam);
        colNat = mix(vec3(0.76, 0.12, 0.28), vec3(0.88, 0.58, 0.06), smoothstep(0.05, 0.09, rStam));
      } else {
        float rFill = pow((v - 0.16) / 0.84, 0.75) * maxR;
        posNat = vec2(cos(ang) * rFill * 1.18 * aspect * 0.52, yCenter + sin(ang) * rFill * 0.96);
        colNat = mix(vec3(0.84, 0.18, 0.42), vec3(0.96, 0.52, 0.66), smoothstep(0.06, 0.28, rFill));
      }

      if (rnd < 0.26) {
        float tCal = (u * 0.5 + 0.5);
        float calX = -0.52 + tCal * 1.04;
        float calY = -0.34 + tCal * 0.38;
        posQuant = vec2(calX * aspect * 0.52, calY + (v - 0.5) * 0.008);
        colQuant = mix(vec3(0.14, 0.58, 0.34), vec3(0.86, 0.48, 0.06), exp(-pow((tCal - 0.52) * 12.0, 2.0)));
      } else {
        float retMu = u * 0.19;
        float minSigma = sqrt(0.012 + 3.2 * retMu * retMu);
        float sigX = -0.46 + minSigma + pow(v, 1.8) * 0.38;
        posQuant = vec2(sigX * aspect * 0.52, yCenter + retMu);
        colQuant = mix(vec3(0.82, 0.20, 0.44), vec3(0.52, 0.22, 0.68), smoothstep(0.18, 0.0, v));
      }
    }

    // =========================================================================
    // SCENE 2: FRACTAL FERN & BOTANICAL CANOPY <-> ISOLATION FOREST (P-06)
    // =========================================================================
    else if (scene == 2) {
      // Multi-frond botanical fern & canopy
      float frondIdx = floor((u * 0.5 + 0.5) * 7.0) - 3.0; // -3..+3
      float stemT = v; // 0..1 along frond
      float sway = 0.018 * sin(uTime * 1.4 + frondIdx + stemT * 4.0);
      float angle = frondIdx * 0.36;
      float frondLen = 0.34 - abs(frondIdx) * 0.032;
      float spineX = sin(angle) * stemT * frondLen + sway;
      float spineY = -0.38 + cos(angle) * stemT * frondLen;
      float leafletSide = mod(floor(rnd * 20.0), 2.0) * 2.0 - 1.0;
      float leafletSpan = (1.0 - stemT * 0.72) * 0.095 * fract(u * 13.0);
      vec2 normalDir = vec2(cos(angle), -sin(angle));
      posNat = vec2(
        (spineX + normalDir.x * leafletSide * leafletSpan) * aspect * 0.52,
        spineY + normalDir.y * leafletSide * leafletSpan * 0.65
      );
      colNat = mix(vec3(0.05, 0.46, 0.28), vec3(0.32, 0.72, 0.22), stemT);
      if (rnd > 0.90) {
        colNat = vec3(0.88, 0.32, 0.48); // Spring wildflower buds
      }

      // Isolation Forest (P-06) binary decision tree levels
      float level = floor(v * 5.0); // 0..4
      float nodesInLevel = exp2(level);
      float nodeIdx = floor((u * 0.5 + 0.5) * nodesInLevel);
      float xNode = ((nodeIdx + 0.5) / nodesInLevel) * 2.0 - 1.0;
      float parentIdx = floor(nodeIdx * 0.5);
      float xParent = ((parentIdx + 0.5) / max(1.0, nodesInLevel * 0.5)) * 2.0 - 1.0;
      float branchFrac = fract(v * 5.0);
      float treeX = mix(xParent, xNode, branchFrac) * 0.52;
      float treeY = 0.02 - (level + branchFrac) * 0.075;
      posQuant = vec2(treeX * aspect * 0.52, treeY);
      bool isAnomalyNode = (level >= 2.0 && nodeIdx == nodesInLevel - 1.0);
      colQuant = isAnomalyNode
        ? vec3(0.88, 0.28, 0.16) // Isolated outlier node (P-06)
        : mix(vec3(0.06, 0.50, 0.32), vec3(0.14, 0.62, 0.58), level / 4.0);
    }

    // =========================================================================
    // SCENE 3: DANDELION SEEDS IN BREEZE <-> ITO BROWNIAN DIFFUSION
    // =========================================================================
    else if (scene == 3) {
      if (v < 0.42) {
        // Spherical dandelion puff head on the left
        float ang = u * 3.14159;
        float rPuff = sqrt(v / 0.42) * 0.16 * (0.88 + 0.12 * cos(ang * 14.0));
        posNat = vec2((-0.34 + cos(ang) * rPuff * 1.15) * aspect * 0.52, yCenter + sin(ang) * rPuff);
        colNat = mix(vec3(0.38, 0.46, 0.24), vec3(0.82, 0.58, 0.10), smoothstep(0.04, 0.16, rPuff));
      } else {
        // Floating pappus seeds carried rightward by spring wind
        float tWind = (v - 0.42) / 0.58;
        float seedId = floor((u * 0.5 + 0.5) * 26.0) / 26.0 * 2.0 - 1.0;
        float xSeed = -0.22 + tWind * 0.78;
        float ySeed = yCenter + seedId * 0.22 * sqrt(tWind + 0.05)
                    + 0.035 * sin(tWind * 10.0 - uTime * 1.6 + seedId * 12.0);
        posNat = vec2(xSeed * aspect * 0.52, ySeed);
        colNat = mix(vec3(0.84, 0.56, 0.08), vec3(0.18, 0.54, 0.78), tWind);
      }

      if (rnd > 0.72) {
        float xVal = u * 0.22;
        float pdfHeight = 0.22 * exp(-pow(xVal * 7.5, 2.0)) + 0.04 / (1.0 + pow(xVal * 12.0, 2.0));
        posQuant = vec2((0.36 + pdfHeight * (0.3 + 0.7 * v)) * aspect * 0.52, yCenter + xVal);
        colQuant = mix(vec3(0.84, 0.48, 0.06), vec3(0.76, 0.22, 0.44), exp(-pow(xVal * 6.0, 2.0)));
      } else {
        float pathId = floor((u * 0.5 + 0.5) * 32.0) / 32.0 * 2.0 - 1.0;
        float tStep = v;
        float wienerWiggle = 0.042 * sin(tStep * 18.0 + pathId * 37.0 - uTime * 1.4)
                           + 0.022 * cos(tStep * 31.0 - pathId * 19.0);
        float yPath = yCenter + (pathId * 0.21 * sqrt(tStep + 0.01) + wienerWiggle * sqrt(tStep));
        float xPath = -0.54 + tStep * 0.88;
        posQuant = vec2(xPath * aspect * 0.52, yPath);
        colQuant = mix(vec3(0.16, 0.50, 0.78), vec3(0.48, 0.24, 0.76), smoothstep(0.7, 0.98, abs(pathId)));
      }
    }

    // =========================================================================
    // SCENE 4: MONARCH BUTTERFLY (TEMPLE FAY) <-> LORENZ CHAOS ATTRACTOR
    // =========================================================================
    else if (scene == 4) {
      float theta = u * 3.14159;
      // Temple Fay transcendental butterfly curve
      float rButt = exp(sin(theta)) - 2.0 * cos(4.0 * theta) + pow(sin((2.0 * theta - 3.14159) / 24.0), 5.0);
      float wingFlap = 0.86 + 0.14 * sin(uTime * 3.2);
      float scaleR = 0.068 * sqrt(0.15 + 0.85 * v) * rButt;
      posNat = vec2(cos(theta) * scaleR * wingFlap * 1.25 * aspect * 0.52, (yCenter - 0.03) + sin(theta) * scaleR * 0.92);
      colNat = mix(vec3(0.90, 0.36, 0.04), vec3(0.12, 0.46, 0.82), smoothstep(0.65, 0.98, v));
      if (v > 0.92) colNat = vec3(0.18, 0.12, 0.08); // Dark wing veins/rim

      // Lorenz Strange Attractor two-wing figure-8 phase portrait
      float lobe = u >= 0.0 ? 1.0 : -1.0;
      float tLoop = v * 6.28318 * 3.0 + uTime * 0.9;
      float rLoop = 0.04 + 0.16 * fract(abs(u) * 7.0 + v * 0.5);
      float lx = lobe * (0.19 + cos(tLoop) * rLoop);
      float ly = yCenter + sin(tLoop) * rLoop * 0.82 + lobe * cos(tLoop) * 0.04;
      posQuant = vec2(lx * 1.25 * aspect * 0.52, ly);
      colQuant = lobe > 0.0
        ? mix(vec3(0.88, 0.38, 0.06), vec3(0.76, 0.18, 0.42), rLoop / 0.20)
        : mix(vec3(0.12, 0.48, 0.80), vec3(0.08, 0.62, 0.48), rLoop / 0.20);
    }

    // =========================================================================
    // SCENE 5: SPRING FLOCK MURMURATION <-> ORDER BOOK LIQUIDITY DEPTH
    // =========================================================================
    else if (scene == 5) {
      // Swirling murmuration ribbon in spring sky
      float s = u; // [-1, 1] along flock ribbon
      float ribbonX = s * 0.54 + 0.08 * sin(s * 4.5 - uTime * 1.2);
      float ribbonY = yCenter + 0.14 * sin(s * 3.2 + uTime * 0.9) * cos(s * 2.1 - uTime * 0.5);
      float spread = (v - 0.5) * (0.06 + 0.09 * sin(s * 5.0 + uTime));
      posNat = vec2((ribbonX + spread * 0.5) * aspect * 0.52, ribbonY + spread);
      colNat = mix(vec3(0.14, 0.48, 0.74), vec3(0.82, 0.36, 0.16), 0.5 + 0.5 * sin(s * 3.0 + uTime));

      float bookSide = u >= 0.0 ? 1.0 : -1.0;
      float priceDist = abs(u);
      float stepPrice = floor(priceDist * 14.0) / 14.0;
      float depthWallH = 0.24 / (1.0 + exp(-(stepPrice - 0.28) * 9.0));
      float layerZ = floor(v * 8.0) / 8.0;
      float fillWall = fract(v * 8.0);
      float yBook = -0.35 + depthWallH * (0.25 + 0.75 * smoothstep(0.0, 0.3, fillWall)) + layerZ * 0.09;
      float xBook = bookSide * (0.035 + priceDist * 0.52) + (layerZ - 0.5) * 0.08;
      posQuant = vec2(xBook * aspect * 0.52, yBook);
      colQuant = bookSide < 0.0
        ? mix(vec3(0.06, 0.54, 0.34), vec3(0.16, 0.72, 0.48), smoothstep(0.2, 0.9, fillWall))
        : mix(vec3(0.76, 0.16, 0.32), vec3(0.90, 0.34, 0.48), smoothstep(0.2, 0.9, fillWall));
    }

    // =========================================================================
    // SCENE 6: ALPINE RIDGES & MELTWATER RIVERS <-> TOPOGRAPHIC ALPHA MANIFOLD
    // =========================================================================
    else if (scene == 6) {
      float ridgeLayer = floor(v * 14.0) / 14.0;
      float xMtn = u * 0.58;
      float peak1 = 0.22 * exp(-pow((xMtn + 0.18) * 4.2, 2.0));
      float peak2 = 0.26 * exp(-pow((xMtn - 0.16) * 3.8, 2.0));
      float valleyRiver = -0.05 * exp(-pow(xMtn * 9.0, 2.0));
      float elev = peak1 + peak2 + valleyRiver + 0.025 * sin(xMtn * 18.0 + ridgeLayer * 9.0);
      float yMtn = -0.34 + (ridgeLayer - 0.5) * 0.16 + elev * (1.1 - ridgeLayer * 0.45);
      posNat = vec2((xMtn + (ridgeLayer - 0.5) * 0.14) * aspect * 0.52, yMtn);
      if (abs(xMtn) < 0.09 && elev < 0.12) {
        colNat = vec3(0.08, 0.56, 0.78); // Glacial meltwater river
      } else if (elev > 0.19) {
        colNat = vec3(0.42, 0.34, 0.26); // High alpine rock & snow rim
      } else {
        colNat = mix(vec3(0.10, 0.52, 0.28), vec3(0.68, 0.48, 0.16), smoothstep(0.05, 0.18, elev));
      }

      // Topographic iso-Sharpe contour rings
      float ringIdx = floor(v * 9.0) / 9.0;
      float ang = u * 3.14159 + uTime * 0.08;
      float rx = (0.06 + ringIdx * 0.44) * (1.0 + 0.12 * cos(ang * 3.0));
      float ry = (0.04 + ringIdx * 0.20) * (1.0 + 0.12 * sin(ang * 2.0));
      float elevZ = (1.0 - ringIdx) * 0.12;
      posQuant = vec2(cos(ang) * rx * aspect * 0.52, (yCenter - 0.06) + sin(ang) * ry + elevZ);
      colQuant = mix(vec3(0.84, 0.38, 0.08), vec3(0.08, 0.56, 0.42), ringIdx);
    }

    // =========================================================================
    // SCENE 7: HONEYCOMB HIVE & POLLEN <-> CORRELATION NETWORK GRAPH
    // =========================================================================
    else {
      // Hexagonal honeycomb lattice
      float cellId = floor((u * 0.5 + 0.5) * 19.0); // 19 hex cells
      float row = floor(cellId / 5.0) - 1.5;
      float colIdx = mod(cellId, 5.0) - 2.0 + mod(abs(row), 2.0) * 0.5;
      vec2 hexCenter = vec2(colIdx * 0.19, yCenter + row * 0.11);
      float side = floor(v * 6.0);
      float edgeT = fract(v * 6.0);
      float a1 = side * 1.04719755;
      float a2 = (side + 1.0) * 1.04719755;
      float rHex = 0.082;
      vec2 hexPt = hexCenter + mix(vec2(cos(a1), sin(a1)), vec2(cos(a2), sin(a2)), edgeT) * rHex;
      posNat = vec2(hexPt.x * aspect * 0.52, hexPt.y);
      colNat = mix(vec3(0.84, 0.52, 0.04), vec3(0.68, 0.34, 0.06), fract(cellId * 0.37));

      // Multi-Asset Correlation Cluster Network (Nodes + Spanning Edges)
      float nClusters = 7.0;
      float cIdx = floor((u * 0.5 + 0.5) * nClusters);
      float cAng = cIdx * (6.28318 / nClusters) + uTime * 0.10;
      vec2 hubPos = vec2(cos(cAng) * 0.34, yCenter + sin(cAng) * 0.18);
      if (v < 0.55) {
        // Dense asset cluster node
        float subAng = rnd * 6.28318;
        float subR = sqrt(v / 0.55) * 0.065;
        posQuant = vec2((hubPos.x + cos(subAng) * subR) * aspect * 0.52, hubPos.y + sin(subAng) * subR);
        colQuant = mix(vec3(0.52, 0.22, 0.76), vec3(0.08, 0.56, 0.44), cIdx / nClusters);
      } else {
        // Correlation bridge to neighbor hub
        float nextAng = mod(cIdx + 2.0, nClusters) * (6.28318 / nClusters) + uTime * 0.10;
        vec2 nextHub = vec2(cos(nextAng) * 0.34, yCenter + sin(nextAng) * 0.18);
        float tEdge = (v - 0.55) / 0.45;
        vec2 edgePt = mix(hubPos, nextHub, tEdge);
        posQuant = vec2(edgePt.x * aspect * 0.52, edgePt.y);
        colQuant = vec3(0.82, 0.48, 0.08);
      }
    }

    vec2 worldPos = mix(posNat, posQuant, m);
    vColor = mix(colNat, colQuant, m);

    vec2 ndc = vec2(worldPos.x / (aspect * 0.5), worldPos.y * 2.0);
    gl_Position = vec4(ndc, 0.0, 1.0);

    float breeze = 0.80 + 0.20 * sin(uTime * 2.2 + rnd * 40.0);
    vAngle = uTime * 0.6 + rnd * 6.28318;
    if (rnd < 0.45) {
      // Soft watercolor botanical wash puff
      vAlpha = 0.085;
      gl_PointSize = (13.0 + rnd * 14.0) * uDpr;
    } else if (rnd < 0.92) {
      // Crisp pollen / seed / pigment grain
      vAlpha = breeze * 0.72;
      gl_PointSize = (2.8 + fract(rnd * 17.0) * 2.4) * uDpr;
    } else {
      // Delicate 5-petal blossom / botanical spark
      vAlpha = breeze * 0.92;
      gl_PointSize = 8.2 * uDpr;
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

    if (vStarType < 0.45) {
      float puff = smoothstep(1.0, 0.0, r);
      puff = puff * puff * (3.0 - 2.0 * puff);
      gl_FragColor = vec4(vColor, puff * vAlpha);
      return;
    }

    if (vStarType >= 0.92) {
      // Miniature 5-petal blossom shape
      float a = atan(p.y, p.x) + vAngle;
      float blossom = 0.55 + 0.45 * cos(a * 5.0);
      float mask = smoothstep(blossom, blossom * 0.2, r);
      gl_FragColor = vec4(vColor, mask * vAlpha);
      return;
    }

    float core = exp(-r * r * 4.5);
    gl_FragColor = vec4(vColor, core * vAlpha);
  }
`;


