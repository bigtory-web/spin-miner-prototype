const { Presentation, PresentationFile } = await import("@oai/artifact-tool");
const fs = await import("node:fs/promises");

const OUT_DIR = "outputs";
const PREVIEW_DIR = "tmp/slides/system_doc_previews";
await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(PREVIEW_DIR, { recursive: true });

const W = 1280;
const H = 720;
const p = Presentation.create({ slideSize: { width: W, height: H } });

const C = {
  bg: "#F7F7F4",
  text: "#1E2D4A",
  body: "#202020",
  sub: "#555555",
  line: "#9EA5AE",
  tableHead: "#D9EAD3",
  tableSub: "#EAF3E5",
  note: "#FFF2CC",
  gray: "#E5E5E5",
  gray2: "#F0F0F0",
  red: "#D73030",
  blue: "#D9EAF7",
  green: "#D9EAD3",
  orange: "#FCE5CD",
};

const FONT = "Malgun Gothic";

function shape(slide, x, y, w, h, fill = "none", stroke = C.line, geometry = "rect", width = 1) {
  return slide.shapes.add({
    geometry,
    position: { left: x, top: y, width: w, height: h },
    fill: fill === "none" ? "#00000000" : fill,
    line: stroke === "none" ? { fill: "#00000000", width: 0 } : { fill: stroke, width },
  });
}

function text(slide, x, y, value, size = 18, color = C.body, bold = false, w = 600, h = 40, align = "left") {
  const box = shape(slide, x, y, w, h, "none", "none");
  box.text = value;
  box.text.fontSize = size;
  box.text.typeface = FONT;
  box.text.color = color;
  box.text.bold = bold;
  box.text.alignment = align;
  box.text.verticalAlignment = "middle";
  box.text.insets = { left: 2, right: 2, top: 1, bottom: 1 };
  box.text.autoFit = "shrinkText";
  return box;
}

function slide(title) {
  const s = p.slides.add();
  s.background.fill = C.bg;
  text(s, 10, 12, title, 30, C.text, true, 900, 45);
  shape(s, 0, 62, W, 2, C.line, "none");
  return s;
}

function bullet(slide, x, y, lines, size = 17, gap = 29, w = 1080) {
  lines.forEach((line, i) => text(slide, x, y + i * gap, `- ${line}`, size, C.body, false, w, 26));
}

function section(slide, x, y, label, w = 1180) {
  text(slide, x, y, label, 18, C.body, true, w, 28);
}

function table(slide, x, y, rows, colW, rowH = 38, headerRows = 1) {
  rows.forEach((row, r) => {
    let cx = x;
    row.forEach((cell, c) => {
      const fill = r < headerRows ? C.tableHead : (r % 2 ? "#FFFFFF" : "#F2F2F2");
      shape(slide, cx, y + r * rowH, colW[c], rowH, fill, "#444444", "rect", 0.8);
      text(slide, cx + 6, y + r * rowH + 4, cell, r < headerRows ? 14 : 13, C.body, r < headerRows, colW[c] - 12, rowH - 8, c === 0 ? "left" : "center");
      cx += colW[c];
    });
  });
}

function wireBox(slide, x, y, w, h, label, fill = C.gray2) {
  shape(slide, x, y, w, h, fill, "#333333");
  text(slide, x + 6, y + h / 2 - 13, label, 15, C.body, true, w - 12, 26, "center");
}

function flow(slide, items, x, y, w, h) {
  const gap = 18;
  const bw = (w - gap * (items.length - 1)) / items.length;
  items.forEach((item, i) => {
    const bx = x + i * (bw + gap);
    wireBox(slide, bx, y, bw, h, item, i % 2 ? "#FFFFFF" : C.blue);
    if (i < items.length - 1) text(slide, bx + bw + 2, y + h / 2 - 14, ">", 20, C.body, true, gap, 28, "center");
  });
}

// 1
{
  const s = p.slides.add();
  s.background.fill = C.bg;
  text(s, 0, 304, "Spin Miner 대형 광물 브레이크 시스템", 42, C.text, true, W, 58, "center");
  text(s, 0, 370, "시스템 / 콘텐츠 / UIUX 기획 작업 문서", 22, C.sub, false, W, 34, "center");
}

