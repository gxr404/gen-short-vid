import path from 'node:path'
import fs from 'node:fs/promises'
import { expect, it } from 'vitest'
import { addBgImg } from '../../src/handler'
import { getVideoInfo } from '../../src/utils'

const videoPath = path.join(import.meta.dirname, '../fixtures/demo.mp4')
const bgImgPath = path.join(import.meta.dirname, '../fixtures/bg.jpg')
const baseOutputPath = path.join(import.meta.dirname, '../.temp/handler_bgImg')

it('background img', async () => {
  // const videoPath = path.join(import.meta.dirname, './fixtures/demo_hight.mp4')
  const outputPath = path.join(baseOutputPath, '0')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })

  const resultPath = await addBgImg({
    videoPath,
    outputPath,
    bgImgPath,
  }, videoPath)
  const videoInfo = await getVideoInfo(resultPath)

  expect(videoInfo.time).toBeGreaterThanOrEqual(10 * 60)
  expect(videoInfo.w).toBe(1080)
  expect(videoInfo.h).toBe(1920)
  expect(videoInfo.size).toBe(81014183)
  // w, h ---> 960 540
  // fontSize ---> 85.33333333333333
})
