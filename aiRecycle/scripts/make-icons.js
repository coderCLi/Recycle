const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '../src/static/images/tabBar');

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

const createPNG = (width, height, r, g, b, a) => {
  const png = [];
  png.push(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A);
  
  const ihdr = [
    (width >> 24) & 0xFF, (width >> 16) & 0xFF, (width >> 8) & 0xFF, width & 0xFF,
    (height >> 24) & 0xFF, (height >> 16) & 0xFF, (height >> 8) & 0xFF, height & 0xFF,
    8, 6, 0, 0, 0
  ];
  addChunk(png, 'IHDR', ihdr);
  
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      rawData.push(r, g, b, a);
    }
  }
  
  const deflated = deflateRaw(rawData);
  addChunk(png, 'IDAT', deflated);
  addChunk(png, 'IEND', []);
  
  return Buffer.from(png);
};

const crc32Table = (() => {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table.push(c >>> 0);
  }
  return table;
})();

const crc32 = (data) => {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crc32Table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
};

const addChunk = (png, type, data) => {
  const length = data.length;
  png.push((length >> 24) & 0xFF, (length >> 16) & 0xFF, (length >> 8) & 0xFF, length & 0xFF);
  
  const typeBytes = type.split('').map(c => c.charCodeAt(0));
  png.push(...typeBytes);
  png.push(...data);
  
  const crcData = [...typeBytes, ...data];
  const crc = crc32(crcData);
  png.push((crc >> 24) & 0xFF, (crc >> 16) & 0xFF, (crc >> 8) & 0xFF, crc & 0xFF);
};

const deflateRaw = (data) => {
  const result = [0x78, 0x01];
  const blockSize = 65535;
  
  for (let i = 0; i < data.length; i += blockSize) {
    const block = data.slice(i, Math.min(i + blockSize, data.length));
    const isLast = (i + blockSize >= data.length);
    
    result.push(isLast ? 1 : 0);
    const len = block.length;
    result.push(len & 0xFF, (len >> 8) & 0xFF);
    result.push((~len) & 0xFF, ((~len) >> 8) & 0xFF);
    result.push(...block);
  }
  
  let adler = 1;
  let s1 = 1, s2 = 0;
  for (let i = 0; i < data.length; i++) {
    s1 = (s1 + data[i]) % 65521;
    s2 = (s2 + s1) % 65521;
  }
  adler = (s2 << 16) | s1;
  result.push((adler >> 24) & 0xFF, (adler >> 16) & 0xFF, (adler >> 8) & 0xFF, adler & 0xFF);
  
  return result;
};

const homeIcon = createPNG(48, 48, 153, 153, 153, 255);
const homeActiveIcon = createPNG(48, 48, 0, 168, 255, 255);
const priceIcon = createPNG(48, 48, 153, 153, 153, 255);
const priceActiveIcon = createPNG(48, 48, 0, 168, 255, 255);
const mineIcon = createPNG(48, 48, 153, 153, 153, 255);
const mineActiveIcon = createPNG(48, 48, 0, 168, 255, 255);

fs.writeFileSync(path.join(iconDir, 'home.png'), homeIcon);
fs.writeFileSync(path.join(iconDir, 'home-active.png'), homeActiveIcon);
fs.writeFileSync(path.join(iconDir, 'price.png'), priceIcon);
fs.writeFileSync(path.join(iconDir, 'price-active.png'), priceActiveIcon);
fs.writeFileSync(path.join(iconDir, 'mine.png'), mineIcon);
fs.writeFileSync(path.join(iconDir, 'mine-active.png'), mineActiveIcon);

console.log('Icons generated successfully!');