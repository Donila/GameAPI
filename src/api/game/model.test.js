import { Game } from '.'
import { User } from '../user'

let user, game

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  game = await Game.create({ createdBy: user, date: 'test', state: 'test', type: 'test', participants: 'test', winner: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = game.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(game.id)
    expect(typeof view.createdBy).toBe('object')
    expect(view.createdBy.id).toBe(user.id)
    expect(view.date).toBe(game.date)
    expect(view.state).toBe(game.state)
    expect(view.type).toBe(game.type)
    expect(view.participants).toBe(game.participants)
    expect(view.winner).toBe(game.winner)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = game.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(game.id)
    expect(typeof view.createdBy).toBe('object')
    expect(view.createdBy.id).toBe(user.id)
    expect(view.date).toBe(game.date)
    expect(view.state).toBe(game.state)
    expect(view.type).toBe(game.type)
    expect(view.participants).toBe(game.participants)
    expect(view.winner).toBe(game.winner)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
