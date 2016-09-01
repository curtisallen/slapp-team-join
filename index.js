'use strict'

const Slapp = require('slapp')
const BeepBoopContext = require('slapp-context-beepboop')
const express = require('express')()

const SLACK_VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN || ''
const listenPort = process.env.PORT || 8080

// Only used for debugging slack events
function logit (req, res, next) {
  console.log('headers: ', req.headers)
  console.log('enriched slapp: ', req.slapp)
  next()
}

let slapp = Slapp({
  verify_token: SLACK_VERIFY_TOKEN,
  context: [BeepBoopContext(), logit],
  log: true,
  record: 'out.jsonl',
  colors: true
})
slapp.attachToExpress(express)

express.listen(listenPort, () => {
  console.log('lisening on port ' + listenPort)
})

slapp.message('hey', ['direct_message'], (msg) => {
  msg.say('hello')
})

slapp.event('team_join', (msg) => {
  console.log('received team join event')
})