// 2
{
  const s = slide("1. 개요");
  section(s, 10, 82, "1.1. 시스템 정의");
  bullet(s, 10, 118, [
    "대형 광물 채굴 중 약점이 노출되고, 약점 공략을 통해 일정 시간 브레이크 상태를 발생시키는 시스템",
    "브레이크 상태에서는 광물 전체가 취약해져 채굴 효율이 상승한다.",
    "약점은 추가 데미지 수단이 아니라 브레이크를 발생시키는 시동기 역할로 정의한다.",
  ]);
  section(s, 10, 232, "1.2. 적용 목적");
  bullet(s, 10, 268, [
    "대형 광물 앞에서 단순 대기성 타격이 반복되는 구간에 조작 목적을 부여한다.",
    "약점 노출, 약점 공략, 브레이크 보상 구간을 분리해 플레이 리듬을 만든다.",
    "대형 광물 앞에서 플레이어가 위치와 타격 대상을 의식하도록 만든다.",
  ]);
  section(s, 10, 408, "1.3. 기대 효과");
  bullet(s, 10, 444, [
    "대형 광물을 오래 때리는 대상이 아니라 공략 대상처럼 인식하게 한다.",
    "브레이크 타이밍을 통해 짧은 보상 구간을 제공한다.",
    "대형 광물의 긴 체류 시간을 공략 단계로 분해한다.",
  ]);
  section(s, 10, 552, "1.4. 참고 링크");
  bullet(s, 10, 588, [
    "GitHub 저장소: https://github.com/bigtory-web/spin-miner-prototype",
    "플레이 링크: https://bigtory-web.github.io/spin-miner-prototype/",
  ], 15, 25);
}

// 3
{
  const s = slide("2. 용어 정의");
  table(s, 20, 96, [
    ["용어", "정의", "기획상 역할"],
    ["약점", "장시간 체류하는 광물 타격 누적 후 외곽선 근처에 등장하는 공략 포인트", "브레이크를 발생시키기 위한 시동기"],
    ["브레이크", "약점 공략이 완료되면 일정 시간 발생하는 광물 취약 상태", "긴 체류 구간 중간에 리듬 변화를 주는 보상 구간"],
    ["균열 진행도", "약점 타격으로 누적되는 브레이크 발생 진행값", "약점 공략의 누적 피드백"],
    ["브레이크 적용 광물", "일반 채굴 대상이 아니라 브레이크 규칙을 적용받는 광물", "장시간 체류 구간에 리듬 변화를 부여할 대상"],
  ], [190, 560, 470], 62);
  shape(s, 20, 524, 1140, 76, C.note, "#C8A600");
  text(s, 36, 544, "작성 기준", 17, C.body, true, 140, 24);
  text(s, 150, 544, "본 문서는 프로토타입 전체 규칙이 아니라 대형 광물 브레이크 시스템의 적용 조건, 상태, 연출 피드백을 정의하는 문서다.", 16, C.body, false, 980, 28);
}

// 4
{
  const s = slide("3. 기존 플레이 관찰 및 설계 방향");
  section(s, 10, 84, "3.1. 관찰 내용");
  table(s, 10, 122, [
    ["구분", "관찰", "기획 해석"],
    ["소형 광물", "이동-타격-수집 주기가 짧음", "짧은 반복으로 플레이 리듬이 빠르게 유지됨"],
    ["장기 체류 광물", "HP가 높아 같은 타격이 오래 반복됨", "목표감은 있으나 조작 선택지가 부족할 수 있음"],
    ["브레이크 적용 대상", "특정 광물만 별도 공략 대상으로 지정 가능", "모든 광물이 아니라 긴 체류 광물에만 보조 규칙 적용"],
  ], [160, 450, 610], 48);
  section(s, 10, 322, "3.2. 설계 방향");
  bullet(s, 10, 360, [
    "장시간 체류하는 광물의 긴 채굴 시간을 단순 HP 증가가 아닌 단계형 공략 구조로 전환한다.",
    "약점 노출 전후, 브레이크 전후의 피드백을 명확히 분리한다.",
    "데미지는 곡괭이 기본 성능을 기준으로 고정하고, 브레이크는 보상 배율로만 처리한다.",
  ]);
  shape(s, 10, 500, 1180, 92, C.note, "#C8A600");
  text(s, 26, 520, "문서 표현 기준", 17, C.body, true, 180, 24);
  text(s, 26, 552, "본 문서는 원작 개선 완료 보고가 아니라, 라이브 게임 관찰을 기반으로 한 시스템 제안 및 프로토타입 검증 문서로 작성한다.", 17, C.body, false, 1120, 28);
}

