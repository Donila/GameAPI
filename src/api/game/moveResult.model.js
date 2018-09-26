import { Schema } from 'mongoose';

const playerMoveResult = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  hitcode: Number,
  damage: Number,
  hpLeft: Number
});

const moveResultSchema = new Schema({
  p1: playerMoveResult,
  p2: playerMoveResult,
  moveNumber: Number
});

export default moveResultSchema;
