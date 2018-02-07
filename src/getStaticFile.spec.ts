import { Request, Response } from 'express'
import * as httpMocks from 'node-mocks-http'

import { getStaticFile } from './getStaticFile'

describe('getStaticFile', () => {
  describe('when the app/key cookies are not set', () => {
    it('calls `next()`', () => {
      const next = jest.fn()
      const req = httpMocks.createRequest({ cookies: {} })
      const res = httpMocks.createResponse()
      getStaticFile(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when only the app cookie is set', () => {
    it('calls `next()`', () => {
      const next = jest.fn()
      const req = httpMocks.createRequest({ cookies: { app: 'foo' } })
      const res = httpMocks.createResponse()
      getStaticFile(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when only the key cookie is set', () => {
    it('calls `next()`', () => {
      const next = jest.fn()
      const req = httpMocks.createRequest({ cookies: { key: 'foo' } })
      const res = httpMocks.createResponse()
      getStaticFile(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when the app/key cookies are both set', () => {
    let req: Request
    let res: Response

    beforeEach(() => {
      req = httpMocks.createRequest({
        cookies: { app: 'app', key: 'key' },
        path: '/my/file',
      })

      res = httpMocks.createResponse()
      res.sendFile = jest.fn()
    })

    it('does not call `next()`', () => {
      const next = jest.fn()
      getStaticFile(req, res, next)

      expect(next).not.toHaveBeenCalled()
    })

    it('calls `res.sendFile`', () => {
      getStaticFile(req, res, jest.fn())
      expect(res.sendFile).toHaveBeenCalled()
    })

    describe('the `res.sendFile` call', () => {
      it('is relative to the files directory', () => {
        getStaticFile(req, res, jest.fn())
        expect(res.sendFile).toHaveBeenCalledWith(expect.stringMatching(/(.*\/)?files\//))
      })

      it('includes the path requested', () => {
        getStaticFile(req, res, jest.fn())
        expect(res.sendFile).toHaveBeenCalledWith(expect.stringContaining(req.path))
      })

      it('includes the app and key requested', () => {
        getStaticFile(req, res, jest.fn())
        expect(res.sendFile).toHaveBeenCalledWith(expect.stringContaining('app/key'))
      })
    })
  })
})
