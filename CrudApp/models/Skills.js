import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    title: {
        type: String,
        required:true,
    },
    image: {
        type: String,
        required:true,
    },
    description: {
        type: String,
        required:true,
    },
    detail: {
        type: String,
        required:true,
    }
});

const Skills = mongoose.model('skill', skillSchema, 'skills');
export default Skills