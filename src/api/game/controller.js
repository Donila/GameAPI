import { success, notFound, authorOrAdmin } from '../../services/response/';
import { Game } from '.';
import formulas from '../../engine/formulas';

export const create = ({ user, bodymen: { body } }, res, next) => {
  let gameObj = { ...body, createdBy: user };
  if (body.type === 'WITH_BOT') {
    var userStats = {
      lvl: user.stats.lvl,
      str: user.stats.str,
      def: user.stats.def,
      vit: user.stats.vit
    };

    gameObj.p1 = Object.assign({}, userStats);
    gameObj.p1.hp = gameObj.p1.startingHp = formulas.hp(
      gameObj.p1.lvl,
      gameObj.p1.vit
    );
    gameObj.p1.user = user;

    gameObj.p2 = Object.assign({}, userStats);
    gameObj.p2.user = null;
    gameObj.p2.hp = gameObj.p2.startingHp = formulas.hp(
      gameObj.p2.lvl,
      gameObj.p2.vit
    );
  }

  Game.create(gameObj)
    .then(game => game.view(true))
    .then(success(res, 201))
    .catch(next);
};

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Game.find(query, select, cursor)
    .populate('createdBy')
    .then(games => games.map(game => game.view()))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Game.findById(params.id)
    .populate('createdBy')
    .then(notFound(res))
    .then(game => (game ? game.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Game.findById(params.id)
    .populate('createdBy')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'createdBy'))
    .then(game => (game ? Object.assign(game, body).save() : null))
    .then(game => (game ? game.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Game.findById(params.id)
    .then(notFound(res))
    .then(game => (game ? game.remove() : null))
    .then(success(res, 204))
    .catch(next);
