const { Presentation, PresentationFile } = await import("@oai/artifact-tool");

const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const s = p.slides.add();
s.background.fill = "#101524";
s.shapes.add({
  geometry: "rect",
  position: { x: 80, y: 80, w: 1120, h: 560 },
  fill: "#1B2540",
  line: { fill: "#5F7BFF", width: 2 },
});
const t = s.shapes.add({
  geometry: "rect",
  position: { x: 120, y: 120, w: 900, h: 80 },
  fill: "#00000000",
  line: { fill: "#00000000", width: 0 },
});
t.text = "Spin Miner Portfolio Draft";
t.text.fontSize = 38;
t.text.fontFace = "Malgun Gothic";
t.text.color = "#FFFFFF";
const out = await PresentationFile.exportPptx(p);
await out.save("tmp/slides/test-output.pptx");
