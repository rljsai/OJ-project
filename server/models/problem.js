import mongoose from "mongoose";

const testcaseschema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  ExpectedOutput: {
    type: String,
    required: true,
  }
});

const problemschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  testcases: [testcaseschema],
  score: {
    type: Number,
    required: true
  }
}, { timestamps: true });


problemschema.pre('validate', function (next) {
  if (this.difficulty === 'Easy') {
    this.score = 30;
  } else if (this.difficulty === 'Medium') {
    this.score = 60;
  } else if (this.difficulty === 'Hard') {
    this.score = 100;
  }
  next();
});

const problem = mongoose.model("Problem", problemschema);
export default problem;
