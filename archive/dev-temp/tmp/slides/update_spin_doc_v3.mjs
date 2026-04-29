const { FileBlob, PresentationFile } = await import("@oai/artifact-tool");

const INPUT = "outputs/spin-miner-system-planning-doc-v2.pptx";
const OUTPUT = "outputs/spin-miner-system-planning-doc-v3.pptx";

const pptx = await FileBlob.load(INPUT);
const pres = await PresentationFile.importPptx(pptx);

const updates = [
  [1, 3, "- 브레이크 적용 광물 채굴 중에 약점이 노출되고, 약점 공략을 통해 일정 시간 브레이크 상태를 발생시키는 시스템"],
  [1, 7, "- 브레이크 적용 광물 앞에서 대기하며 타격이 반복되는 구간에 조작 목적을 부여한다."],
  [1, 9, "- 브레이크 적용 광물 앞에서 플레이어가 위치와 타격 대상을 의식하도록 만든다."],
  [1, 11, "- 브레이크 적용 광물을 오래 때리는 대상이 아니라 공략 대상처럼 인식하게 한다."],
  [1, 13, "- 브레이크 적용 광물의 체류 시간을 공략 단계로 분해한다."],

  [2, 11, "브레이크 적용 광물을 타격하면 해당 광물 근처에 등장하는 공략 포인트"],
  [2, 21, "브레이크 적용 광물"],
  [2, 23, "브레이크 규칙을 적용받는 광물\n현재 기대 채굴 성능 대비 상대적 장기 체류가 발생할 경우 브레이크 적용 광물로 분류한다."],

  [3, 22, "- 브레이크 적용 광물은 긴 채굴 시간이 필요하지만 높은 보상을 제공하는 목적성이 있다."],
  [3, 26, "브레이크 적용 광물"],

  [4, 3, "브레이크 적용 광물 타격"],
  [4, 17, "1. 브레이크 적용 광물을 일정 이상 타격하면 약점 포인트가 등장한다."],

  [6, 1, "6. 약점 규칙 / 설정값"],

  [9, 0, "10. 데이터 키 초안"],
  [9, 3, "BreakMiningConfig (규칙값 매핑)"],
  [9, 59, "MineralBreakGroup (적용 분류)"],
  [9, 87, "상대적 장기 체류가 발생해 브레이크 규칙을 적용하는 광물"],
];

for (const [slideIndex, shapeIndex, value] of updates) {
  const slide = pres.slides.getItem(slideIndex);
  const shape = slide.shapes.items[shapeIndex];
  if (!shape?.text) continue;
  shape.text.set(value);
}

const out = await PresentationFile.exportPptx(pres);
await out.save(OUTPUT);
