const { Presentation, PresentationFile } = await import("@oai/artifact-tool");
const fs = await import("node:fs/promises");

const OUT_DIR = "outputs";
const PREVIEW_DIR = "tmp/slides/previews";
await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(PREVIEW_DIR, { recursive: true });

const W = 1280;
const H = 720;
const p = Presentation.create({ slideSize: { width: W, height: H } });

const C = {
  bg: "#080D1B",
  band: "#101A31",
  panel: "#131D35",
  panel2: "#1A2746",
  panel3: "#22345F",
  line: "#3D5D98",
  text: "#F6F8FF",
  sub: "#B4C2E4",
  muted: "#7182AA",
  blue: "#63D8FF",
  yellow: "#FFE36A",
  orange: "#FF9B4A",
  green: "#61E38B",
  red: "#FF6577",
  ink: "#050815",
};

const FONT = "Malgun Gothic";

function shape(slide, x, y, w, h, fill = C.panel, stroke = C.line, geometry = "rect", width = 1.2, style = "solid") {
  return slide.shapes.add({
    geometry,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: stroke === "none" ? { fill: "#00000000", width: 0 } : { fill: stroke, width, style },
  });
}

function write(slide, x, y, body, size = 22, color = C.text, bold = false, w = 600, h = 60, align = "left") {
  const t = shape(slide, x, y, w, h, "#00000000", "none");
  t.text = body;
  t.text.fontSize = size;
  t.text.typeface = FONT;
  t.text.color = color;
  t.text.bold = bold;
  t.text.alignment = align;
  t.text.verticalAlignment = "middle";
  t.text.insets = { left: 4, right: 4, top: 2, bottom: 2 };
  t.text.autoFit = "shrinkText";
  return t;
}

function divider(slide, x, y, w, color = C.line) {
  shape(slide, x, y, w, 2, color, "none");
}

function makeSlide(title, section) {
  const s = p.slides.add();
  s.background.fill = C.bg;
  shape(s, 0, 0, W, 64, C.band, "none");
  write(s, 44, 18, section, 18, C.blue, true, 780, 28);
  write(s, 44, 82, title, 35, C.text, true, 940, 48);
  divider(s, 44, 134, 1192);
  return s;
}

function card(slide, x, y, w, h, title, body, accent = C.blue) {
  shape(slide, x, y, w, h, C.panel, C.line);
  shape(slide, x, y, 7, h, accent, "none");
  write(slide, x + 22, y + 18, title, 21, C.text, true, w - 42, 30);
  write(slide, x + 22, y + 58, body, 16, C.sub, false, w - 42, h - 68);
}

function placeholder(slide, x, y, w, h, title, note) {
  shape(slide, x, y, w, h, "#0C1328", C.muted, "rect", 2, "dashed");
  write(slide, x + 24, y + h / 2 - 38, title, 27, C.yellow, true, w - 48, 42, "center");
  write(slide, x + 34, y + h / 2 + 8, note, 15, C.sub, false, w - 68, 58, "center");
}

function tag(slide, x, y, label, color = C.blue, w = 140) {
  shape(slide, x, y, w, 38, C.panel2, color, "roundRect", 1.2);
  write(slide, x, y + 5, label, 15, color, true, w, 24, "center");
}

function flow(slide, items, x, y, w, h) {
  const gap = 18;
  const bw = (w - gap * (items.length - 1)) / items.length;
  items.forEach((item, i) => {
    const bx = x + i * (bw + gap);
    shape(slide, bx, y, bw, h, i % 2 ? C.panel : C.panel2, C.line);
    write(slide, bx + 10, y + 14, item, 17, C.text, true, bw - 20, h - 24, "center");
    if (i < items.length - 1) write(slide, bx + bw - 2, y + h / 2 - 14, ">", 22, C.yellow, true, gap + 8, 28, "center");
  });
}

