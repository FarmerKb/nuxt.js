import express from 'express'
import rp from 'request-promise-native'
import { Nuxt } from '../../'
import { loadFixture, getPort } from '../utils'

let port
const url = route => 'http://localhost:' + port + route

let nuxt
let app
let server

describe('express', () => {
  // Init nuxt.js and create express server
  beforeAll(async () => {
    const config = loadFixture('basic')
    nuxt = new Nuxt(config)

    port = await getPort()

    // Create express app
    app = express()

    // Register nuxt
    app.use(nuxt.render)

    // Start listening on localhost:4000
    server = app.listen(port)
  })

  test('/stateless with express', async () => {
    const html = await rp(url('/stateless'))

    expect(html.includes('<h1>My component!</h1>')).toBe(true)
  })

  test('close server', async () => {
    await nuxt.close()
    await new Promise((resolve, reject) => {
      server.close(err => err ? reject(err) : resolve())
    })
  })
})
