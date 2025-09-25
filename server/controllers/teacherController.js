const Teacher = require('../models/Teacher.js');
const Class = require('../models/Class.js');

// Créer un nouvel enseignant
const createTeacher = async (req, res) => {
  const { firstName, lastName, contact, subjects } = req.body;
  if (!firstName || !lastName || !contact || !contact.email) {
    return res.status(400).json({ msg: 'Veuillez fournir un prénom, un nom et un email de contact' });
  }
  try {
    const teacherExists = await Teacher.findOne({ 'contact.email': contact.email });
    if (teacherExists) {
      return res.status(400).json({ msg: 'Un enseignant avec cet email existe déjà' });
    }
    const teacher = new Teacher({ firstName, lastName, contact, subjects });
    const createdTeacher = await teacher.save();
    res.status(201).json(createdTeacher);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Obtenir tous les enseignants
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({}).populate('subjects', 'name');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// Obtenir un enseignant par son ID
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('subjects', 'name');
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ msg: 'Enseignant non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// Mettre à jour un enseignant
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (teacher) {
      teacher.firstName = req.body.firstName || teacher.firstName;
      teacher.lastName = req.body.lastName || teacher.lastName;
      teacher.contact = req.body.contact || teacher.contact;
      teacher.subjects = req.body.subjects || teacher.subjects;
      const updatedTeacher = await teacher.save();
      res.json(updatedTeacher);
    } else {
      res.status(404).json({ msg: 'Enseignant non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Supprimer un enseignant
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (teacher) {
      await teacher.deleteOne();
      res.json({ msg: 'Enseignant supprimé' });
    } else {
      res.status(404).json({ msg: 'Enseignant non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// Obtenir les classes de l'enseignant connecté
const getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ mainTeacher: req.user.id }).populate('students', 'firstName lastName');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getMyClasses,
};