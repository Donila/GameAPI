import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Move } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, move

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  move = await Move.create({ user })
})

test('POST /moves 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, game: 'test', hitcode: 'test', number: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.game).toEqual('test')
  expect(body.hitcode).toEqual('test')
  expect(body.number).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /moves 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /moves 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /moves 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /moves/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${move.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(move.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /moves/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${move.id}`)
  expect(status).toBe(401)
})

test('GET /moves/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /moves/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${move.id}`)
    .send({ access_token: userSession, game: 'test', hitcode: 'test', number: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(move.id)
  expect(body.game).toEqual('test')
  expect(body.hitcode).toEqual('test')
  expect(body.number).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /moves/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${move.id}`)
    .send({ access_token: anotherSession, game: 'test', hitcode: 'test', number: 'test' })
  expect(status).toBe(401)
})

test('PUT /moves/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${move.id}`)
  expect(status).toBe(401)
})

test('PUT /moves/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, game: 'test', hitcode: 'test', number: 'test' })
  expect(status).toBe(404)
})

test('DELETE /moves/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${move.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /moves/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${move.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /moves/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${move.id}`)
  expect(status).toBe(401)
})

test('DELETE /moves/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