// 5
{
  const s = slide("4. 브레이크 시스템 기본 플로우");
  flow(s, ["장기 체류 광물 접근", "몸통 타격", "약점 노출", "약점 공략", "브레이크", "일반 상태 복귀"], 24, 104, 1210, 70);
  section(s, 10, 222, "4.1. 기본 플로우");
  bullet(s, 10, 258, [
    "플레이어는 WASD 또는 드래그로 이동하며, 회전 곡괭이가 광물과 접촉하면 타격한다.",
    "브레이크 적용 분류로 지정된 광물은 타격 누적 후 약점이 등장한다.",
    "약점 타격 누적으로 브레이크 상태에 진입한다.",
    "브레이크 시간이 종료되면 약점은 숨겨지고 일반 타격 상태로 복귀한다.",
    "프로토타입 전체 진행 조건은 본 문서의 설명 범위에서 제외한다.",
  ], 17, 30);
  section(s, 10, 448, "4.2. 적용 범위");
  bullet(s, 10, 484, [
    "광물 데이터에서 브레이크 적용 여부를 제어한다.",
    "브레이크 적용 대상이 아닌 광물은 기존 채굴 처리만 유지한다.",
    "원작의 실제 진행/보상 규칙과는 분리해 작성한다.",
  ]);
}

// 6
{
  const s = slide("5. 브레이크 시스템 상세 플로우");
  flow(s, ["일반 타격", "약점 등장 조건 충족", "약점 즉시 등장", "약점 반복 타격", "브레이크 발생", "일반 상태 복귀"], 30, 104, 1180, 76);
  table(s, 20, 230, [
    ["단계", "조건", "표현", "결과"],
    ["일반 타격", "광물 몸통에 곡괭이 접촉", "광물 피격 스케일 연출", "HP 감소 / 약점 노출 카운트 증가"],
    ["약점 노출", "노출 조건 충족", "외곽선 근처에 X 마크 즉시 등장", "약점 타격 가능 상태"],
    ["약점 공략", "곡괭이가 약점 판정 반경 접촉", "약점 마크 피격 연출 / 크기 증가", "균열 진행도 증가"],
    ["브레이크", "균열 100%", "광물 외곽 라인 확산 후 복귀", "일정 시간 피해 배율 적용"],
    ["복귀", "브레이크 시간 종료", "약점 숨김", "일반 상태로 복귀"],
  ], [145, 305, 405, 330], 58);
}

// 7
{
  const s = slide("6. 약점 규칙");
  table(s, 20, 96, [
    ["항목", "값", "설명"],
    ["약점 노출 조건", "몸통 타격 120회", "약 2초 내외. 프레임이 아니라 실제 타격 횟수 기준"],
    ["약점 판정 반경", "17px", "곡괭이가 약점에 닿았는지 판단하는 반경"],
    ["약점 진행 증가", "1타당 +1.25%", "80회 약점 타격 시 브레이크"],
    ["약점 이동 주기", "6.5초", "같은 위치 고정 피로도를 줄이기 위한 이동 주기"],
    ["브레이크 중 약점", "비노출", "약점은 브레이크 시동기이므로 브레이크 중에는 숨김"],
  ], [230, 260, 720], 54);
  section(s, 20, 430, "6.1. 약점 위치 규칙");
  bullet(s, 20, 466, [
    "약점은 광물 외곽선 근처에 생성한다.",
    "플레이어가 타격한 방향 주변에 생성하되, 정확히 같은 위치에는 생성하지 않는다.",
    "캐릭터가 접근 불가능한 중심부나 광물 안쪽 깊은 위치에는 생성하지 않는다.",
  ]);
}

