import path from 'node:path'
import { expect, it } from 'vitest'
import { getVideoInfo } from '../src/utils'

it('getVideoInfo run normal', async () => {
  // const videoPath = path.join(import.meta.dirname, '../example/demo.mp4')
  const videoPath = path.join(import.meta.dirname, './fixtures/demo.mp4')
  const videoInfo = await getVideoInfo(videoPath)
  // console.log(videoInfo)
  expect(videoInfo.w).toBe(960)
  expect(videoInfo.h).toBe(540)
  expect(videoInfo.time).toBe(600.0995)
  expect(videoInfo.size).toBe(64129943)
})
