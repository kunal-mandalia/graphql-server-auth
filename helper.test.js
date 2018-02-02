const { signToken } = require('./helper')
const jsonwebtoken = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('./constants')

describe(`helper functions`, () => {
  describe(`signToken()`, () => {
    describe(`given a valid payload`, () => {
      let options, token
      beforeEach(async () => {
        options = {
          payload: {
            _id: '123',
            username: 'Kunal V. Mandalia',
            email: 'kunal.v.mandalia@gmail.com'
          }
        }
        token = await signToken(options)
      })
      
      it(`should generate a token`, () => {
        expect(typeof token).toEqual('string')
        expect(token.length).toBeGreaterThan(10)
      })

      it(`should generate a token which decodes to include payload`, () => {
        jsonwebtoken.verify(token, JWT_SECRET_KEY, (error, decoded) => {
          expect(error).toBeFalsy()
          for (key in options.payload) {
            expect(decoded[key]).toEqual(options.payload[key])
          }
        })
      })
    })
  })
})