import { readFileSync } from 'node:fs'
import process from 'node:process'
import { cac } from 'cac'
import { logger } from './utils'
import type { Options } from './main'
import { run } from './main'

const { version, name } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url)).toString(),
)

const cli = cac(name)

cli
  .command('<videoPath>', '源视频')
  .option('-o, --outputPath <dir>', '输出的目录 eg: -o output_dir', {
    default: 'output',
  })
  .option('--width <width>', '输出的视频的宽 eg: --width 1080')
  .option('--height <height>', '输出的视频的高 eg: --height 1920')
  .option('--text <text>', '添加视频标题文本 eg: --text "Hello world!"')
  .option('--fontSize <fontSize>', '视频标题文本字体大小 eg: --fontSize 32')
  .option('--showTextIndex', '视频标题文本添加索引号 eg: --showTextIndex')
  .option('--textColor <textColor>', '视频标题文本色 eg: --textColor "#f49857"')
  .option('--textBgColor <textBgColor>', '视频标题文本背景色 eg: --textBgColor "#f49857"')
  .option('--padColor <padColor>', '宽高超出视频填充的背景色 eg: --padColor "#f49857"')
  .option('--segmentTime <segmentTime>', '视频片段时间, 按指定时间长度分片成多个视频 eg: --segmentTime "00:02:00.000"')
  .option('--bgImgPath <bgImgPath>', '添加视频背景图(输出的视频尺寸以背景图为准，不能和width、height一起使用) eg: --bgImgPath "./bg.jpg"')
  .option('--splitStartTime <splitStartTime>', '分割视频的开始时间 eg: --splitStartTime "00:02:00.000"')
  .option('--splitEndTime <splitEndTime>', '分割视频的结束时间 eg: --splitEndTime "00:04:00.000"')
  .action(async (videoPath, options: Options) => {
    try {
      options.videoPath = videoPath
      logger.debug(options)
      const resultList = await run(options)
      logger.info('√ Success \\(^o^)/ ')
      resultList.forEach((item, index) => {
        logger.info(`    ${index === resultList.length - 1 ? '└' : '├'}──── ${item}`)
      })
    }
    catch (err) {
      logger.error(err.message || 'unknown exception')
    }
  })

cli.help()
cli.version(version)

try {
  cli.parse()
}
catch (err) {
  logger.error(err.message || 'unknown exception')
  process.exit(1)
}