function table(slide, x, y, rows, colW, rowH = 48) {
  rows.forEach((row, r) => {
    let cx = x;
    row.forEach((cell, c) => {
      const fill = r === 0 ? C.panel3 : r % 2 ? "#0F182D" : C.panel;
      shape(slide, cx, y + r * rowH, colW[c], rowH, fill, C.line);
      write(slide, cx + 12, y + r * rowH + 8, cell, r === 0 ? 16 : 15, r === 0 ? C.text : C.sub, r === 0, colW[c] - 24, rowH - 14, c === 0 ? "left" : "center");
      cx += colW[c];
    });
  });
}

function note(slide, x, y, body, color = C.yellow) {
  shape(slide, x, y, 8, 86, color, "none");
  write(slide, x + 24, y + 10, body, 22, C.text, true, 990, 66);
}

// 1. Cover
{
  const s = p.slides.add();
  s.background.fill = C.bg;
  shape(s, 74, 68, 1132, 584, "#111A31", C.line);
  write(s, 112, 126, "Spin Miner", 62, C.text, true, 620, 76);
  write(s, 116, 204, "대형 광물 브레이크 시스템 제안형 프로토타입", 30, C.yellow, true, 820, 46);
  write(s, 116, 286, "라이브 게임 관찰을 바탕으로 대형 광물 구간의 조작 목적과 보상감을 설계하고, 플레이 가능한 Canvas 프로토타입으로 검증한 포트폴리오", 22, C.sub, false, 760, 110);
  placeholder(s, 826, 132, 324, 360, "대표 이미지 교체 영역", "게임 캡처 / 프로토타입 핵심 장면");
  tag(s, 116, 542, "문제 정의", C.blue, 130);
  tag(s, 266, 542, "시스템 설계", C.yellow, 150);
  tag(s, 436, 542, "프로토타입 검증", C.green, 170);
}

// 2. Positioning
{
  const s = makeSlide("프로젝트 포지셔닝", "01. Project Positioning");
  card(s, 68, 172, 350, 360, "목표", "원작을 고쳤다고 주장하기보다, 플레이 경험에서 발견한 긴장 저하 구간을 바탕으로 개선 가설을 세우고 직접 조작 가능한 형태로 검증한다.", C.blue);
  card(s, 466, 172, 350, 360, "지원 직무와 연결", "콘텐츠/시스템 기획 관점에서 채굴 리듬, 보상 루프, 성장 체감, UI 피드백을 규칙과 수치로 정리한다.", C.yellow);
  card(s, 864, 172, 350, 360, "작업 방식", "AI를 활용해 아이디어 정리, 코드 구현, 반복 테스트, 문서화를 빠르게 순환하며 실제 플레이 가능한 산출물로 만든다.", C.green);
}

// 3. Observation
{
  const s = makeSlide("원작 플레이 루프 관찰", "02. Original Loop Observation");
  placeholder(s, 70, 166, 430, 340, "원작 캡처 교체 영역", "400B 대형 광물 화면");
  flow(s, ["이동", "채굴", "광석 수집", "카고 적재", "BASE 판매", "성장"], 536, 196, 672, 88);
  card(s, 536, 330, 312, 178, "작은 광물", "이동과 채굴, 수집이 짧은 간격으로 반복되어 리듬감이 빠르다.", C.green);
  card(s, 880, 330, 328, 178, "대형 광물", "숫자와 크기는 목표감을 주지만, 오래 때리는 동안 플레이어 선택지가 줄어들 수 있다.", C.orange);
}

// 4. Problem
{
  const s = makeSlide("문제 정의", "03. Problem Definition");
  note(s, 76, 166, "대형 광물 구간의 문제는 '긴 파괴 시간' 자체보다, 그 시간 동안 플레이어가 계속 개입해야 할 이유가 약해지는 지점이다.");
  card(s, 82, 326, 336, 196, "관찰 1", "작은 광물은 이동, 타격, 수집이 빠르게 이어져 손이 계속 바쁘다.", C.green);
  card(s, 472, 326, 336, 196, "관찰 2", "대형 광물은 HP가 크지만 타격 방식이 단조로우면 기다리는 느낌이 생긴다.", C.orange);
  card(s, 862, 326, 336, 196, "설계 과제", "대형 광물 앞에서도 위치 조정, 타이밍, 보상 기대가 살아 있어야 한다.", C.blue);
}