// 8
{
  const s = slide("7. 데미지 / 적용 기준");
  table(s, 20, 96, [
    ["항목", "값", "의도"],
    ["기본 타격 데미지", "9.2", "곡괭이 자체 데미지. 광물 크기와 무관하게 동일"],
    ["브레이크 데미지", "9.2 x 1.8 = 16.56", "공략 성공 후 보상 구간 체감"],
    ["적용 분류", "BreakGroup", "장기 체류 광물에만 약점/브레이크 연출 적용"],
    ["일반 분류", "Normal", "기존 채굴 처리만 유지"],
    ["광물 HP", "별도 광물 데이터 사용", "프로토타입 검증 수치는 문서 기준값에서 제외"],
    ["적용 조건", "상대적 장기 체류", "현재 기대 채굴 성능 대비 체류 시간이 길 때 적용"],
  ], [230, 310, 680], 52);
  shape(s, 20, 500, 1150, 80, C.note, "#C8A600");
  text(s, 36, 520, "밸런스 기준", 17, C.body, true, 180, 24);
  text(s, 36, 550, "광물 크기에 따라 기본 데미지를 퍼센트로 바꾸지 않는다. 곡괭이의 기본 성능은 항상 9.2이며, 브레이크는 현재 기대 채굴 성능 대비 장기 체류가 발생하는 광물에만 별도 보상 배율로 처리한다.", 16, C.body, false, 1080, 26);
}

// 9
{
  const s = slide("8. UI / UX 상태 정의");
  wireBox(s, 20, 96, 590, 300, "게임 화면 캡처 교체 영역", "#FFFFFF");
  table(s, 650, 96, [
    ["No.", "요소", "설명"],
    ["1", "광물 HP", "대형 광물은 HP 텍스트를 크게 표시"],
    ["2", "약점 마크", "조건 충족 시 즉시 등장. 서서히 페이드인 금지"],
    ["3", "브레이크 외곽선", "광물 외곽과 같은 형태로 확산 후 복귀"],
    ["4", "약점 피격 피드백", "약점 타격 시 즉시 반응해 명중 여부 전달"],
    ["5", "광물 피격 피드백", "광물 본체가 순간적으로 작아졌다 복귀"],
  ], [70, 170, 360], 48);
  section(s, 20, 430, "8.1. UX 기준");
  bullet(s, 20, 466, [
    "약점이 등장했는지, 약점을 맞췄는지, 브레이크 상태인지 각각 다른 피드백으로 구분한다.",
    "브레이크 남은 시간은 하단 게이지가 아니라 광물 외곽선 연출로 표현한다.",
  ]);
}

// 10
{
  const s = slide("9. 피드백 / 연출 규칙");
  table(s, 20, 96, [
    ["구분", "발생 조건", "연출"],
    ["광물 피격", "곡괭이가 광물에 접촉", "광물 본체가 순간적으로 작아졌다 복귀"],
    ["약점 피격", "곡괭이가 약점 판정 반경 접촉", "약점 마크가 순간적으로 반응하고 누적 크기 증가"],
    ["브레이크 진입", "약점 진행도 100%", "광물 외곽선과 동일한 형태의 라인 확산"],
    ["브레이크 잔여 시간", "브레이크 유지 중", "확산된 외곽선이 서서히 광물 테두리로 복귀"],
    ["브레이크 종료", "브레이크 지속 시간 종료", "약점 숨김 / 일반 상태 복귀"],
  ], [210, 330, 660], 58);
  shape(s, 20, 506, 1150, 72, C.note, "#C8A600");
  text(s, 36, 526, "주의", 17, C.body, true, 100, 24);
  text(s, 120, 526, "피격 스케일 연출 시 광선/이펙트 전체가 같이 흔들리지 않도록 광물 본체와 이펙트 스케일을 분리한다.", 16, C.body, false, 1030, 28);
}

// 11
{
  const s = slide("10. 광물 배치 / 레벨 규칙");
  section(s, 20, 92, "10.1. 배치 규칙");
  bullet(s, 20, 128, [
    "광물 간 겹침을 방지하기 위해 생성 후 위치 보정 처리를 진행한다.",
    "대형 광물은 챕터의 메인 목표로 인식될 수 있도록 화면 중상단 주요 영역에 배치한다.",
    "플레이어 시작 위치와 광물 사이에 최소 이동 공간을 확보한다.",
  ]);
  section(s, 20, 270, "10.2. 광물 역할군");
  table(s, 20, 310, [
    ["역할군", "역할", "설계 방향"],
    ["단기 체류 광물", "짧은 반복 채굴", "빠른 수집 리듬 유지"],
    ["일반 광물", "기본 채굴 대상", "약점/브레이크 연출 미적용"],
    ["장기 체류 광물", "공략 대상 광물", "약점 노출과 브레이크 연출 적용"],
    ["특수 광물", "확장 대상", "필요 시 별도 규칙이나 연출 추가"],
  ], [180, 360, 620], 54);
}

