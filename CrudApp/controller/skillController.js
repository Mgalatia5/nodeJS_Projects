import mongoose from "mongoose";
import Skills from "../models/Skills.js";


const skillsController = {
    createSkills: async (req, res) => {
        const { title, description, image, detail } = req.body;
        if (!title || !description || !image || !detail) {
            return res.send("Found Empty Input");
        }
        try {
            const skills = new Skills({
                title: title || "Programming Languages",
                description: description || "Some description here",
                image: image || 'image_path',
                detail: detail || "some details here"
            });
            const save = await skills.save();
            res.send(save)
        } catch (err) {
            console.log(err);
        }
    },

    getSkills: async (req, res) => {
        try {
            const skills = await Skills.find({})
            return res.json({'skills':skills})
        } catch (err) {
            console.log(err);
        }
    },

}

export default skillsController;