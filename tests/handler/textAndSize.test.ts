import path from 'node:path'
import fs from 'node:fs/promises'
import { expect, it } from 'vitest'
import { textAndSizeVideo } from '../../src/handler'
import { getVideoInfo } from '../../src/utils'

const videoPath = path.join(import.meta.dirname, '../fixtures/demo.mp4')
const baseOutputPath = path.join(import.meta.dirname, '../.temp/handler_text_and_size')

it('only set text', async () => {
  const outputPath = path.join(baseOutputPath, 'text')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })

  const resultPath = await textAndSizeVideo({
    videoPath,
    text: 'Test video 中文测试 。。',
    outputPath,
    textColor: '#f49857',
    padColor: '#f49857',
  }, videoPath)

  const videoInfo = await getVideoInfo(resultPath)
  expect(videoInfo.time).toBeGreaterThanOrEqual(10 * 60)
  expect(videoInfo.w).toBe(960)
  expect(videoInfo.h).toBe(626)
  expect(videoInfo.size).toBe(61539524)
  // w, h ---> 960 540
  // fontSize ---> 85.33333333333333
})

it('set width video', async () => {
  const outputPath = path.join(baseOutputPath, 'width')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })

  const resultPath = await textAndSizeVideo({
    videoPath,
    outputPath,
    width: 960 / 2,
  }, videoPath)

  const videoInfo = await getVideoInfo(resultPath)
  expect(videoInfo.time).toBeGreaterThanOrEqual(10 * 60)
  expect(videoInfo.w).toBe(960 / 2)
  expect(videoInfo.h).toBe(540 / 2)
  expect(videoInfo.size).toBe(27344388)
})

it('set height video', async () => {
  const outputPath = path.join(baseOutputPath, 'height')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })
  const resultPath = await textAndSizeVideo({
    videoPath,
    outputPath,
    height: 540 / 2,
  }, videoPath)
  const videoInfo = await getVideoInfo(resultPath)

  expect(videoInfo.time).toBeGreaterThanOrEqual(10 * 60)
  expect(videoInfo.w).toBe(960 / 2)
  expect(videoInfo.h).toBe(540 / 2)
  expect(videoInfo.size).toBe(27344388)
})

it('custom size video', async () => {
  const outputPath = path.join(baseOutputPath, 'size')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })

  const resultPath = await textAndSizeVideo({
    videoPath,
    outputPath,
    width: 540,
    height: 940,
  }, videoPath)
  const videoInfo = await getVideoInfo(resultPath)

  expect(videoInfo.time).toBeGreaterThanOrEqual(10 * 60)
  expect(videoInfo.w).toBe(540)
  expect(videoInfo.h).toBe(940)
  expect(videoInfo.size).toBe(30793619)
})

it('custom size & text video', async () => {
  const outputPath = path.join(baseOutputPath, 'all')
  const tempPath = path.join(outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })

  const resultPath = await textAndSizeVideo({
    videoPath,
    outputPath,
    width: 540,
    height: 940,
    text: 'Test video 中文测试 。。',
    textColor: '#f49857',
    padColor: '#f49857',
  }, videoPath)

  const videoInfo = await getVideoInfo(resultPath)

  expect(videoInfo.time).toBeGreaterThanOrEqual(10 * 60)
  expect(videoInfo.w).toBe(540)
  expect(videoInfo.h).toBe(940)
  expect(videoInfo.size).toBe(30832376)
})
