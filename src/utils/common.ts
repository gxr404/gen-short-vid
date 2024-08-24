import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import ffmpeg from 'fluent-ffmpeg'
import { logger } from './log'

interface VideoInfo {
  w?: number
  h?: number
  time?: number
  size?: number
}

export function getVideoInfo(videoPath: string) {
  return new Promise<VideoInfo>((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err: Error, metadata) => {
      if (err)
        return reject(err)

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video')
      if (!videoStream) {
        return reject(new Error('video stream not found'))
      }
      // console.log(metadata.format)
      // console.log(videoStream)
      resolve({
        w: videoStream.width,
        h: videoStream.height,
        time: metadata.format.duration,
        size: metadata.format.size,
      })
    })
  })
}

export async function copyFileList(fileList: string[], targetPath: string, fileName: string) {
  try {
    const plist = fileList.map((file, index) => {
      const copyTargetPath = path.join(targetPath, `${index}_${fileName}`)
      return fs.copyFile(file, copyTargetPath).then(() => copyTargetPath)
    })
    return await Promise.all(plist)
  }
  catch (e) {
    logger.debug(e)
    return false
  }
}

export function echoProgress(progress: any, targetName: string = 'unknown') {
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line no-console
    console.log(`${targetName} processing: ${Math.floor(progress.percent || 0)}%`)
  }
  else {
    process.stdout.clearLine(-1) // 清除当前行
    process.stdout.cursorTo(0) // 将光标移到行首
    process.stdout.write(`\x1B[32mgen-short-vid:\x1B[0m "${targetName}" processing: ${Math.floor(progress.percent || 0)}%`)
    // logger.info(`[${targetName}] processing: ${Math.floor(progress.percent || 0)}%`)
  }
}

export function echoEndProgress() {
  if (process.env.NODE_ENV !== 'test') {
    process.stdout.clearLine(-1) // 清除当前行
    process.stdout.cursorTo(0) // 将光标移到行首
  }
}
