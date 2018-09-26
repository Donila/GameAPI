import mongoose, { Schema } from 'mongoose';
import moveResultSchema from './moveResult.model';

const gameStates = ['IN_PROGRESS', 'ABANDONED', 'FINISHED'];
const gameTypes = ['WITH_BOT'];

const playerSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  lvl: { type: Number },
  hp: { type: Number },
  startingHp: { type: Number },
  str: { type: Number },
  def: { type: Number }
});

const gameSchema = new Schema(
  {
    createdBy: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date
    },
    state: {
      type: String,
      enum: gameStates,
      default: 'IN_PROGRESS',
      required: true
    },
    type: {
      type: String,
      enum: gameTypes,
      default: 'WITH_BOT',
      required: true
    },
    p1: playerSchema,
    p2: playerSchema,
    currentMove: { type: Number, default: 1, required: true },
    gameVersion: { type: Number, default: 0.1, required: true },
    moveResults: [moveResultSchema],
    winner: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id;
      }
    }
  }
);

gameSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      date: this.date,
      state: this.state,
      type: this.type,
      currentMove: this.currentMove,
      winner: this.winner,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      p1: this.p1,
      p2: this.p2,
      moveResults: this.moveResults
    };

    return full
      ? {
          ...view,
          createdBy: this.createdBy.view(full),
          p1: this.p1,
          p2: this.p2
        }
      : view;
  }
};

const model = mongoose.model('Game', gameSchema);

export const schema = model.schema;
export default model;
