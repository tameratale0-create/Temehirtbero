import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([len, typeAndData, crc]);
}

function createPNG(width, height, isMaskable = false) {
  // Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with RGBA data
  // Color palette:
  // Emerald Green #065f46 = [6, 95, 70, 255]
  // Deep Dark #022c22 = [2, 44, 34, 255]
  // Amber / Gold #facc15 = [250, 204, 21, 255]
  // White = [255, 255, 255, 255]
  // Flag Red #dc2626 = [220, 38, 38, 255]
  // Flag Yellow #facc15
  // Flag Green #16a34a = [22, 163, 74, 255]

  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = isMaskable ? width * 0.48 : width * 0.46;
  const innerR = isMaskable ? width * 0.38 : width * 0.37;
  const centerR = isMaskable ? width * 0.28 : width * 0.27;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let r = 2, g = 44, b = 34, a = 255; // Dark emerald background

      if (dist <= outerR && dist > outerR - (width * 0.04)) {
        // Gold Outer Ring
        r = 250; g = 204; b = 21; a = 255;
      } else if (dist <= outerR - (width * 0.04) && dist > innerR) {
        // Tricolor band
        const angle = Math.atan2(dy, dx); // -PI to PI
        if (angle < -0.6) {
          // Green
          r = 22; g = 163; b = 74; a = 255;
        } else if (angle >= -0.6 && angle < 1.0) {
          // Yellow
          r = 250; g = 204; b = 21; a = 255;
        } else {
          // Red
          r = 220; g = 38; b = 38; a = 255;
        }
      } else if (dist <= innerR && dist > innerR - (width * 0.025)) {
        // Inner Gold Border
        r = 234; g = 179; b = 8; a = 255;
      } else if (dist <= innerR - (width * 0.025)) {
        // Center disk - Forest Green
        r = 6; g = 95; b = 70; a = 255;

        // Book shape in center
        const relX = Math.abs(dx) / (width * 0.25);
        const relY = (dy + height * 0.02) / (height * 0.18);

        if (relX <= 1.0 && relY >= -0.7 && relY <= 0.8 && (relX + relY * 0.3 <= 1.1)) {
          // White pages of open book
          r = 255; g = 255; b = 255; a = 255;

          // Torch flame in middle top
          if (Math.abs(dx) < width * 0.04 && dy < -height * 0.05 && dy > -height * 0.22) {
            r = 239; g = 68; b = 68; a = 255; // Flame red
          }
          if (Math.abs(dx) < width * 0.02 && dy < -height * 0.08 && dy > -height * 0.18) {
            r = 250; g = 204; b = 21; a = 255; // Flame gold core
          }
        }

        // Center star
        if (dist < width * 0.06 && dy > -height * 0.02 && dy < height * 0.06) {
          r = 234; g = 179; b = 8; a = 255;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, false));

console.log('Successfully generated all PWA icons in /public:');
console.log('- pwa-192x192.png');
console.log('- pwa-512x512.png');
console.log('- pwa-maskable-512x512.png');
console.log('- apple-touch-icon.png');
console.log('- favicon.ico');