// 5. Hypothesis
{
  const s = makeSlide("개선 가설", "04. Hypothesis");
  flow(s, ["일반 타격", "약점 노출", "약점 공략", "BREAK", "채굴 효율 상승"], 86, 178, 1108, 92);
  placeholder(s, 84, 326, 340, 250, "약점 노출 캡처", "약점이 팍 등장하는 장면");
  placeholder(s, 470, 326, 340, 250, "BREAK 캡처", "광물 외곽선 연출 장면");
  card(s, 858, 326, 330, 250, "가설", "대형 광물을 오래 때리는 대상이 아니라, 약점을 열고 BREAK 상태를 유도하는 공략 대상으로 바꾸면 개입감과 보상감이 살아난다.", C.yellow);
}

// 6. Scope
{
  const s = makeSlide("V1 프로토타입 범위", "05. Prototype Scope");
  placeholder(s, 72, 166, 470, 330, "프로토타입 전체 화면", "현재 Canvas 테스트 화면");
  card(s, 592, 166, 286, 150, "검증 대상", "약점 노출\n약점 타격\nBREAK 전환\n광석 드랍/수집\n카고 적재", C.blue);
  card(s, 912, 166, 286, 150, "제외한 것", "원작 시점 재현\n상점/경제 전체\n정식 아트 리소스\n장기 성장 밸런스", C.muted);
  note(s, 592, 374, "탑뷰 프로토타입은 최종 시점 재현물이 아니라, 시스템 리듬과 규칙을 빠르게 확인하기 위한 검증 환경으로 둔다.", C.yellow);
}

// 7. Rules
{
  const s = makeSlide("브레이크 시스템 규칙", "06. System Rules");
  table(s, 70, 166, [
    ["단계", "조건", "결과"],
    ["약점 노출", "대형 광물 몸통 타격 누적", "타격 방향 주변에 약점 마크 등장"],
    ["약점 공략", "약점 마크 반복 타격", "마크가 커지며 균열 진행"],
    ["BREAK", "균열 100%", "일정 시간 채굴 효율 상승"],
    ["복귀", "BREAK 시간 종료", "약점 숨김, 일반 상태로 복귀"],
  ], [170, 430, 500], 56);
  card(s, 70, 502, 1060, 92, "설계 기준", "약점은 추가 피해 버튼이 아니라 BREAK를 여는 시동기다. BREAK 중에는 광물 전체가 취약해지고, 플레이어는 그 시간을 보상 구간으로 체감한다.", C.green);
}

// 8. Reward loop
{
  const s = makeSlide("광석 수집 / 카고 루프", "07. Reward Loop");
  flow(s, ["광물 파괴", "광석 드랍", "직접 수집", "카고 적재", "BASE 판매"], 92, 174, 1096, 88);
  placeholder(s, 86, 318, 500, 250, "광석 드랍 캡처", "광물 주변에 광석이 떨어지는 장면");
  card(s, 640, 318, 248, 250, "수집 방식", "파괴 즉시 보상이 들어오지 않고, 떨어진 광석을 직접 주워 카고에 적재한다.", C.blue);
  card(s, 922, 318, 248, 250, "보상감", "큰 광물일수록 더 많은 조각이 떨어져 목표를 깼다는 체감을 만든다.", C.yellow);
}

// 9. Balance
{
  const s = makeSlide("밸런스 설계 기준", "08. Balance Design");
  table(s, 70, 164, [
    ["항목", "현재값", "설계 의도"],
    ["기본 타격 피해", "9.2", "곡괭이 자체 성능은 광물 크기와 무관하게 고정"],
    ["BREAK 피해 배율", "1.8x", "공략 성공 후 보상 구간을 체감"],
    ["약점 진행", "+1.25%", "약점 80타로 BREAK, 너무 짧지 않은 호흡"],
    ["카고", "100", "수집과 판매 루프를 분리해 목표감 강화"],
    ["광물 HP", "대폭 상향", "대형 광물이 시스템을 보여줄 시간을 확보"],
  ], [220, 210, 660], 56);
}

