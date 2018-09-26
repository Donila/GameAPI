const BASE_ATTACK = 20;
const BASE_DEF = 10;
const BASE_HP = 70;
const HP_PER_VIT = 10;
const ATK_PER_STR = 3;
const ATK_PER_LVL = 1;
const DEF_PER_LVL = 1;
const DEF_PER_DEF = 3;
const HP_PER_LVL = 10;

export default {
  atk: (lvl, str) => {
    return BASE_ATTACK + lvl * ATK_PER_LVL + str * ATK_PER_STR;
  },
  def: (lvl, def) => {
    return BASE_DEF + lvl * DEF_PER_LVL + def * DEF_PER_DEF;
  },
  hp: (lvl, vit) => {
    return BASE_HP + lvl * HP_PER_LVL + vit * HP_PER_VIT;
  }
};
