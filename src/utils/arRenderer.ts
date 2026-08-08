import { JewelryItem, MetalType, GemstoneType, ModelLandmarks } from '../types/jewelry';
import { METALS_CONFIG, GEMSTONES_CONFIG } from '../data/jewelryData';

export interface ARRenderOptions {
  activeItems: JewelryItem[];
  metalOverrides?: Record<string, MetalType>;
  gemstoneOverrides?: Record<string, GemstoneType>;
  manualAdjustments?: Record<
    string,
    { scale: number; x: number; y: number; rotation: number }
  >;
  landmarks: ModelLandmarks;
  canvasWidth: number;
  canvasHeight: number;
  time: number;
  sparkleEnabled: boolean;
  lightAngle: number; // in degrees
  shadowDepth: number; // 0 to 1
  earringPhysics?: {
    angleLeft: number;
    angleRight: number;
  };
}

export function renderJewelryOnCanvas(
  ctx: CanvasRenderingContext2D,
  options: ARRenderOptions
) {
  const {
    activeItems,
    metalOverrides = {},
    gemstoneOverrides = {},
    manualAdjustments = {},
    landmarks,
    canvasWidth,
    canvasHeight,
    time,
    sparkleEnabled,
    lightAngle,
    shadowDepth,
    earringPhysics = { angleLeft: 0, angleRight: 0 },
  } = options;

  // Sort items by layer index
  const sortedItems = [...activeItems].sort(
    (a, b) => a.arData.layerIndex - b.arData.layerIndex
  );

  // Coordinate normalizer (assuming base coordinate space 1000x1000)
  const scaleX = canvasWidth / 1000;
  const scaleY = canvasHeight / 1000;

  for (const item of sortedItems) {
    const metal = metalOverrides[item.id] || item.metal;
    const gemstone = gemstoneOverrides[item.id] || item.gemstone;
    const metalConfig = METALS_CONFIG[metal] || METALS_CONFIG.platinum;
    const gemConfig = GEMSTONES_CONFIG[gemstone] || GEMSTONES_CONFIG.diamond;

    const manual = manualAdjustments[item.id] || { scale: 1, x: 0, y: 0, rotation: 0 };
    const baseScale = item.arData.scale * manual.scale;

    ctx.save();

    switch (item.arData.anchor) {
      case 'ears': {
        // Render Left Earring
        const leftX = (landmarks.leftEar.x + manual.x) * scaleX;
        const leftY = (landmarks.leftEar.y + manual.y + item.arData.offsetY) * scaleY;
        renderEarring(
          ctx,
          leftX,
          leftY,
          baseScale * scaleX,
          item,
          metalConfig,
          gemConfig,
          earringPhysics.angleLeft + manual.rotation,
          'left',
          time,
          sparkleEnabled,
          shadowDepth
        );

        // Render Right Earring
        const rightX = (landmarks.rightEar.x + manual.x) * scaleX;
        const rightY = (landmarks.rightEar.y + manual.y + item.arData.offsetY) * scaleY;
        renderEarring(
          ctx,
          rightX,
          rightY,
          baseScale * scaleX,
          item,
          metalConfig,
          gemConfig,
          earringPhysics.angleRight - manual.rotation,
          'right',
          time + 300,
          sparkleEnabled,
          shadowDepth
        );
        break;
      }

      case 'neck': {
        const neckX = (landmarks.neck.x + manual.x) * scaleX;
        const neckY = (landmarks.neck.y + manual.y + item.arData.offsetY) * scaleY;
        const leftEarX = landmarks.leftEar.x * scaleX;
        const rightEarX = landmarks.rightEar.x * scaleX;
        const neckWidth = Math.abs(rightEarX - leftEarX) * 0.72;

        renderNecklace(
          ctx,
          neckX,
          neckY,
          neckWidth,
          baseScale * scaleX,
          item,
          metalConfig,
          gemConfig,
          manual.rotation,
          time,
          sparkleEnabled,
          shadowDepth
        );
        break;
      }

      case 'forehead': {
        const headX = (landmarks.forehead.x + manual.x) * scaleX;
        const headY = (landmarks.forehead.y + manual.y + item.arData.offsetY) * scaleY;
        const leftEarX = landmarks.leftEar.x * scaleX;
        const rightEarX = landmarks.rightEar.x * scaleX;
        const headWidth = Math.abs(rightEarX - leftEarX) * 0.95;

        renderTiara(
          ctx,
          headX,
          headY,
          headWidth,
          baseScale * scaleX,
          item,
          metalConfig,
          gemConfig,
          manual.rotation,
          time,
          sparkleEnabled,
          shadowDepth
        );
        break;
      }

      case 'eyes': {
        const leftEyeX = landmarks.leftEye.x * scaleX;
        const leftEyeY = landmarks.leftEye.y * scaleY;
        const rightEyeX = landmarks.rightEye.x * scaleX;
        const rightEyeY = landmarks.rightEye.y * scaleY;
        const eyeCenterX = (leftEyeX + rightEyeX) / 2 + manual.x * scaleX;
        const eyeCenterY = (leftEyeY + rightEyeY) / 2 + manual.y * scaleY;
        const eyeDistance = Math.hypot(rightEyeX - leftEyeX, rightEyeY - leftEyeY);
        const eyeAngle = Math.atan2(rightEyeY - leftEyeY, rightEyeX - leftEyeX);

        renderEyewear(
          ctx,
          eyeCenterX,
          eyeCenterY,
          eyeDistance * 1.6,
          baseScale * scaleX,
          item,
          metalConfig,
          gemConfig,
          eyeAngle + (manual.rotation * Math.PI) / 180,
          time,
          sparkleEnabled,
          shadowDepth
        );
        break;
      }

      case 'finger':
      case 'wrist': {
        // Render in wrist/finger area if present, or as luxurious lower floating staging
        const stagingX = (landmarks.ringFinger?.x || landmarks.leftWrist?.x || 500 + manual.x) * scaleX;
        const stagingY = (landmarks.ringFinger?.y || landmarks.leftWrist?.y || 880 + manual.y) * scaleY;

        renderStagedRingOrBracelet(
          ctx,
          stagingX,
          stagingY,
          baseScale * scaleX,
          item,
          metalConfig,
          gemConfig,
          manual.rotation,
          time,
          sparkleEnabled,
          shadowDepth
        );
        break;
      }
    }

    ctx.restore();
  }
}

