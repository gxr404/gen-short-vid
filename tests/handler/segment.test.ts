import path from 'node:path'
import fs from 'node:fs/promises'
import { expect, it } from 'vitest'
import { segmentVideo } from '../../src/handler'
import { getVideoInfo } from '../../src/utils'

const videoPath = path.join(import.meta.dirname, '../fixtures/demo.mp4')
const baseOutputPath = path.join(import.meta.dirname, '../.temp/handler_segment')

it('only segment', async () => {
  const outputPath = path.join(baseOutputPath, '0')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })
  const resultPathList = await segmentVideo({
    videoPath,
    segmentTime: '00:02:00',
    outputPath,
  }, videoPath)
  expect(resultPathList.length).toBe(5)
  // console.log(resultPathList)
  const videoInfo = await getVideoInfo(resultPathList[0])
  expect(videoInfo.time).toBeGreaterThanOrEqual(1 * 60)
  expect(videoInfo.w).toBe(960)
  expect(videoInfo.h).toBe(540)
  expect(videoInfo.size).toBe(11630837)
  // expect(videoInfo.size).toBe(11239713)
})