// 12
{
  const s = slide("11. 데이터 테이블 초안");
  table(s, 20, 94, [
    ["Table_BreakMiningConfig", "", "", ""],
    ["key", "type", "value", "description"],
    ["base_damage", "Float", "9.2", "곡괭이 기본 데미지"],
    ["break_damage_multiplier", "Float", "1.8", "브레이크 중 데미지 배율"],
    ["weak_reveal_hits", "Int", "120", "약점 노출까지 필요한 몸통 타격 수"],
    ["weak_break_gain", "Float", "1.25", "약점 1타당 진행도 증가율"],
    ["break_duration_frame", "Int", "300", "브레이크 지속 프레임"],
  ], [310, 180, 180, 500], 38, 2);
  table(s, 20, 410, [
    ["Table_MineralBreakGroup", "", "", ""],
    ["group", "type", "description", "effect"],
    ["Normal", "Int", "브레이크 미적용 광물", "기존 채굴 처리"],
    ["Breakable", "Int", "장기 체류로 인해 브레이크 규칙을 적용하는 광물", "약점 + 브레이크 외곽선 연출"],
  ], [310, 180, 330, 350], 38, 2);
}

// 13
{
  const s = slide("12. 예외 처리 / QA 체크");
  table(s, 20, 96, [
    ["항목", "상황", "처리"],
    ["약점 접근 불가", "약점이 광물 안쪽 또는 캐릭터가 닿지 않는 위치에 생성", "외곽선 근처로 보정"],
    ["약점 과다 이동", "약점 위치가 너무 자주 바뀌어 피로함", "6.5초 이동 주기 유지"],
    ["브레이크 중 약점 노출", "브레이크 중에도 약점이 보임", "브레이크 중 약점 숨김"],
    ["비대상 광물 연출 발생", "일반 광물에 약점/브레이크 연출이 표시됨", "BreakGroup 데이터 확인"],
    ["광물 겹침", "스폰 시 광물이 서로 겹침", "스폰 후 배치 보정"],
    ["연출 과다", "피격 스케일/외곽선이 과하게 흔들림", "피격 스케일과 브레이크 라인 스케일 분리"],
  ], [210, 430, 540], 58);
}

// 14
{
  const s = slide("13. 원작 시점 적용 시 고려사항");
  section(s, 20, 92, "13.1. 시점 차이");
  bullet(s, 20, 128, [
    "현재 프로토타입은 탑뷰 검증용이며, 실제 게임은 아이소메트릭 시점이다.",
    "따라서 약점 마크와 브레이크 라인은 최종 적용 시 원작 시점에 맞게 재해석해야 한다.",
  ]);
  section(s, 20, 242, "13.2. V2 연출 방향");
  table(s, 20, 282, [
    ["구분", "프로토타입 표현", "원작 적용 방향"],
    ["약점", "X 마크", "광물 표면 균열 / 발광 / 파편으로 자연화"],
    ["브레이크", "외곽선 확산", "표면 발광, 파편, 카메라/타격 피드백 중심"],
    ["피격 반응", "본체 스케일 연출", "광물 표면 충격, 파편, 사운드와 연계"],
    ["적용 분류", "프로토타입 조건 분기", "광물 데이터의 적용 분류 값 기반으로 연출 대상 지정"],
  ], [180, 400, 600], 54);
}

// 15
{
  const s = slide("14. 정리");
  section(s, 20, 96, "14.1. 핵심 설계");
  bullet(s, 20, 132, [
    "장기 체류 광물 구간에 약점 노출 → 약점 공략 → 브레이크 → 보상 채굴의 단계 구조를 추가한다.",
    "기본 데미지는 곡괭이 성능으로 고정하고, 브레이크는 성공 보상 배율로만 처리한다.",
    "적용 대상은 광물 데이터의 분류 값으로 관리해 원작의 다른 규칙과 분리한다.",
  ]);
  section(s, 20, 284, "14.2. 포트폴리오 내 역할");
  bullet(s, 20, 320, [
    "라이브 게임 관찰 기반 시스템 제안 문서",
    "플레이 가능한 프로토타입을 통한 규칙/수치 검증 사례",
    "시스템, 콘텐츠, UIUX, 레벨 배치 관점의 작업 문서",
  ]);
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
await pptx.save(`${OUT_DIR}/spin-miner-system-planning-doc-v2.pptx`);
