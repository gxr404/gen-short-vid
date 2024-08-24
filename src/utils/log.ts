import process from 'node:process'
import log4js from 'log4js'

log4js.configure({
  appenders: {
    cheese: {
      type: 'console',
      layout: {
        type: 'pattern',
        // pattern: '%[%c [%p]:%] %m%n'
        pattern: '%[%c:%] %m',
      },
    },
  },
  categories: { default: { appenders: ['cheese'], level: 'info' } },
})

export const logger = log4js.getLogger('gen-short-vid')

if (process.env.LOG_LEVEL === 'debug') {
  logger.level = 'debug'
}
