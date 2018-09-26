import { Move } from '.'
import { User } from '../user'

let user, move

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  move = await Move.create({ user, game: 'test', hitcode: 'test', number: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = move.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(move.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.game).toBe(move.game)
    expect(view.hitcode).toBe(move.hitcode)
    expect(view.number).toBe(move.number)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = move.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(move.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.game).toBe(move.game)
    expect(view.hitcode).toBe(move.hitcode)
    expect(view.number).toBe(move.number)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
