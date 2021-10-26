const { describe, expect, test } = require('@jest/globals')
const { createMocks } = require('node-mocks-http')

describe('/api/count', () => {
  test('Returns document when posted one of the required parameters in body', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    })
  })
})
