import path from 'node:path'
import fs from 'node:fs/promises'
import ffmpegPath from 'ffmpeg-static'
import ffprobePath from 'ffprobe-static'
import ffmpeg from 'fluent-ffmpeg'

import { copyFileList } from './utils'
import { addBgImg, segmentVideo, splitVideo, textAndSizeVideo } from './handler'
import { SUPPORT_VIDEO_TYPE } from './constant'

export interface Options {
  videoPath: string
  outputPath: string
  width?: number
  height?: number
  text?: string
  textColor?: string
  textBgColor?: string
  fontSize?: number
  padColor?: string
  showTextIndex?: boolean
  // -segment_time 00:02:00.000
  segmentTime?: string
  bgImg?: string
  splitStartTime?: string
  splitEndTime?: string
}

function getDefaultOptions(): Partial<Options> {
  return {
    outputPath: './output',
    textColor: 'white',
    textBgColor: 'black',
    padColor: 'black',
    showTextIndex: false,
  }
}

export async function run(options: Options) {
  if (!ffmpegPath)
    throw new Error('not found ffmpeg path')
  ffmpeg.setFfmpegPath(ffmpegPath)
  ffmpeg.setFfprobePath(ffprobePath.path)

  options = {
    ...getDefaultOptions(),
    ...options,
  }
  checkValidity(options)

  // fix path
  options.videoPath = path.resolve(options.videoPath)
  options.outputPath = path.resolve(options.outputPath)

  const tempPath = path.join(options.outputPath, '.temp')
  await fs.mkdir(tempPath, { recursive: true })

  // let targetVideoPath = options.videoPath
  let targetList = [options.videoPath]

  // split video
  if (options.splitStartTime || options.splitEndTime) {
    targetList[0] = await splitVideo(options, targetList[0])
    // console.log('targetVideoPath', targetVideoPath)
  }

  // segment video
  if (options.segmentTime) {
    targetList = await segmentVideo(options, targetList[0])
  }

  // add text or change video size
  if (options.text || options.width || options.height) {
    const tempList = []
    for (let i = 0; i < targetList.length; i++) {
      const targetItem = await textAndSizeVideo(options, targetList[i], i)
      tempList.push(targetItem)
    }
    targetList = tempList
    // const promiseList = targetList.map((target, index) => {
    //   return textAndSizeVideo(options, target, index)
    // })
    // targetList = await Promise.all(promiseList)
  }

  // add background image
  if (options.bgImg) {
    // const promiseList = targetList.map((target, index) => {
    //   return addBgImg(options, target, index)
    // })
    // targetList = await Promise.all(promiseList)
    const tempList = []
    for (let i = 0; i < targetList.length; i++) {
      const targetItem = await addBgImg(options, targetList[i], i)
      tempList.push(targetItem)
    }
    targetList = tempList
  }

  const fileName = path.basename(options.videoPath)
  const resultList = await copyFileList(targetList, options.outputPath, fileName)

  if (resultList) {
    await fs.rm(tempPath, { recursive: true })
  }

  return resultList || []
}

export function checkValidity(options: Options) {
  const videoExtName = path.extname(options.videoPath)
  if (!SUPPORT_VIDEO_TYPE.includes(videoExtName)) {
    throw new Error('not supported video type')
  }

  if (options.bgImg && (options.width || options.height)) {
    throw new Error('when setting "bgImg", cannot set "width" or "height"')
  }
}
