import Game from '../api/game/model';
import moveResult from './moveResult';
import formulas from './formulas';

const moveWithBot = move => {
  return new Promise((resolve, reject) => {
    Game.findById(move.game.id)
      .populate('p1.user')
      .then(game => {
        let moveResultValue = moveResult(game, move);
        game.p1.hp = moveResultValue.p1.hpLeft;
        game.p2.hp = moveResultValue.p2.hpLeft;

        game.moveResults.push(moveResultValue);

        if (checkForEnd(game)) {
          game.state = 'FINISHED';
          if (game.p2.hp <= 0) {
            game.winner = game.p1.user;
          }
        }

        game.currentMove++;
        return game.save();
      })
      .then(updatedGame => {
        resolve(updatedGame);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const checkForEnd = game => {
  let end = game.p1.hp <= 0 || game.p2.hp <= 0;
  return end;
};

export default {
  moveWithBot: moveWithBot,
  checkForEnd: checkForEnd
};
