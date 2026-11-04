// Сборка презентации .pptx на устройстве учителя.
// Текст и фигуры остаются редактируемыми в PowerPoint, Keynote
// и «Р7-Офис»: мы не вставляем картинки со слайдами.

const COLORS = {
  bg: '171A1D',
  text: 'F2F4F5',
  dim: 'A9B1B7',
  accent: '3FAE76',
  line: '333A40',
}

const WIDTH = 13.333
const HEIGHT = 7.5

function fileBaseName(meta) {
  const raw = `Alma-${meta.subjectTitle}-${meta.topicTitle}`
  return (
    raw
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 90) || 'Alma-prezentaciya'
  )
}

function addBackground(slide, background) {
  slide.background = { color: background }
}

function addAccentBar(slide, x, y, width, height) {
  slide.addShape('rect', {
    x,
    y,
    w: width,
    h: height,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent, width: 0 },
  })
}

function addFooter(slide, meta, number, total) {
  // Тонкая линия отделяет содержание от подписи.
  slide.addShape('rect', {
    x: 0.8,
    y: 6.95,
    w: WIDTH - 1.6,
    h: 0.012,
    fill: { color: COLORS.line },
    line: { color: COLORS.line, width: 0 },
  })

  slide.addText(
    `Alma · ${meta.subjectTitle}${meta.grade ? ` · ${meta.grade} класс` : ''}`,
    {
      x: 0.8,
      y: 7.02,
      w: 8,
      h: 0.3,
      fontSize: 9,
      color: COLORS.dim,
      fontFace: 'Arial',
      margin: 0,
    },
  )

  slide.addText(`${number} / ${total}`, {
    x: WIDTH - 2.1,
    y: 7.02,
    w: 1.3,
    h: 0.3,
    fontSize: 9,
    color: COLORS.dim,
    fontFace: 'Arial',
    align: 'right',
    margin: 0,
  })
}

function addTitleSlide(pptx, meta, item) {
  const slide = pptx.addSlide()
  addBackground(slide, COLORS.bg)
  addAccentBar(slide, 0, 0, 0.18, HEIGHT)

  slide.addText('ALMA · ШКОЛЬНЫЙ ПРОЕКТ', {
    x: 0.9,
    y: 0.9,
    w: 8,
    h: 0.4,
    fontSize: 11,
    bold: true,
    color: COLORS.accent,
    fontFace: 'Arial',
    charSpacing: 2,
    margin: 0,
  })

  const longTitle = item.title.length > 55

  slide.addText(item.title, {
    x: 0.9,
    y: 2.05,
    w: WIDTH - 1.8,
    h: 2.2,
    fontSize: longTitle ? 32 : 42,
    bold: true,
    color: COLORS.text,
    fontFace: 'Arial',
    valign: 'top',
    margin: 0,
  })

  slide.addText(
    `${meta.subjectTitle}${meta.grade ? ` · ${meta.grade} класс` : ''}`,
    {
      x: 0.9,
      y: 4.45,
      w: WIDTH - 1.8,
      h: 0.5,
      fontSize: 18,
      color: COLORS.dim,
      fontFace: 'Arial',
      margin: 0,
    },
  )

  addAccentBar(slide, 0.9, 5.35, 2.2, 0.06)

  slide.addText('Презентация к уроку', {
    x: 0.9,
    y: 5.6,
    w: 6,
    h: 0.4,
    fontSize: 16,
    color: COLORS.text,
    fontFace: 'Arial',
    margin: 0,
  })

  slide.addText(meta.date, {
    x: WIDTH - 3.3,
    y: 7.02,
    w: 2.5,
    h: 0.3,
    fontSize: 9,
    color: COLORS.dim,
    fontFace: 'Arial',
    align: 'right',
    margin: 0,
  })

  return slide
}

function addContentSlide(pptx, meta, item, number, total) {
  const slide = pptx.addSlide()
  addBackground(slide, COLORS.bg)
  addAccentBar(slide, 0, 0, 0.18, HEIGHT)

  slide.addText(
    `${meta.subjectTitle}${meta.grade ? ` · ${meta.grade} класс` : ''}`,
    {
      x: 0.9,
      y: 0.5,
      w: 9,
      h: 0.35,
      fontSize: 10,
      bold: true,
      color: COLORS.accent,
      fontFace: 'Arial',
      charSpacing: 1,
      margin: 0,
    },
  )

  // Слайд без пунктов — разделитель: заголовок по центру.
  if (item.bullets.length === 0) {
    slide.addText(item.title, {
      x: 1.2,
      y: 2.6,
      w: WIDTH - 2.4,
      h: 1.8,
      fontSize: 34,
      bold: true,
      color: COLORS.text,
      fontFace: 'Arial',
      align: 'center',
      valign: 'middle',
      margin: 0,
    })
    addAccentBar(slide, WIDTH / 2 - 1, 4.6, 2, 0.06)
  } else {
    slide.addText(item.title, {
      x: 0.9,
      y: 0.95,
      w: WIDTH - 1.8,
      h: 1.1,
      fontSize: 30,
      bold: true,
      color: COLORS.text,
      fontFace: 'Arial',
      valign: 'top',
      margin: 0,
    })

    addAccentBar(slide, 0.9, 2.12, 1.5, 0.05)

    const bulletLength = item.bullets.join(' ').length
    const fontSize = bulletLength > 320 || item.bullets.length > 5 ? 16 : 19

    slide.addText(
      item.bullets.map((bullet) => ({
        text: bullet,
        options: {
          bullet: { code: '2022' },
          breakLine: true,
          paraSpaceAfter: 12,
        },
      })),
      {
        x: 0.95,
        y: 2.45,
        w: WIDTH - 2.1,
        h: 4.2,
        fontSize,
        color: COLORS.text,
        fontFace: 'Arial',
        valign: 'top',
        lineSpacingMultiple: 1.15,
        margin: 0,
      },
    )
  }

  addFooter(slide, meta, number, total)

  return slide
}

export async function downloadPresentation({ meta, slides }) {
  const module = await import('pptxgenjs')
  const PptxGenJS = module.default

  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'Alma'
  pptx.company = 'Alma'
  pptx.subject = meta.subjectTitle
  pptx.title = meta.topicTitle

  const total = slides.length

  slides.forEach((item, index) => {
    const slide =
      index === 0
        ? addTitleSlide(pptx, meta, item)
        : addContentSlide(pptx, meta, item, index + 1, total)

    if (item.note) slide.addNotes(item.note)
  })

  await pptx.writeFile({ fileName: `${fileBaseName(meta)}.pptx` })
}
