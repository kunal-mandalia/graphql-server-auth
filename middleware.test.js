const { isAuthenticated } = require('./middleware')
const { signToken } = require('./helper')

describe(`middleware`, () => {
  describe(`isAuthenticated()`, () => {
    const req = {
      headers: {},
      body: {}
    }
    const res = {
      status: jest.fn().mockReturnValue({
        json: () => {}
      })
    }
    const next = jest.fn()

    afterEach(() => {
      res.status.mockClear()
      next.mockClear()
    })

    it(`should skip token verification when no token provided`, () => {
      isAuthenticated(req, res, next)
      expect(req.context).toBeFalsy()
      expect(next.mock.calls).toHaveLength(1)      
    })

    // bad/malformed token
    describe(`given bad/malformed token`, () => {
      it(`should return 400 status code`, () => {
        const badToken = 'exampleOfAMalformedToken'
        req.body.token = badToken
        isAuthenticated(req, res, next)
        expect(res.status.mock.calls.length).toBeGreaterThan(0)
        expect(res.status.mock.calls[0][0]).toEqual(400)
        expect(req.context).toBeFalsy()
      })
    })

    // good token
    describe(`given a valid token`, () => {
      it(`should attach decoded token to req.context so it can be used for next request`, async function () {
        const user = {
          _id: '1234',
          username: 'Kunal Mandalia',
          email: 'kunal.v.mandalia@gmail.com'
        }
        const token = await signToken({ payload: user })
        req.body.token = token
        isAuthenticated(req, res, next)
        expect(res.status.mock.calls.length).toEqual(0)
        expect(req.context).toBeTruthy()
        for (key in user) {
          expect(req.context).toHaveProperty(key, user[key])
        }
      })
    })
  })
})
