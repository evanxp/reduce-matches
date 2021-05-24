#!/usr/bin/env node

const exit = async (source, err) => {
  console.error(source, err)
  process.exit(1)
}

process.on('unhandledRejection', (err) => {
  exit('unhandledRejection', err)
})

process.on('uncaughtException', (err) => {
  exit('uncaughtException', err)
})

require('./src').main()
