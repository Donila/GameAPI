import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Game } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, adminSession, game

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  game = await Game.create({ createdBy: user })
})

test('POST /games 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, date: 'test', state: 'test', type: 'test', participants: 'test', winner: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.date).toEqual('test')
  expect(body.state).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.participants).toEqual('test')
  expect(body.winner).toEqual('test')
  expect(typeof body.createdBy).toEqual('object')
})

test('POST /games 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /games 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /games 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /games 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /games/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${game.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(game.id)
  expect(typeof body.createdBy).toEqual('object')
})

test('GET /games/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${game.id}`)
  expect(status).toBe(401)
})

test('GET /games/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /games/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${game.id}`)
    .send({ access_token: userSession, date: 'test', state: 'test', type: 'test', participants: 'test', winner: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(game.id)
  expect(body.date).toEqual('test')
  expect(body.state).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.participants).toEqual('test')
  expect(body.winner).toEqual('test')
  expect(typeof body.createdBy).toEqual('object')
})

test('PUT /games/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${game.id}`)
    .send({ access_token: anotherSession, date: 'test', state: 'test', type: 'test', participants: 'test', winner: 'test' })
  expect(status).toBe(401)
})

test('PUT /games/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${game.id}`)
  expect(status).toBe(401)
})

test('PUT /games/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, date: 'test', state: 'test', type: 'test', participants: 'test', winner: 'test' })
  expect(status).toBe(404)
})

test('DELETE /games/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${game.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /games/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${game.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('DELETE /games/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${game.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /games/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${game.id}`)
  expect(status).toBe(401)
})

test('DELETE /games/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
