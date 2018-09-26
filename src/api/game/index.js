import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token, master } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Game, { schema } from './model'

const router = new Router()
const { date, state, type, participants, winner } = schema.tree

/**
 * @api {post} /games Create game
 * @apiName CreateGame
 * @apiGroup Game
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam date Game's date.
 * @apiParam state Game's state.
 * @apiParam type Game's type.
 * @apiParam participants Game's participants.
 * @apiParam winner Game's winner.
 * @apiSuccess {Object} game Game's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Game not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ date, state, type, participants, winner }),
  create)

/**
 * @api {get} /games Retrieve games
 * @apiName RetrieveGames
 * @apiGroup Game
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} games List of games.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /games/:id Retrieve game
 * @apiName RetrieveGame
 * @apiGroup Game
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} game Game's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Game not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /games/:id Update game
 * @apiName UpdateGame
 * @apiGroup Game
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam date Game's date.
 * @apiParam state Game's state.
 * @apiParam type Game's type.
 * @apiParam participants Game's participants.
 * @apiParam winner Game's winner.
 * @apiSuccess {Object} game Game's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Game not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ date, state, type, participants, winner }),
  update)

/**
 * @api {delete} /games/:id Delete game
 * @apiName DeleteGame
 * @apiGroup Game
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Game not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)

export default router
