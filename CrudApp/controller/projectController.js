import mongoose from 'mongoose';
import Project from "../models/project.js";

const projectController = {
    createProject: async (req, res) => {
        try {
            const { title, description, liveLink } = req.body;
            const image = 'assets/img/file-' + req._fileName;
            const project = new Project({
                title: title || 'CCTV Camera',
                image: image || 'image',
                description: description || 'blablablabla',
                liveLink: liveLink || 'https://www.appneti.com'
            });

            const savedProject = await project.save();

            if (!savedProject) {
                return res.status(400).send({ message: "Something went wrong" });
            }

            res.render('pages/projects');

        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    getProjects: async (req, res) => {
        try {
            const projects = await Project.find({});

            res.render('pages/projects', { projects });
            // res.json({ projects })

        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    preview: async (req, res) => {
        try {

            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send({ message: "Invalid ID format" });
            }
            const project = await Project.findById(id);

            res.render('pages/preview', { project });

        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    deleteAll: async (req, res) => {
        try {
            const project = await Project.deleteMany({});
            res.json({project});
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
}

export default projectController;
