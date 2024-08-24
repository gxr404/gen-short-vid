import path from 'node:path'
import fs from 'node:fs/promises'
import { expect, it } from 'vitest'
import { splitVideo } from '../../src/handler'
import { getVideoInfo } from '../../src/utils'

const videoPath = path.join(import.meta.dirname, '../fixtures/demo.mp4')
const baseOutputPath = path.join(import.meta.dirname, '../.temp/handler_split')

it('only set start time', async () => {
  const outputPath = path.join(baseOutputPath, 'start_time')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })

  const resultPath = await splitVideo({
    videoPath,
    splitStartTime: '00:02:00.000',
    outputPath,
  }, videoPath)

  const videoInfo = await getVideoInfo(resultPath)
  expect(videoInfo.time).toBeGreaterThanOrEqual((10 - 2) * 60)
  expect(videoInfo.w).toBe(960)
  expect(videoInfo.h).toBe(540)
  expect(videoInfo.size).toBe(52558509)
})
it('only set end time', async () => {
  const outputPath = path.join(baseOutputPath, 'end_time')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })

  const resultPath = await splitVideo({
    videoPath,
    splitEndTime: '00:03:00.000',
    outputPath,
  }, videoPath)

  const videoInfo = await getVideoInfo(resultPath)
  expect(videoInfo.time).toBeGreaterThanOrEqual(3 * 60)
  expect(videoInfo.w).toBe(960)
  expect(videoInfo.h).toBe(540)
  expect(videoInfo.size).toBe(19296437)
})
it('set start time and end time', async () => {
  const outputPath = path.join(baseOutputPath, 'all')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })

  const resultPath = await splitVideo({
    videoPath,
    splitStartTime: '00:02:00.000',
    splitEndTime: '00:03:00.000',
    outputPath,
  }, videoPath)

  const videoInfo = await getVideoInfo(resultPath)
  expect(videoInfo.time).toBeGreaterThanOrEqual((3 - 2) * 60)
  expect(videoInfo.w).toBe(960)
  expect(videoInfo.h).toBe(540)
  expect(videoInfo.size).toBe(7725003)
})
