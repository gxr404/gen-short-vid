import path from 'node:path'
import fs from 'node:fs/promises'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import type { Options } from '../main'
import { echoEndProgress, echoProgress, logger } from '../utils'

export function segmentVideo(options: Options, sourceVideoPath: string) {
  if (!ffmpegPath)
    throw new Error('not found ffmpeg path')
  ffmpeg.setFfmpegPath(ffmpegPath)

  const ffmpegCommand = ffmpeg()
  ffmpegCommand.addInput(sourceVideoPath)
  const segmentVideoPath = path.resolve(options.outputPath, './.temp')
  const fileName = path.basename(options.videoPath)

  const targetFileName = `segment_%03d_${fileName}`
  const segmentVideoFilePath = path.resolve(segmentVideoPath, targetFileName)

  return new Promise<string[]>((resolve, reject) => {
    ffmpegCommand
      .outputOptions('-map 0')
      .outputOptions(`-segment_time ${options.segmentTime}`)
      .outputOptions('-f segment')
      .outputOptions('-reset_timestamps 1')
      // .outputOptions('-v verbose')
      .on('start', (cmd) => {
        logger.debug(`================ 开始分割视频 ================`)
        logger.debug(`CMD: ${cmd}`)
      })
      .on('progress', (progress) => {
        echoProgress(progress, targetFileName)
      })
      .on('error', (err: Error) => {
        console.error(err)
        // throw err
        reject(err)
      })
      .on('end', async () => {
        const segmentFileNameList = await getSegmentListPath(segmentVideoPath)
        const segmentList = segmentFileNameList.map(fileName => path.resolve(segmentVideoPath, fileName))
        echoEndProgress()
        logger.debug('================ end ================')
        logger.info(`Done ${targetFileName}`)
        resolve(segmentList)
      })
      .save(segmentVideoFilePath)
  })
}

async function getSegmentListPath(videoPath: string) {
  const list = await fs.readdir(videoPath)
  return list.filter((fileName) => {
    return /segment_/.test(fileName)
  })
}
