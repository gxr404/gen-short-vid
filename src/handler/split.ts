import path from 'node:path'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import type { Options } from '../main'
import { echoEndProgress, echoProgress, logger } from '../utils'

export async function splitVideo(options: Options, sourceVideoPath: string) {
  if (!ffmpegPath)
    throw new Error('not found ffmpeg path')
  ffmpeg.setFfmpegPath(ffmpegPath)

  const ffmpegCommand = ffmpeg()
  ffmpegCommand.addInput(sourceVideoPath)

  const fileName = path.basename(options.videoPath)
  const targetFileName = `split_${fileName}`
  const splitVideoPath = path.resolve(options.outputPath, './.temp', targetFileName)

  if (options.splitStartTime) {
    ffmpegCommand.outputOptions(`-ss ${options.splitStartTime}`)
  }
  if (options.splitEndTime) {
    ffmpegCommand.outputOptions(`-to ${options.splitEndTime}`)
  }

  return new Promise<string>((resolve, reject) => {
    ffmpegCommand
      .outputOptions('-c copy')
      .on('start', (cmd) => {
        logger.debug(`================ split start ${targetFileName} ================`)
        logger.debug(`CMD: ${cmd}`)
      })
      .on('progress', (progress) => {
        echoProgress(progress, targetFileName)
      })
      .on('error', (err: Error) => {
        reject(err)
      })
      .on('end', () => {
        echoEndProgress()
        logger.debug('================ split end ================')
        logger.info(`Done ${targetFileName}`)
        resolve(splitVideoPath)
      })
      .save(splitVideoPath)
  })
}
