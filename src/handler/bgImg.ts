import path from 'node:path'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import type { Options } from '../main'
import { echoEndProgress, echoProgress, logger } from '../utils'

export async function addBgImg(options: Options, sourceVideoPath: string, index = 0) {
  if (!ffmpegPath)
    throw new Error('not found ffmpeg path')
  ffmpeg.setFfmpegPath(ffmpegPath)

  const ffmpegCommand = ffmpeg()
  ffmpegCommand.addInput(sourceVideoPath)
  // ffmpegCommand.outputOptions('-c copy')

  // 添加背景图
  const hasBgImg = Boolean(options.bgImg)
  const bgImg = options.bgImg || ''
  const fileName = path.basename(options.videoPath)
  const targetFileName = `bg_img_${index}_${fileName}`
  const targetVideoPath = path.resolve(options.outputPath, './.temp', targetFileName)

  if (hasBgImg) {
    ffmpegCommand.addInput(bgImg)
    ffmpegCommand.complexFilter('[0][1]scale2ref=w=iw:h=ow/mdar[vid][bg];[bg][vid]overlay=(W-w)/2:(H-h)/2')
    // ffmpegCommand.complexFilter('overlay=0:0')

    // [0][1]scale2ref=w=iw:h=ow/mdar[vid][bg]:
    // w=iw：将视频的宽度设置为与背景图像的宽度相同。
    // h=ow/mdar：根据纵横比自动调整高度。mdar 表示最小纵横比 (min_dar)，可以确保输出的高度与宽度匹配。
    // [vid][bg]overlay=(W-w)/2:(H-h)/2:
    // overlay 滤镜将视频居中放置在背景图像上。
  }

  return new Promise<string>((resolve, reject) => {
    ffmpegCommand
      .on('start', (cmd) => {
        logger.debug(`================ 开始添加背景 ================`)
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
      .on('end', () => {
        echoEndProgress()
        logger.debug('================ end ================')
        logger.info(`Done ${targetFileName}`)
        resolve(targetVideoPath)
      })
      .save(targetVideoPath)
  })
}
