import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { run } from '../src/main'
import { getVideoInfo } from '../src/utils'

const videoPath = path.join(import.meta.dirname, './fixtures/demo.mp4')
// const videoPath = path.join(import.meta.dirname, './fixtures/demo.avi')
// const videoPath = path.join(import.meta.dirname, './fixtures/demo.flv')
// const videoPath = path.join(import.meta.dirname, './fixtures/demo.wmv')
// const videoPath = path.join(import.meta.dirname, './fixtures/demo.mov')
// const videoPath = path.join(import.meta.dirname, './fixtures/demo.mkv')

const bgImg = path.join(import.meta.dirname, './fixtures/bg.jpg')
const baseOutputPath = path.join(import.meta.dirname, './.temp/combination')

describe('combination function', () => {
  it('text & split video', async () => {
    const outputPath = path.join(baseOutputPath, '0')
    const resultPath = await run({
      videoPath,
      text: 'Test video 中文测试 。。',
      outputPath,
      textColor: '#f49857',
      padColor: '#f49857',
      splitStartTime: '00:01:00',
      splitEndTime: '00:02:00',
    })

    const videoInfo = await getVideoInfo(resultPath[0])
    expect(videoInfo.time).toBeGreaterThanOrEqual((2 - 1) * 60)
    expect(videoInfo.w).toBe(960)
    expect(videoInfo.h).toBe(626)
    expect(videoInfo.size).toBe(4279834)
  })

  it('custom size & text & split video', async () => {
    const outputPath = path.join(baseOutputPath, '1')

    const resultPath = await run({
      videoPath,
      outputPath,
      width: 540,
      height: 940,
      text: 'Test video 中文测试 。。',
      textColor: '#f49857',
      padColor: '#f49857',
      splitStartTime: '00:01:00',
      splitEndTime: '00:02:00',
    })
    const videoInfo = await getVideoInfo(resultPath[0])

    expect(videoInfo.time).toBeGreaterThanOrEqual(1 * 60)
    expect(videoInfo.w).toBe(540)
    expect(videoInfo.h).toBe(940)
    expect(videoInfo.size).toBe(2199288)
  })

  it('text & background img', async () => {
    const outputPath = path.join(baseOutputPath, '2')

    const resultPath = await run({
      videoPath,
      text: 'Test video 中文测试 。。',
      outputPath,
      textColor: '#f49857',
      padColor: '#f49857',
      bgImg,
    })
    const videoInfo = await getVideoInfo(resultPath[0])

    expect(videoInfo.time).toBeGreaterThanOrEqual(10 * 60)
    expect(videoInfo.w).toBe(1080)
    expect(videoInfo.h).toBe(1920)
    expect(videoInfo.size).toBe(79065627)
    // w, h ---> 960 540
    // fontSize ---> 85.33333333333333
  })

  it('text & background img & split video', async () => {
    const outputPath = path.join(baseOutputPath, '3')
    const resultPath = await run({
      videoPath,
      outputPath,
      // w: 1080,
      // h: 1920,
      text: 'Test video 中文测试 。。',
      textColor: '#f49857',
      padColor: '#f49857',
      splitStartTime: '00:01:00',
      splitEndTime: '00:02:00',
      bgImg,
    })
    const videoInfo = await getVideoInfo(resultPath[0])

    expect(videoInfo.time).toBeGreaterThanOrEqual(1 * 60)
    expect(videoInfo.w).toBe(1080)
    expect(videoInfo.h).toBe(1920)
    expect(videoInfo.size).toBe(5719670)
  })

  it('split & segment video', async () => {
    const outputPath = path.join(baseOutputPath, '4')

    const resultPath = await run({
      videoPath,
      segmentTime: '00:02:00',
      splitStartTime: '00:02:00',
      splitEndTime: '00:08:00',
      outputPath,
    })
    expect(resultPath.length).toBe(3)
    // const videoInfo = await getVideoInfo(`${outputPath}/segment.mp4`)
    // expect(videoInfo.time).toBeGreaterThanOrEqual(1 * 60)
    // expect(videoInfo.w).toBe(1080)
    // expect(videoInfo.h).toBe(1920)
    // expect(videoInfo.size).toBe(5862942)
  })

  it('split & segment & text video', async () => {
    const outputPath = path.join(baseOutputPath, '5')

    const resultPath = await run({
      videoPath,
      segmentTime: '00:02:00',
      splitStartTime: '00:02:00',
      splitEndTime: '00:08:00',
      text: 'Hello world',
      textBgColor: '#3e7a38',
      // padColor: '#3e7a38',
      outputPath,
    })
    expect(resultPath.length).toBe(3)

    const videoInfo = await getVideoInfo(resultPath[0])
    expect(videoInfo.time).toBeGreaterThanOrEqual(2 * 60 - 10)
    expect(videoInfo.time).toBeLessThanOrEqual(2 * 60 + 10)
    expect(videoInfo.w).toBe(960)
    expect(videoInfo.h).toBe(626)
    expect(videoInfo.size).toBe(13296191)
    // expect(videoInfo.size).toBe(13118681)
  })

  it('split & segment & text & custom size video', async () => {
    const outputPath = path.join(baseOutputPath, '6')

    const resultPath = await run({
      videoPath,
      segmentTime: '00:02:00',
      splitStartTime: '00:02:00',
      splitEndTime: '00:08:00',
      text: 'Hello world',
      textBgColor: '#3e7a38',
      padColor: '#9f8203',
      width: 540,
      height: 960,
      outputPath,
    })

    expect(resultPath.length).toBe(3)
    const videoInfo = await getVideoInfo(resultPath[0])
    // console.log(videoInfo)
    expect(videoInfo.time).toBeGreaterThanOrEqual(2 * 60 - 10)
    expect(videoInfo.time).toBeLessThanOrEqual(2 * 60 + 10)
    expect(videoInfo.w).toBe(540)
    expect(videoInfo.h).toBe(960)
    expect(videoInfo.size).toBe(6544058)
    // expect(videoInfo.size).toBe(6476453)
  })

  it('split & segment & text & width video', async () => {
    const outputPath = path.join(baseOutputPath, '7')

    const resultPath = await run({
      videoPath,
      segmentTime: '00:02:00',
      splitStartTime: '00:02:00',
      splitEndTime: '00:08:00',
      text: 'Hello world',
      textBgColor: '#3e7a38',
      padColor: '#9f8203',
      width: 540,
      outputPath,
    })

    expect(resultPath.length).toBe(3)
    const videoInfo = await getVideoInfo(resultPath[0])
    // console.log(videoInfo)
    expect(videoInfo.time).toBeGreaterThanOrEqual(2 * 60 - 10)
    expect(videoInfo.time).toBeLessThanOrEqual(2 * 60 + 10)
    expect(videoInfo.w).toBe(540)
    expect(videoInfo.h).toBe(330)
    expect(videoInfo.size).toBe(6570950)
    // expect(videoInfo.size).toBe(6509255)
  })

  it('split & segment & text & height video', async () => {
    const outputPath = path.join(baseOutputPath, '8')

    const resultPath = await run({
      videoPath,
      segmentTime: '00:02:00',
      splitStartTime: '00:02:00',
      splitEndTime: '00:08:00',
      text: 'Hello world',
      textBgColor: '#3e7a38',
      padColor: '#9f8203',
      height: 270,
      outputPath,
    })

    expect(resultPath.length).toBe(3)
    const videoInfo = await getVideoInfo(resultPath[0])
    // console.log(videoInfo)
    expect(videoInfo.time).toBeGreaterThanOrEqual(2 * 60 - 10)
    expect(videoInfo.time).toBeLessThanOrEqual(2 * 60 + 10)
    expect(videoInfo.w).toBe(444)
    expect(videoInfo.h).toBe(270)
    expect(videoInfo.size).toBe(5403864)
    // expect(videoInfo.size).toBe(5360606)
  })

  it('split & segment & text & background image video', async () => {
    const outputPath = path.join(baseOutputPath, '9')

    const resultPath = await run({
      videoPath,
      segmentTime: '00:02:00',
      splitStartTime: '00:02:00',
      splitEndTime: '00:08:00',
      text: 'Hello world',
      textBgColor: 'black',
      padColor: '#9f8203',
      bgImg,
      outputPath,
    })

    expect(resultPath.length).toBe(3)
    const videoInfo = await getVideoInfo(resultPath[0])
    // console.log(videoInfo)
    expect(videoInfo.time).toBeGreaterThanOrEqual(2 * 60 - 10)
    expect(videoInfo.time).toBeLessThanOrEqual(2 * 60 + 10)
    expect(videoInfo.w).toBe(1080)
    expect(videoInfo.h).toBe(1920)
    expect(videoInfo.size).toBe(16864508)
    // expect(videoInfo.size).toBe(16706022)
  })

  it('split & segment & text (show text index) & background image video', async () => {
    const outputPath = path.join(baseOutputPath, '10')

    const resultPath = await run({
      videoPath,
      segmentTime: '00:02:00',
      splitStartTime: '00:02:00',
      splitEndTime: '00:08:00',
      text: '好好学习',
      showTextIndex: true,
      textBgColor: 'black',
      padColor: '#9f8203',
      bgImg,
      outputPath,
    })

    expect(resultPath.length).toBe(3)
    const videoInfo = await getVideoInfo(resultPath[0])
    // console.log(videoInfo)
    expect(videoInfo.time).toBeGreaterThanOrEqual(2 * 60 - 10)
    expect(videoInfo.time).toBeLessThanOrEqual(2 * 60 + 10)
    expect(videoInfo.w).toBe(1080)
    expect(videoInfo.h).toBe(1920)
    expect(videoInfo.size).toBe(16881860)
    // expect(videoInfo.size).toBe(16730408)
  })
})

describe('check validity', () => {
  it('not support video type', async () => {
    let isError = false
    try {
      await run({
        videoPath: 'test.gxr',
        outputPath: 'xxx',
      })
    }
    catch (e: any) {
      isError = true
      expect(e.message).toBe('not supported video type')
    }
    expect(isError).toBeTruthy()
  })
  it('set background img & custom size throw Error', async () => {
    let isError = false
    try {
      await run({
        videoPath: 'xxx.mp4',
        outputPath: 'xxx',
        width: 1080,
        height: 1920,
        bgImg: 'xxx',
      })
    }
    catch (e: any) {
      isError = true
      expect(e.message).toBe('when setting "bgImg", cannot set "width" or "height"')
    }
    expect(isError).toBeTruthy()
  })
})
