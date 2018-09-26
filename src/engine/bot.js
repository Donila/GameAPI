let getHitCode = () => {
  let atkRandom = Math.floor(Math.random() * 3) + 1;
  let defRandom = Math.floor(Math.random() * 3) + 1;

  let hitCode = atkRandom * 10 + defRandom;
  return hitCode;
};

export default {
  getHitCode: getHitCode
};
