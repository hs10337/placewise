function createBillboardTextures(THREE) {
  const result = {};
  const font = 'Arial, Helvetica, sans-serif';
  const make = (name, width, height, paint) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    paint(ctx, width, height);
    // A fine LED matrix keeps the screens luminous without softening their type.
    ctx.fillStyle = 'rgba(0,0,0,.11)';
    for (let y = 0; y < height; y += 5) ctx.fillRect(0, y, width, 1);
    const texture = new THREE.CanvasTexture(canvas);
    if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    result[name] = texture;
  };
  const type = (ctx, text, x, y, size, color, weight = 900, align = 'left') => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px ${font}`;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, x, y);
  };
  const gradient = (ctx, width, height, colors, horizontal = false) => {
    const g = ctx.createLinearGradient(0, 0, horizontal ? width : 0, horizontal ? 0 : height);
    colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  };

  make('timesSquare', 1024, 512, (ctx, w, h) => {
    ctx.fillStyle = '#baff18'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#07170f'; ctx.fillRect(694, 0, 330, h);
    type(ctx, 'NEW YORK', 36, 64, 38, '#07170f', 800);
    type(ctx, 'NYC', 19, 343, 306, '#07170f');
    type(ctx, 'ALWAYS ON.', 39, 459, 61, '#07170f');
    ctx.save(); ctx.translate(853, 268); ctx.rotate(-Math.PI / 2);
    type(ctx, 'TIMES SQUARE', 0, 26, 70, '#f7ffec', 900, 'center'); ctx.restore();
    ctx.strokeStyle = '#baff18'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(854, 80, 24, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#baff18'; ctx.fillRect(733, 454, 250, 8);
  });

  make('broadway', 512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#ffdb21'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f13c2d';
    ctx.beginPath(); ctx.moveTo(256, 52); ctx.lineTo(460, 512); ctx.lineTo(51, 512); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#17151d'; ctx.fillRect(26, 24, 460, 44);
    type(ctx, 'THE CITY IS YOUR STAGE', 256, 55, 23, '#ffef97', 800, 'center');
    type(ctx, 'BROAD', 256, 218, 108, '#17151d', 900, 'center');
    type(ctx, 'WAY', 256, 334, 149, '#17151d', 900, 'center');
    type(ctx, 'LIGHTS UP.', 256, 412, 45, '#fff6d3', 900, 'center');
    type(ctx, 'EVERY NIGHT', 256, 461, 26, '#17151d', 800, 'center');
    for (let i = 0; i < 12; i++) {
      ctx.fillStyle = '#fffce0'; ctx.beginPath(); ctx.arc(12 + i * 44, 493, 4, 0, Math.PI * 2); ctx.fill();
    }
  });

  make('wave', 1024, 512, (ctx, w, h) => {
    gradient(ctx, w, h, ['#0a0a52', '#2114ad', '#6605ed'], true);
    for (let i = 25; i >= 0; i--) {
      const t = i / 25;
      ctx.strokeStyle = `hsla(${171 + t * 65}, 100%, ${65 - t * 33}%, ${0.95 - t * 0.4})`;
      ctx.lineWidth = 13;
      ctx.beginPath();
      ctx.moveTo(-100, 375 + i * 7);
      ctx.bezierCurveTo(180, -250 + i * 12, 680, 770 - i * 8, 1120, 35 + i * 7);
      ctx.stroke();
    }
    type(ctx, 'FEEL', 42, 132, 128, '#f3fcff');
    type(ctx, 'EVERYTHING.', 42, 236, 94, '#f3fcff');
    type(ctx, 'A NEW FREQUENCY', 47, 462, 30, '#95ffef', 700);
    ctx.strokeStyle = '#95ffef'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(935, 447, 26, 0, Math.PI * 2); ctx.stroke();
  });

  make('fashion', 512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#f2ede1'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#df542e'; ctx.beginPath(); ctx.arc(357, 258, 160, 0, Math.PI * 2); ctx.fill();
    // A graphic coat silhouette, intentionally illustrative rather than a real campaign.
    ctx.fillStyle = '#17191c';
    ctx.beginPath(); ctx.ellipse(349, 145, 36, 45, -.12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(318, 181); ctx.lineTo(384, 183); ctx.lineTo(424, 253);
    ctx.lineTo(442, 367); ctx.lineTo(411, 379); ctx.lineTo(384, 285);
    ctx.lineTo(405, 475); ctx.lineTo(282, 475); ctx.lineTo(300, 271);
    ctx.lineTo(266, 370); ctx.lineTo(237, 359); ctx.lineTo(275, 242); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#aaa69f'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(318, 189); ctx.lineTo(345, 262); ctx.lineTo(380, 188);
    ctx.moveTo(345, 262); ctx.lineTo(341, 465); ctx.stroke();
    type(ctx, 'FORM', 24, 91, 96, '#17191c');
    type(ctx, 'NEW', 29, 235, 59, '#17191c');
    type(ctx, 'YORK', 28, 294, 59, '#17191c');
    type(ctx, 'IN MOTION', 28, 337, 24, '#17191c', 700);
    ctx.fillStyle = '#17191c'; ctx.fillRect(0, 480, w, 32);
    type(ctx, 'THE EVERYDAY, REIMAGINED', 256, 502, 17, '#f2ede1', 700, 'center');
  });

  make('garden', 512, 512, (ctx, w, h) => {
    gradient(ctx, w, h, ['#003e3c', '#00764b', '#032c2a']);
    const leaf = (x, y, scale, angle, color) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(scale, scale);
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-135, -50, -102, -173, 0, -230);
      ctx.bezierCurveTo(90, -160, 105, -54, 0, 0); ctx.fill();
      ctx.strokeStyle = 'rgba(232,255,123,.4)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -211); ctx.stroke(); ctx.restore();
    };
    leaf(38, 269, 1.3, -.65, '#0ba769');
    leaf(206, 241, .95, -.73, '#6acf45');
    leaf(420, 246, 1.2, .6, '#159259');
    leaf(504, 478, 1.5, -.28, '#1cc179');
    leaf(68, 588, 1.65, .58, '#10884a');
    ctx.fillStyle = 'rgba(0,31,25,.38)'; ctx.fillRect(0, 171, w, 192);
    type(ctx, 'BREATHE', 256, 259, 76, '#efffba', 900, 'center');
    type(ctx, 'A LITTLE DEEPER.', 256, 315, 34, '#efffba', 700, 'center');
    type(ctx, 'FIND YOUR GREEN', 256, 471, 25, '#e0ffae', 800, 'center');
  });

  make('sunset', 1024, 512, (ctx, w, h) => {
    gradient(ctx, w, h, ['#7e1aa8', '#f26480', '#ffb958']);
    ctx.fillStyle = '#ffed98'; ctx.beginPath(); ctx.arc(743, 260, 165, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#733098'; ctx.beginPath(); ctx.moveTo(0, 435); ctx.lineTo(160, 319);
    ctx.lineTo(312, 391); ctx.lineTo(510, 312); ctx.lineTo(657, 405); ctx.lineTo(857, 352);
    ctx.lineTo(1024, 415); ctx.lineTo(1024, 512); ctx.lineTo(0, 512); ctx.fill();
    ctx.fillStyle = '#261557'; ctx.beginPath(); ctx.moveTo(0, 443); ctx.lineTo(252, 424);
    ctx.lineTo(425, 465); ctx.lineTo(695, 410); ctx.lineTo(1024, 457);
    ctx.lineTo(1024, 512); ctx.lineTo(0, 512); ctx.fill();
    type(ctx, 'GO', 37, 239, 228, '#fff7d3');
    type(ctx, 'SOMEWHERE.', 44, 333, 83, '#fff7d3');
    type(ctx, 'MAKE ROOM FOR WONDER', 45, 478, 28, '#ffc98a', 800);
  });

  make('cola', 512, 512, (ctx, w, h) => {
    gradient(ctx, w, h, ['#ed122d', '#ec3035', '#bc0020']);
    ctx.save(); ctx.translate(256, 263); ctx.rotate(-.13);
    ctx.strokeStyle = '#ff797a'; ctx.lineWidth = 32;
    ctx.beginPath(); ctx.arc(0, 0, 211, 0, Math.PI * 2); ctx.stroke();
    type(ctx, 'POP!', 0, 36, 166, '#fff7e7', 900, 'center'); ctx.restore();
    type(ctx, 'BRIGHTEN', 256, 86, 43, '#fff7e7', 900, 'center');
    type(ctx, 'YOUR NIGHT', 256, 137, 43, '#fff7e7', 900, 'center');
    type(ctx, 'OPEN THE MOMENT', 256, 458, 29, '#fff7e7', 800, 'center');
    for (let i = 0; i < 12; i++) {
      const x = 20 + ((i * 137) % 476), y = 148 + ((i * 79) % 215);
      ctx.fillStyle = 'rgba(255,244,208,.62)'; ctx.beginPath(); ctx.arc(x, y, 3 + i % 5, 0, Math.PI * 2); ctx.fill();
    }
  });

  make('ticker', 1024, 128, (ctx, w, h) => {
    ctx.fillStyle = '#080d16'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fdb832'; ctx.fillRect(0, 0, w, 5); ctx.fillRect(0, h - 5, w, 5);
    type(ctx, 'NEW YORK  /  THE CITY NEVER SLEEPS', 28, 85, 48, '#ffc443', 800);
  });

  return result;
}
