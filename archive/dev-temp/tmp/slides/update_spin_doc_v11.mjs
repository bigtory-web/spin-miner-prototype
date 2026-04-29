const { FileBlob, PresentationFile } = await import("@oai/artifact-tool");

const INPUT = "outputs/spin-miner-system-planning-doc-v10.pptx";
const OUTPUT = "outputs/spin-miner-system-planning-doc-v11.pptx";

const pptx = await FileBlob.load(INPUT);
const pres = await PresentationFile.importPptx(pptx);

const updates = [
  [1, 4, "- 브레이크 상태에서는 피해량이 증가해 채굴 효율이 상승한다."],
  [1, 9, "- 대형 광물 앞에서 플레이어가 위치 조정과 타격 대상을 의식하도록 만든다."],
  [1, 15, "- 프로토타입 플레이 링크: https://bigtory-web.github.io/spin-miner-prototype/"],

  [2, 17, "약점을 일정 횟수 타격하면 일정 시간 발생하는 취약 상태"],
  [2, 25, "광물 타입 enum으로 연출 및 규칙 적용 여부 결정"],

  [3, 23, "- 상대적으로 긴 채굴 구간은 브레이크 시스템을 통해 공략 단계로 분리하고, 반복 체감을 완화한다."],

  [4, 17, "1. 대형 광물을 일정 횟수 타격하면 약점이 등장한다."],
  [4, 18, "2. 약점을 일정 횟수 타격하면 브레이크 상태에 진입한다."],
  [4, 19, "3. 약점은 숨겨지고 브레이크 상태가 되면 높은 배율의 피해를 입힌다."],

  [5, 37, "외곽선 근처에 약점 등장"],
  [5, 45, "약점 피격 연출 / 크기 증가"],
  [5, 47, "브레이크 조건 누적"],
  [5, 51, "약점 타격 횟수 충족"],

  [6, 18, "25px"],
  [6, 22, "브레이크 조건"],
  [6, 24, "약점 타격 80회"],
  [6, 26, "실제 약점 타격 횟수 기준"],
  [6, 32, "한 위치 고정 공략 패턴을 완화하기 위한 장치"],
  [6, 34, "약점 비노출 조건"],
  [6, 36, "브레이크 중 / 남은 HP 하한 비율 이하"],
  [6, 38, "브레이크 중에는 숨기고, 마무리 구간의 불필요한 약점 노출을 제한"],

  [7, 21, "조건 충족 시 등장하며, 해당 부위를 타격하면 브레이크 조건이 누적된다."],
  [7, 31, "약점 피격 피드백"],
  [7, 37, ""],
  [7, 41, ""],
  [7, 42, ""],

  [8, 18, "곡괭이가 약점에 접촉"],
  [8, 20, "피격 시마다 약점이 반응하고 크기 증가"],
  [8, 24, "약점 타격 80회"],

  [9, 33, "6.5"],
  [9, 35, "약점 위치가 다른 위치로 이동하는 시간(초)"],
  [9, 43, "브레이크 지속 프레임"],
  [9, 47, "광물 데이터에 브레이크 규칙 적용 여부를 정의하는 컬럼."],
  [9, 69, "브레이크 규칙 적용 광물"],
  [9, 75, "weak_break_hits"],
  [9, 77, "Int"],
  [9, 79, "80"],
  [9, 81, "브레이크까지 필요한 약점 타격 수"],
  [9, 83, "weak_reveal_min_ratio"],
  [9, 85, "Float"],
  [9, 87, "0~100"],
  [9, 89, "남은 HP 비율 하한. 해당 비율 이하 구간에서는 약점 미노출"],

  [10, 25, "BreakType 데이터 확인"],
];

for (const [slideIndex, shapeIndex, value] of updates) {
  const slide = pres.slides.getItem(slideIndex);
  const shape = slide?.shapes?.items?.[shapeIndex];
  if (!shape?.text) continue;
  shape.text.set(value);
}

const out = await PresentationFile.exportPptx(pres);
await out.save(OUTPUT);