// ----------------------------------------------------
// INDIVIDUAL JEWELRY PIECE RENDERERS WITH RICH GRAPHICS
// ----------------------------------------------------

function renderEarring(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  item: JewelryItem,
  metal: any,
  gem: any,
  angle: number,
  side: 'left' | 'right',
  time: number,
  sparkleEnabled: boolean,
  shadowDepth: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.scale(scale, scale);

  // 1. Soft Contact Shadow on earlobe/neck
  if (shadowDepth > 0) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 14 * shadowDepth;
    ctx.shadowOffsetX = side === 'left' ? 4 * shadowDepth : -4 * shadowDepth;
    ctx.shadowOffsetY = 6 * shadowDepth;
    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.beginPath();
    ctx.arc(0, 20, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. Ear stud / hook anchor (Top Post)
  const metalGrad = ctx.createLinearGradient(-10, -5, 10, 15);
  metalGrad.addColorStop(0, metal.gradient[0]);
  metalGrad.addColorStop(0.3, metal.gradient[1]);
  metalGrad.addColorStop(0.7, metal.gradient[2]);
  metalGrad.addColorStop(1, metal.gradient[3]);

  ctx.fillStyle = metalGrad;
  ctx.strokeStyle = metal.shadowHex;
  ctx.lineWidth = 1.2;

  // Ear post stud
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Small center diamond on post
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 3. Render specific earring body based on renderType
  if (item.arData.renderType === 'dangle_earring' || item.arData.renderType === 'chandelier_earring') {
    // Chain connecting to drop
    ctx.strokeStyle = metalGrad;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(0, 16);
    ctx.stroke();

    // Small intermediate link gem
    ctx.fillStyle = gem.color;
    ctx.beginPath();
    ctx.arc(0, 16, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Dangle connector
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(0, 26);
    ctx.stroke();

    // Chandelier arms if applicable
    if (item.arData.renderType === 'chandelier_earring') {
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-14, 26);
      ctx.quadraticCurveTo(0, 30, 14, 26);
      ctx.stroke();

      // Left & right mini gems
      drawFacetedGem(ctx, -14, 32, 4, gem.color, gem.sparkleColor);
      drawFacetedGem(ctx, 14, 32, 4, gem.color, gem.sparkleColor);
    }

    // Main Pear Cut Drop Gemstone
    const gemY = item.arData.renderType === 'chandelier_earring' ? 42 : 36;
    drawPearDropGem(ctx, 0, gemY, 9, 15, gem.color, gem.secondaryColor, metal.gradient[1]);
  } else if (item.arData.renderType === 'hoop_earring') {
    // Inside-out Hoop
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = metalGrad;
    ctx.beginPath();
    ctx.ellipse(side === 'left' ? 3 : -3, 14, 11, 15, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Micro diamonds on hoop
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 7; i++) {
      const theta = 0.4 + i * 0.35;
      const hx = (side === 'left' ? 3 : -3) + Math.cos(theta) * 11;
      const hy = 14 + Math.sin(theta) * 15;
      ctx.beginPath();
      ctx.arc(hx, hy, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Stud or halo
    drawFacetedGem(ctx, 0, 8, 7, gem.color, gem.sparkleColor);
  }

  // 4. Dynamic Specular Sparkles
  if (sparkleEnabled) {
    const twinkle = Math.sin(time / 220 + (side === 'left' ? 0 : 2.5));
    if (twinkle > 0.4) {
      const sparkleAlpha = (twinkle - 0.4) / 0.6;
      drawSparkle(ctx, 0, 38, 7 * sparkleAlpha, gem.sparkleColor, sparkleAlpha);
    }
  }

  ctx.restore();
}

function renderNecklace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  scale: number,
  item: JewelryItem,
  metal: any,
  gem: any,
  rotation: number,
  time: number,
  sparkleEnabled: boolean,
  shadowDepth: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);

  const halfW = width / 2;
  const isChoker = item.arData.renderType === 'choker_necklace';
  const isLayered = item.arData.renderType === 'layered_necklace';
  const depth = isChoker ? 22 : 44;

  // 1. Soft Shadow on chest
  if (shadowDepth > 0) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 16 * shadowDepth;
    ctx.shadowOffsetY = 8 * shadowDepth;
    ctx.strokeStyle = 'rgba(0,0,0,0.01)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-halfW, -10);
    ctx.quadraticCurveTo(0, depth + 8, halfW, -10);
    ctx.stroke();
    ctx.restore();
  }

  // Metal chain gradient
  const metalGrad = ctx.createLinearGradient(-halfW, 0, halfW, depth);
  metalGrad.addColorStop(0, metal.gradient[0]);
  metalGrad.addColorStop(0.5, metal.gradient[1]);
  metalGrad.addColorStop(1, metal.gradient[2]);

  // Draw main chain curve
  ctx.strokeStyle = metalGrad;
  ctx.lineWidth = isChoker ? 4.5 : 2.2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(-halfW, -8);
  ctx.quadraticCurveTo(0, depth, halfW, -8);
  ctx.stroke();

  // If tennis choker: render diamond row
  if (isChoker) {
    const steps = 28;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Quadratic Bezier point
      const bx = (1 - t) * (1 - t) * -halfW + 2 * (1 - t) * t * 0 + t * t * halfW;
      const by = (1 - t) * (1 - t) * -8 + 2 * (1 - t) * t * depth + t * t * -8;

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bx, by, 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = metal.gradient[2];
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  // If layered: draw second longer layer
  if (isLayered) {
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-halfW * 0.88, -12);
    ctx.quadraticCurveTo(0, depth + 32, halfW * 0.88, -12);
    ctx.stroke();

    // Roman Coin Medallion on lower layer
    ctx.fillStyle = metalGrad;
    ctx.beginPath();
    ctx.arc(0, depth + 32, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = metal.shadowHex;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Embossed relief in coin
    ctx.fillStyle = metal.gradient[0];
    ctx.beginPath();
    ctx.arc(0, depth + 32, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Central Pendant (Solitaire / Royal Sapphire Halo)
  if (!isChoker) {
    const pendantY = depth + 4;

    // Bail loop connecting to chain
    ctx.fillStyle = metalGrad;
    ctx.beginPath();
    ctx.ellipse(0, pendantY - 5, 2.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (item.gemstone === 'sapphire') {
      // Big Royal Blue Cushion Halo
      drawHaloPendant(ctx, 0, pendantY + 8, 14, 18, gem.color, gem.secondaryColor, metal.gradient[1]);
    } else {
      // Brilliant Solitaire Diamond with 4 Prongs
      drawSolitairePendant(ctx, 0, pendantY + 8, 12, gem.color, gem.sparkleColor, metal.gradient[1]);
    }

    // Sparkles
    if (sparkleEnabled) {
      const tw1 = Math.sin(time / 280);
      if (tw1 > 0.3) {
        drawSparkle(ctx, 0, pendantY + 8, 9, gem.sparkleColor, (tw1 - 0.3) / 0.7);
      }
    }
  }

  ctx.restore();
}

function renderTiara(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  scale: number,
  item: JewelryItem,
  metal: any,
  gem: any,
  rotation: number,
  time: number,
  sparkleEnabled: boolean,
  shadowDepth: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);

  const halfW = width / 2;

  // 1. Soft Shadow
  if (shadowDepth > 0) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 18 * shadowDepth;
    ctx.shadowOffsetY = 6 * shadowDepth;
    ctx.strokeStyle = 'rgba(0,0,0,0.01)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-halfW, 10);
    ctx.quadraticCurveTo(0, 0, halfW, 10);
    ctx.stroke();
    ctx.restore();
  }

  // Base Arc
  const metalGrad = ctx.createLinearGradient(-halfW, -40, halfW, 10);
  metalGrad.addColorStop(0, metal.gradient[0]);
  metalGrad.addColorStop(0.5, metal.gradient[1]);
  metalGrad.addColorStop(1, metal.gradient[2]);

  ctx.strokeStyle = metalGrad;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(-halfW, 8);
  ctx.quadraticCurveTo(0, -6, halfW, 8);
  ctx.stroke();

  // Tiara Arches / Spikes
  const peaks = [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75];
  const peakHeights = [18, 28, 38, 48, 38, 28, 18];

  ctx.lineWidth = 2.0;
  for (let i = 0; i < peaks.length; i++) {
    const px = peaks[i] * halfW;
    const baseY = Math.pow(peaks[i], 2) * 8 - 4;
    const peakY = baseY - peakHeights[i];

    // Arch to peak
    ctx.beginPath();
    ctx.moveTo(px - 14, baseY);
    ctx.quadraticCurveTo(px, peakY, px + 14, baseY);
    ctx.stroke();

    // Center jewel at peak
    const gemSize = i === 3 ? 5.5 : 4;
    drawFacetedGem(ctx, px, peakY, gemSize, gem.color, gem.sparkleColor);

    // Pearl drop on center peak
    if (i === 3) {
      ctx.fillStyle = '#FFFDF2';
      ctx.beginPath();
      ctx.arc(px, peakY - 8, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Sparkles on Tiara peaks
  if (sparkleEnabled) {
    const tw = Math.sin(time / 200);
    if (tw > 0.2) {
      drawSparkle(ctx, 0, -52, 11, gem.sparkleColor, (tw - 0.2) / 0.8);
      drawSparkle(ctx, -halfW * 0.25, -42, 8, gem.sparkleColor, (tw - 0.2) / 0.8);
      drawSparkle(ctx, halfW * 0.25, -42, 8, gem.sparkleColor, (tw - 0.2) / 0.8);
    }
  }

  ctx.restore();
}

function renderEyewear(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  scale: number,
  item: JewelryItem,
  metal: any,
  gem: any,
  angle: number,
  time: number,
  sparkleEnabled: boolean,
  shadowDepth: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  const halfW = width / 2;
  const lensRadius = halfW * 0.38;
  const bridgeWidth = halfW * 0.22;

  // Frame metal gradient
  const metalGrad = ctx.createLinearGradient(-halfW, -20, halfW, 20);
  metalGrad.addColorStop(0, metal.gradient[0]);
  metalGrad.addColorStop(0.5, metal.gradient[1]);
  metalGrad.addColorStop(1, metal.gradient[2]);

  // Bridge
  ctx.strokeStyle = metalGrad;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-bridgeWidth / 2, -4);
  ctx.quadraticCurveTo(0, -10, bridgeWidth / 2, -4);
  ctx.stroke();

  // Top brow bar
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(-halfW * 0.65, -16);
  ctx.lineTo(halfW * 0.65, -16);
  ctx.stroke();

  // Left & Right Lenses (Aviator teardrop shape)
  const drawAviatorLens = (cx: number) => {
    ctx.save();
    ctx.translate(cx, 0);

    // Tinted gradient lens
    const lensGrad = ctx.createLinearGradient(0, -25, 0, 30);
    lensGrad.addColorStop(0, 'rgba(30, 35, 45, 0.85)');
    lensGrad.addColorStop(0.6, 'rgba(45, 55, 75, 0.70)');
    lensGrad.addColorStop(1, 'rgba(180, 150, 110, 0.55)');

    ctx.fillStyle = lensGrad;
    ctx.beginPath();
    ctx.moveTo(-lensRadius * 0.85, -16);
    ctx.lineTo(lensRadius * 0.85, -16);
    ctx.quadraticCurveTo(lensRadius * 1.05, 12, 0, lensRadius * 1.25);
    ctx.quadraticCurveTo(-lensRadius * 1.05, 12, -lensRadius * 0.85, -16);
    ctx.closePath();
    ctx.fill();

    // Gold frame rim
    ctx.strokeStyle = metalGrad;
    ctx.lineWidth = 3.0;
    ctx.stroke();

    // Specular glass glare
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-lensRadius * 0.6, -10);
    ctx.lineTo(lensRadius * 0.3, 15);
    ctx.stroke();

    ctx.restore();
  };

  drawAviatorLens(-halfW * 0.52);
  drawAviatorLens(halfW * 0.52);

  // Diamond studs on corners
  drawFacetedGem(ctx, -halfW * 0.95, -14, 3, '#FFFFFF', '#FFFFFF');
  drawFacetedGem(ctx, halfW * 0.95, -14, 3, '#FFFFFF', '#FFFFFF');

  ctx.restore();
}

function renderStagedRingOrBracelet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  item: JewelryItem,
  metal: any,
  gem: any,
  rotation: number,
  time: number,
  sparkleEnabled: boolean,
  shadowDepth: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale * 1.25, scale * 1.25);

  const metalGrad = ctx.createLinearGradient(-30, -30, 30, 30);
  metalGrad.addColorStop(0, metal.gradient[0]);
  metalGrad.addColorStop(0.4, metal.gradient[1]);
  metalGrad.addColorStop(0.8, metal.gradient[2]);
  metalGrad.addColorStop(1, metal.gradient[3]);

  if (item.category === 'rings') {
    // Solitaire / Halo Engagement Ring
    // 1. Ring Band (Oval perspective)
    ctx.lineWidth = 6.5;
    ctx.strokeStyle = metalGrad;
    ctx.beginPath();
    ctx.ellipse(0, 10, 24, 14, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Crown Setting Prongs
    ctx.fillStyle = metalGrad;
    ctx.beginPath();
    ctx.moveTo(-10, 2);
    ctx.lineTo(-7, -10);
    ctx.lineTo(7, -10);
    ctx.lineTo(10, 2);
    ctx.closePath();
    ctx.fill();

    // 3. Main Center Gemstone
    if (item.arData.renderType === 'halo_ring') {
      drawHaloPendant(ctx, 0, -12, 14, 18, gem.color, gem.secondaryColor, metal.gradient[1]);
    } else {
      drawSolitairePendant(ctx, 0, -12, 16, gem.color, gem.sparkleColor, metal.gradient[1]);
    }
  } else if (item.category === 'watches') {
    // Luxury Watch Face
    ctx.fillStyle = '#111218';
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();

    // Gold diamond bezel
    ctx.strokeStyle = metalGrad;
    ctx.lineWidth = 7;
    ctx.stroke();

    // Watch dial ticks & hands
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -18); // Hour hand
    ctx.moveTo(0, 0);
    ctx.lineTo(14, 8); // Minute hand
    ctx.stroke();
  } else {
    // Tennis Bracelet
    ctx.strokeStyle = metalGrad;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 18, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Diamond row
    for (let i = 0; i < 16; i++) {
      const th = (i / 16) * Math.PI * 2;
      const bx = Math.cos(th) * 48;
      const by = Math.sin(th) * 18;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Sparkles
  if (sparkleEnabled) {
    const tw = Math.sin(time / 240);
    if (tw > 0.25) {
      drawSparkle(ctx, 0, -14, 10, gem.sparkleColor, (tw - 0.25) / 0.75);
    }
  }

  ctx.restore();
}

// ----------------------------------------------------
// GEMSTONE & SPARKLE VECTOR DRAWING UTILITIES
// ----------------------------------------------------

function drawPearDropGem(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  secondaryColor: string,
  metalColor: string
) {
  ctx.save();
  ctx.translate(x, y);

  // Metal bezel rim
  ctx.strokeStyle = metalColor;
  ctx.lineWidth = 1.8;
  ctx.fillStyle = secondaryColor;

  ctx.beginPath();
  ctx.moveTo(0, -h * 0.6);
  ctx.bezierCurveTo(w, -h * 0.1, w, h * 0.5, 0, h * 0.6);
  ctx.bezierCurveTo(-w, h * 0.5, -w, -h * 0.1, 0, -h * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Internal faceted fire
  const gemGrad = ctx.createRadialGradient(-w * 0.25, -h * 0.2, 1, 0, 0, h * 0.6);
  gemGrad.addColorStop(0, '#FFFFFF');
  gemGrad.addColorStop(0.3, color);
  gemGrad.addColorStop(1, secondaryColor);

  ctx.fillStyle = gemGrad;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.48);
  ctx.bezierCurveTo(w * 0.75, -h * 0.1, w * 0.75, h * 0.4, 0, h * 0.48);
  ctx.bezierCurveTo(-w * 0.75, h * 0.4, -w * 0.75, -h * 0.1, 0, -h * 0.48);
  ctx.closePath();
  ctx.fill();

  // Specular facet reflection
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.4);
  ctx.lineTo(w * 0.35, 0);
  ctx.lineTo(0, h * 0.2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawSolitairePendant(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  sparkleColor: string,
  metalColor: string
) {
  ctx.save();
  ctx.translate(x, y);

  // Metal 6 prongs
  ctx.strokeStyle = metalColor;
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 6; i++) {
    const th = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(th) * (radius * 0.7), Math.sin(th) * (radius * 0.7));
    ctx.lineTo(Math.cos(th) * (radius + 2), Math.sin(th) * (radius + 2));
    ctx.stroke();
  }

  // Gem body
  const gemGrad = ctx.createRadialGradient(-radius * 0.35, -radius * 0.35, 1, 0, 0, radius);
  gemGrad.addColorStop(0, '#FFFFFF');
  gemGrad.addColorStop(0.4, color);
  gemGrad.addColorStop(1, '#90CDF4');

  ctx.fillStyle = gemGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // 8 Hearts & Arrows star facets
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const th = (i / 8) * Math.PI * 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(th) * radius, Math.sin(th) * radius);
  }
  ctx.stroke();

  // Center table facet
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(-radius * 0.2, -radius * 0.2, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawHaloPendant(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  gemColor: string,
  gemSecColor: string,
  metalColor: string
) {
  ctx.save();
  ctx.translate(x, y);

  // Outer diamond halo
  const numHalo = 14;
  for (let i = 0; i < numHalo; i++) {
    const th = (i / numHalo) * Math.PI * 2;
    const hx = Math.cos(th) * (w + 4);
    const hy = Math.sin(th) * (h + 4);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(hx, hy, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = metalColor;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Center Gemstone Cushion shape
  const grad = ctx.createLinearGradient(-w, -h, w, h);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.3, gemColor);
  grad.addColorStop(1, gemSecColor);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(-w, -h, w * 2, h * 2, 6);
  ctx.fill();
  ctx.strokeStyle = metalColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

function drawFacetedGem(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  sparkleColor: string
) {
  ctx.save();
  ctx.translate(x, y);

  const grad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 1, 0, 0, radius);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.4, color);
  grad.addColorStop(1, '#1A202C');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.restore();
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  ctx.fillStyle = color;
  ctx.beginPath();

  // 4-pointed diamond star sparkle
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(0, 0, size, 0);
  ctx.quadraticCurveTo(0, 0, 0, size);
  ctx.quadraticCurveTo(0, 0, -size, 0);
  ctx.quadraticCurveTo(0, 0, 0, -size);
  ctx.closePath();
  ctx.fill();

  // Central glowing dot
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
