import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    liveLink:{
        type: String,
    }
});

const Project = mongoose.model('project', projectSchema, 'projects');
export default Project;