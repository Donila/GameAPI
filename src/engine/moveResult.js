import formulas from './formulas';
import bot from './bot';
/*
    hitcodes:
        atk
    1x *--
    2x -*-
    3x --*
        def
    x1 *--
    x2 -*-
    x3 --*
*/
const convertAtk = code => {
  if (code % 30 < 10) {
    return 3;
  }
  if (code % 20 < 10) {
    return 2;
  }
  return 1;
};

const convertDef = code => {
  let atk = convertAtk(code);
  let def = code - atk * 10;
  return def;
};

const playerHits = (attackerCode, defenderCode) => {
  let atk = convertAtk(attackerCode);
  let def = convertDef(defenderCode);

  return atk !== def;
};

export default (game, move) => {
  let moveNumber = game.currentMove;
  let user = move.user.id;

  let botMove = { hitcode: bot.getHitCode() };

  let p1atk = formulas.atk(game.p1.lvl, game.p1.str);
  let p2atk = formulas.atk(game.p2.lvl, game.p2.str);
  let p1def = formulas.def(game.p1.lvl, game.p1.def);
  let p2def = formulas.def(game.p2.lvl, game.p2.def);

  let p1dmg = 0;
  let p2dmg = 0;

  if (playerHits(move.hitcode, botMove.hitcode)) {
    p1dmg = p1atk - p2def;
  }
  if (playerHits(botMove.hitcode, move.hitcode)) {
    p2dmg = p2atk - p1def;
  }

  let p1hpLeft = game.p1.hp - p2dmg;
  let p2hpLeft = game.p2.hp - p1dmg;

  let moveResult = {
    p1: {
      user: user,
      damage: p1dmg,
      hpLeft: p1hpLeft,
      hitcode: move.hitcode
    },
    p2: { damage: p2dmg, hpLeft: p2hpLeft, hitcode: botMove.hitcode },
    moveNumber: moveNumber
  };

  return moveResult;
};
