import test from 'ava'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'

// We keep a reference to nuxt so we can close
// the server at the end of the test
let nuxt = null

// Init Nuxt.js and start listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, '..')
  let config = {}
  try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
  config.rootDir = rootDir // project folder
  config.dev = false // production build
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  nuxt.listen(4000, 'localhost')
})

// Example of testing only generated html
test('Route / exits and render HTML', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/', context)
  t.true(html.includes(`<section class="container"><div><div><h1 class="title">Hello Nuxt</h1></div><a href="/about">About page</a></div></section>`))
})

// Example of testing via dom checking
test('Route / exits and render HTML with CSS applied', async t => {
  const window = await nuxt.renderAndGetWindow('http://localhost:4000/')
  const element = window.document.querySelector('.title')
  t.not(element, null)
  t.is(element.textContent, 'Hello Nuxt')
  t.is(element.className, 'title')
  console.log(window.getComputedStyle(element).color)
  t.is(window.getComputedStyle(element).color, 'rgb(53, 73, 94)')
})

// Close the nuxt server
test.after('Closing server', t => {
  nuxt.close()
})