// 10. Iteration
{
  const s = makeSlide("테스트하면서 조정한 항목", "09. Iteration Log");
  card(s, 74, 170, 330, 170, "약점 위치", "중앙부에서 외곽선 근처로 이동. 타격 위치 주변이지만 완전히 동일하지 않게 조정.", C.blue);
  card(s, 474, 170, 330, 170, "BREAK 연출", "하단 게이지 제거. 광물 외곽선이 퍼졌다가 돌아오는 방식으로 남은 시간을 표현.", C.yellow);
  card(s, 874, 170, 330, 170, "피해 체계", "광물별 퍼센트 피해 제거. 기본 피해 고정 + BREAK 배율 구조로 정리.", C.green);
  card(s, 74, 390, 330, 170, "HP/보상", "고정 피해 기준에 맞춰 HP를 상향하고 광석 드랍량을 등급별로 차등화.", C.orange);
  card(s, 474, 390, 330, 170, "카고 루프", "즉시 보상이 아니라 직접 수집 방식으로 바꿔 이동 목적을 강화.", C.blue);
  card(s, 874, 390, 330, 170, "피드백", "광물 피격, 약점 피격, BREAK 상태를 서로 다른 시각 피드백으로 분리.", C.yellow);
}

// 11. V2
{
  const s = makeSlide("실제 원작 시점 적용 시 고려사항", "10. V2 Direction");
  placeholder(s, 70, 170, 500, 340, "V2 적용 예시 이미지", "추후 원작 시점 목업으로 교체");
  card(s, 620, 170, 250, 160, "약점 표현", "마크 UI보다 광물 표면 균열, 발광, 파편으로 자연스럽게 표현.", C.blue);
  card(s, 910, 170, 250, 160, "BREAK 표현", "외곽선보다 표면 발광, 파편, 카메라 피드백 중심으로 전환.", C.yellow);
  card(s, 620, 370, 250, 160, "파편 방향", "아이소메트릭 시점에 맞춰 떨어지는 방향감과 수집 동선을 설계.", C.green);
  card(s, 910, 370, 250, 160, "모바일 UI", "카고와 목표 정보는 플레이 시선 근처에 배치하되 화면을 가리지 않게 조정.", C.orange);
}

// 12. Summary
{
  const s = makeSlide("결과와 향후 과제", "11. Summary");
  write(s, 76, 162, "이번 프로토타입에서 검증한 것", 28, C.text, true, 600, 42);
  flow(s, ["대형 광물 공략", "BREAK 보상", "광석 수집", "카고 루프"], 76, 230, 850, 86);
  card(s, 76, 360, 380, 190, "결과", "대형 광물 구간에 약점 공략과 BREAK 보상 타이밍을 부여해, 플레이어가 계속 개입할 이유를 만든다.", C.green);
  card(s, 504, 360, 380, 190, "향후 과제", "원작 시점에 맞는 연출 목업, 업그레이드 경제 밸런스, 모바일 UI 정리.", C.yellow);
  placeholder(s, 934, 190, 250, 360, "QR / 링크 영역", "GitHub Pages 또는 플레이 링크");
}

for (let i = 0; i < p.slides.count; i++) {
  const s = p.slides.getItem(i);
  try {
    const png = await p.export({ slide: s, format: "png", scale: 1 });
    const bytes = Buffer.from(await png.arrayBuffer());
    await fs.writeFile(`${PREVIEW_DIR}/slide-${String(i + 1).padStart(2, "0")}.png`, bytes);
  } catch (error) {
    await fs.writeFile(`${PREVIEW_DIR}/slide-${String(i + 1).padStart(2, "0")}.txt`, String(error));
  }
}

const pptx = await PresentationFile.exportPptx(p);
await pptx.save(`${OUT_DIR}/spin-miner-portfolio-draft.pptx`);
