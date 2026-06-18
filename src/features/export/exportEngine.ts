import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { toPng, toJpeg } from 'html-to-image'
import { saveAs } from 'file-saver'
import type { Planner, ExportConfig } from '@/types'

export interface ExportProgress {
  current: number
  total: number
  message: string
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 }
}

export async function exportToPDF(
  planner: Planner,
  pageElements: HTMLElement[],
  config: ExportConfig,
  onProgress?: (p: ExportProgress) => void
): Promise<void> {
  const total = pageElements.length + 2
  let current = 0

  onProgress?.({
    current: ++current,
    total,
    message: 'Creating PDF document...',
  })

  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const isA4 = config.pageSize === 'A4'
  const pageWidth = isA4 ? 595.28 : 612
  const pageHeight = isA4 ? 841.89 : 792

  for (let i = 0; i < pageElements.length; i++) {
    const el = pageElements[i]

    onProgress?.({
      current: ++current,
      total,
      message: `Rendering page ${i + 1} of ${pageElements.length}...`,
    })

    const scale =
      config.resolution === 300
        ? 4
        : config.resolution === 150
        ? 2
        : 1

    const dataUrl = await toPng(el, {
      quality: 1,
      pixelRatio: scale,
      cacheBust: true,
    })

    const imageBytes = await fetch(dataUrl).then(r => r.arrayBuffer())
    const image = await pdfDoc.embedPng(imageBytes)

    const page = pdfDoc.addPage([pageWidth, pageHeight])

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    })

    if (planner.config.showPageNumbers) {
      const primaryRgb = hexToRgb(planner.config.primaryColor)

      page.drawText(`${i + 1} / ${pageElements.length}`, {
        x: pageWidth - 60,
        y: 20,
        size: 7,
        font,
        color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
        opacity: 0.5,
      })
    }
  }

  onProgress?.({
    current: ++current,
    total,
    message: 'Saving PDF...',
  })

  const pdfBytes = await pdfDoc.save()

  const pdfBuffer = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer

  const blob = new Blob([pdfBuffer], {
    type: 'application/pdf',
  })

  saveAs(blob, `${planner.name.replace(/\s+/g, '-')}.pdf`)
}

export async function exportToImage(
  planner: Planner,
  pageElements: HTMLElement[],
  config: ExportConfig,
  onProgress?: (p: ExportProgress) => void
): Promise<void> {
  const total = pageElements.length + 1
  let current = 0

  const scale =
    config.resolution === 300
      ? 4
      : config.resolution === 150
      ? 2
      : 1

  const quality = config.quality / 100

  for (let i = 0; i < pageElements.length; i++) {
    const el = pageElements[i]

    onProgress?.({
      current: ++current,
      total,
      message: `Exporting page ${i + 1} of ${pageElements.length}...`,
    })

    let dataUrl: string

    if (config.format === 'jpg') {
      dataUrl = await toJpeg(el, {
        quality,
        pixelRatio: scale,
        backgroundColor: '#FFFFFF',
        cacheBust: true,
      })
    } else {
      dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: scale,
        cacheBust: true,
      })
    }

    const suffix =
      pageElements.length > 1
        ? `-page-${i + 1}`
        : ''

    const filename =
      `${planner.name.replace(/\s+/g, '-')}${suffix}.${config.format}`

    const response = await fetch(dataUrl)
    const blob = await response.blob()

    saveAs(blob, filename)
  }

  onProgress?.({
    current: ++current,
    total,
    message: 'Done!',
  })
}

export async function exportPlanner(
  planner: Planner,
  pageElements: HTMLElement[],
  config: ExportConfig,
  onProgress?: (p: ExportProgress) => void
): Promise<void> {
  if (config.format === 'pdf') {
    return exportToPDF(planner, pageElements, config, onProgress)
  }

  return exportToImage(planner, pageElements, config, onProgress)
}
