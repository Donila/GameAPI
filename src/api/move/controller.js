import { success, notFound, authorOrAdmin } from '../../services/response/';
import { Move } from '.';
import engine from '../../engine';

export const create = ({ user, bodymen: { body } }, res, next) => {
  Move.create({ ...body, user })
    .then(move => {
      return new Promise((resolve, reject) => {
        move
          .populate('game')
          .execPopulate()
          .then(doc => {
            if (doc.game.type === 'WITH_BOT') {
              engine.moveWithBot(move).then(game => {
                resolve(game.view(true));
              });
            } else {
              resolve(move.view(true));
            }
          });
      });
    })
    .then(success(res, 201))
    .catch(next);
};

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Move.find(query, select, cursor)
    .populate('user')
    .then(moves => moves.map(move => move.view()))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Move.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(move => (move ? move.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Move.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then(move => (move ? Object.assign(move, body).save() : null))
    .then(move => (move ? move.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Move.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then(move => (move ? move.remove() : null))
    .then(success(res, 204))
    .catch(next);
