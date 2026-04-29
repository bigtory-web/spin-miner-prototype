const { FileBlob, PresentationFile } = await import("@oai/artifact-tool");
const fs = await import("node:fs/promises");

const src = "C:/Users/Home/OneDrive/포트폴리오/승리챌린지/승리챌린지.pptx";
const out = "tmp/slides/victory_previews";
await fs.mkdir(out, { recursive: true });

const pptx = await FileBlob.load(src);
const presentation = await PresentationFile.importPptx(pptx);

for (let i = 0; i < presentation.slides.count; i++) {
  const slide = presentation.slides.getItem(i);
  try {
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    const bytes = Buffer.from(await png.arrayBuffer());
    await fs.writeFile(`${out}/slide-${String(i + 1).padStart(2, "0")}.png`, bytes);
  } catch (error) {
    await fs.writeFile(`${out}/slide-${String(i + 1).padStart(2, "0")}.txt`, String(error));
  }
}

console.log(`slides=${presentation.slides.count}`);
