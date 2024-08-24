import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import type { AudioVideoFilter } from 'fluent-ffmpeg'
import type { Options } from '../main'
import { echoEndProgress, echoProgress, getVideoInfo, logger } from '../utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function textAndSizeVideo(options: Options, sourceVideoPath: string, index = 0) {
  if (!ffmpegPath)
    throw new Error('not found ffmpeg path')
  ffmpeg.setFfmpegPath(ffmpegPath)

  const videoFilters: AudioVideoFilter[] = []

  const ffmpegCommand = ffmpeg()
  ffmpegCommand.addInput(sourceVideoPath)

  const fileName = path.basename(options.videoPath)
  const targetFileName = `text_size_${index}_${fileName}`
  const targetVideoPath = path.resolve(options.outputPath, './.temp', targetFileName)

  const videoInfo = await getVideoInfo(options.videoPath)

  // 添加文字
  if (options.text) {
    const fontPath = path.join(__dirname, '../../assets/fonts/ChillReunion_Round.otf')
    const rawW = videoInfo.w
    const rawH = videoInfo.h
    let w = options.width
    let h = options.height
    if (!w && !h) {
      w = rawW
      h = rawH
    }
    else if (w && (!h || options.bgImgPath) && (rawW && rawH)) {
      h = rawH * (w / rawW)
    }
    else if (h && (!w || options.bgImgPath) && (rawW && rawH)) {
      w = rawW * (h / rawH)
    }
    // const w = options.w || rawW
    // const h = options.h || rawH
    const fontSize = options.fontSize || computeFontSize()

    function computeFontSize() {
      let fontSize = 32
      if (w && h) {
        logger.debug('w, h --->', w, h)
        // fontSize = 24 * Math.max(w/h, h/w) * 2
        fontSize = 24 * Math.max(w / h, h / w) * Math.max(w, h) / 940
      }
      return fontSize
    }

    videoFilters.push({
      filter: 'pad',
      options: {
        width: 'iw',
        // height: `ih+${fontSize + fontSize / 2}`,
        height: `ih+${fontSize * 2}`,
        x: 0,
        // y: fontSize + fontSize / 2,
        y: fontSize * 2,
        color: options.textBgColor || 'black',
      },
      // pad=width=iw:height=ih+30:x=0:y=30:color=black
      // 'width=iw:height=ih+30:x=0:y=30:color=red'
    })

    logger.debug('fontSize --->', fontSize)
    videoFilters.push({
      filter: 'drawtext',
      options: {
        text: options.showTextIndex ? `${options.text}(${index + 1})` : options.text,
        x: '(w-text_w)/2',
        // y: 'text_h/2 - 6',
        // y: 'text_h/2',
        y: fontSize / 2 + fontSize * 0.06,
        fontfile: fontPath,
        // fontsize: 32,
        // fontsize: '32 * min(w/1280, h/720)',
        // fontsize: '32 * max(w/h, h/w)',
        fontsize: fontSize,
        // fontsize: '32 * max(w/1280, h/720)',
        fontcolor: options.textColor || 'white',
      },
    })
    ffmpegCommand.videoFilters(videoFilters)
  }

  // .videoCodec('copy')
  // .audioCodec('copy')

  if (options.width && options.height) {
    ffmpegCommand
      .size(`${options.width}x${options.height}`)
      .autopad(true, options.padColor || 'black')
  }
  else if (options.width) {
    ffmpegCommand
      .size(`${options.width}x?`)
  }
  else if (options.height) {
    ffmpegCommand
      .size(`?x${options.height}`)
  }
  // .outputOptions('-c copy')
  return new Promise<string>((resolve, reject) => {
    ffmpegCommand
      .on('start', (cmd) => {
        logger.debug(`================ 开始创建临时视频 ================`)
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
        logger.debug('================ end ================')
        logger.info(`Done ${targetFileName}`)
        resolve(targetVideoPath)
      })
      .save(targetVideoPath)
  })
}
