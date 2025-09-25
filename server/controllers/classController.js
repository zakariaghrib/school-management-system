const Class = require('../models/Class.js');
const Student = require('../models/Student.js');

// Créer une nouvelle classe
const createClass = async (req, res) => {
  const { name, year, mainTeacher } = req.body;
  try {
    const newClass = new Class({ name, year, mainTeacher });
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Obtenir toutes les classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({}).populate('mainTeacher', 'firstName lastName').populate('students', 'firstName lastName');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Obtenir une classe par son ID
const getClassById = async (req, res) => {
  try {
    const singleClass = await Class.findById(req.params.id).populate('mainTeacher', 'firstName lastName').populate('students', 'firstName lastName');
    if (!singleClass) {
      return res.status(404).json({ msg: 'Classe non trouvée' });
    }
    res.json(singleClass);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Mettre à jour une classe
const updateClass = async (req, res) => {
  try {
    const singleClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
     if (!singleClass) {
      return res.status(404).json({ msg: 'Classe non trouvée' });
    }
    res.json(singleClass);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Supprimer une classe
const deleteClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (cls) {
      // Optionnel : retirer l'assignation de classe pour les étudiants de cette classe
      await Student.updateMany({ _id: { $in: cls.students } }, { $unset: { class: "" } });
      await cls.deleteOne();
      res.json({ message: 'Classe supprimée' });
    } else {
      res.status(404).json({ message: 'Classe non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};


// Ajouter un étudiant à une classe
const addStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    const singleClass = await Class.findById(classId);
    if (!singleClass) {
      return res.status(404).json({ msg: 'Classe non trouvée' });
    }
    if (!singleClass.students.includes(studentId)) {
      singleClass.students.push(studentId);
      await singleClass.save();
    }
    // Mettre à jour le document de l'étudiant
    await Student.findByIdAndUpdate(studentId, { class: classId });
    res.json(singleClass);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Retirer un étudiant d'une classe
const removeStudentFromClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    const singleClass = await Class.findById(classId);
    if (!singleClass) {
      return res.status(404).json({ msg: 'Classe non trouvée' });
    }
    singleClass.students = singleClass.students.filter(id => id.toString() !== studentId);
    await singleClass.save();
    // Mettre à jour le document de l'étudiant
    await Student.findByIdAndUpdate(studentId, { $unset: { class: "" } });
    res.json(singleClass);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
};