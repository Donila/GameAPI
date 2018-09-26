import mongoose, { Schema } from 'mongoose';

const moveSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    game: {
      type: Schema.ObjectId,
      ref: 'Game',
      required: true
    },
    hitcode: {
      type: Number,
      required: true
    },
    number: {
      type: String,
      required: true
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

moveSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      game: this.game,
      hitcode: this.hitcode,
      number: this.number,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    return full
      ? {
          ...view
          // add properties for a full view
        }
      : view;
  }
};

const model = mongoose.model('Move', moveSchema);

export const schema = model.schema;
export default model;
