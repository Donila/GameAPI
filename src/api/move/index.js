import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Move, { schema } from './model'

const router = new Router()
const { game, hitcode, number } = schema.tree

/**
 * @api {post} /moves Create move
 * @apiName CreateMove
 * @apiGroup Move
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam game Move's game.
 * @apiParam hitcode Move's hitcode.
 * @apiParam number Move's number.
 * @apiSuccess {Object} move Move's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Move not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ game, hitcode, number }),
  create)

/**
 * @api {get} /moves Retrieve moves
 * @apiName RetrieveMoves
 * @apiGroup Move
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} moves List of moves.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /moves/:id Retrieve move
 * @apiName RetrieveMove
 * @apiGroup Move
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} move Move's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Move not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /moves/:id Update move
 * @apiName UpdateMove
 * @apiGroup Move
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam game Move's game.
 * @apiParam hitcode Move's hitcode.
 * @apiParam number Move's number.
 * @apiSuccess {Object} move Move's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Move not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ game, hitcode, number }),
  update)

/**
 * @api {delete} /moves/:id Delete move
 * @apiName DeleteMove
 * @apiGroup Move
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Move not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
