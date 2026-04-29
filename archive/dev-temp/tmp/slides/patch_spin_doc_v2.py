from zipfile import ZipFile, ZIP_DEFLATED
from pathlib import Path

src = Path(r"C:\Users\Home\OneDrive\프로젝트\spin-miner-prototype\outputs\spin-miner-system-planning-doc-v2.pptx")
dst = Path(r"C:\Users\Home\OneDrive\프로젝트\spin-miner-prototype\outputs\spin-miner-system-planning-doc-v3.pptx")

slide_replacements = {
    "ppt/slides/slide2.xml": [
        ("대형 광물 채굴 중에 약점이 노출되고, 약점 공략을 통해 일정 시간 브레이크 상태를 발생시키는 시스템",
         "브레이크 적용 광물 채굴 중에 약점이 노출되고, 약점 공략을 통해 일정 시간 브레이크 상태를 발생시키는 시스템"),
        ("대형 광물 앞에서 대기하며 타격이 반복되는 구간에 조작 목적을 부여한다.",
         "브레이크 적용 광물 앞에서 대기하며 타격이 반복되는 구간에 조작 목적을 부여한다."),
        ("대형 광물 앞에서 플레이어가 위치와 타격 대상을 의식하도록 만든다.",
         "브레이크 적용 광물 앞에서 플레이어가 위치와 타격 대상을 의식하도록 만든다."),
        ("대형 광물을 오래 때리는 대상이 아니라 공략 대상처럼 인식하게 한다.",
         "브레이크 적용 광물을 오래 때리는 대상이 아니라 공략 대상처럼 인식하게 한다."),
        ("대형 광물의 체류 시간을 공략 단계로 분해한다.",
         "브레이크 적용 광물의 체류 시간을 공략 단계로 분해한다."),
    ],
    "ppt/slides/slide3.xml": [
        ("대형 광물 타격하면 해당 광물 근처에 등장하는 공략 포인트",
         "브레이크 적용 광물을 타격하면 해당 광물 근처에 등장하는 공략 포인트"),
        ("<a:t>대형 광물</a:t>", "<a:t>브레이크 적용 광물</a:t>"),
        ("캐릭터 DPS 대비 HP가 높을 경우 대형 광물로 취급한다.",
         "현재 기대 채굴 성능 대비 상대적 장기 체류가 발생할 경우 브레이크 적용 광물로 분류한다."),
    ],
    "ppt/slides/slide4.xml": [
        ("대형 광물은 긴 채굴 시간이 필요하지만 높은 보상을 제공하는 목적성이 있다.",
         "브레이크 적용 광물은 긴 채굴 시간이 필요하지만 높은 보상을 제공하는 목적성이 있다."),
        ("<a:t>대형 광물</a:t>", "<a:t>브레이크 적용 광물</a:t>"),
    ],
    "ppt/slides/slide5.xml": [
        ("대형 광물 타격", "브레이크 적용 광물 타격"),
        ("대형 광물을 일정 이상 타격하면", "브레이크 적용 광물을 일정 이상 타격하면"),
    ],
    "ppt/slides/slide7.xml": [
        ("<a:t>6. 약점 규칙</a:t>", "<a:t>6. 약점 규칙 / 설정값</a:t>"),
    ],
    "ppt/slides/slide10.xml": [
        ("<a:t>11. </a:t>", "<a:t>10. </a:t>"),
        ("<a:t>데이터</a:t>", "<a:t>데이터 키 초안</a:t>", 1),
        ("<a:t>테이블</a:t>", "<a:t></a:t>", 1),
        ("Table_BreakMiningConfig", "BreakMiningConfig (규칙값 매핑)"),
        ("Table_MineralBreakGroup", "MineralBreakGroup (적용 분류)"),
        ("장기 체류로 인해 브레이크 규칙을 적용하는 광물", "상대적 장기 체류가 발생해 브레이크 규칙을 적용하는 광물"),
    ],
}

with ZipFile(src, "r") as zin, ZipFile(dst, "w", ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename in slide_replacements:
            text = data.decode("utf-8")
            for rep in slide_replacements[item.filename]:
                if len(rep) == 2:
                    old, new = rep
                    text = text.replace(old, new)
                else:
                    old, new, count = rep
                    text = text.replace(old, new, count)
            data = text.encode("utf-8")
        zout.writestr(item, data)
