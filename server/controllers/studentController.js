const Student = require('../models/Student.js');
const Class = require('../models/Class.js');

// Créer un nouvel étudiant
const createStudent = async (req, res) => {
  const { firstName, lastName, dateOfBirth, class: classId } = req.body; 
  if (!firstName || !lastName || !dateOfBirth) {
    return res.status(400).json({ msg: 'Veuillez remplir les champs requis' });
  }
  try {
    const student = new Student({ firstName, lastName, dateOfBirth, class: classId }); 
    const createdStudent = await student.save();

    if (classId) {
      await Class.findByIdAndUpdate(classId, { $push: { students: createdStudent._id } });
    }
    res.status(201).json(createdStudent);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Obtenir tous les étudiants (avec filtre optionnel par classe)
const getAllStudents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.classId) {
      filter.class = req.query.classId;
    }
    const students = await Student.find(filter).populate('class', 'name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// Obtenir un étudiant par son ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class', 'name');
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ msg: 'Étudiant non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// Mettre à jour un étudiant
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: 'Étudiant non trouvé' });
    }

    const oldClassId = student.class;
    const newClassId = req.body.class;

    // Mettre à jour les informations de l'étudiant
    student.firstName = req.body.firstName || student.firstName;
    student.lastName = req.body.lastName || student.lastName;
    student.dateOfBirth = req.body.dateOfBirth || student.dateOfBirth;
    student.class = newClassId;
    await student.save();

    // Si la classe a changé, mettre à jour les listes d'étudiants des classes
    if (oldClassId && oldClassId.toString() !== newClassId) {
      // Retirer de l'ancienne classe
      await Class.findByIdAndUpdate(oldClassId, { $pull: { students: student._id } });
    }
    if (newClassId && newClassId.toString() !== oldClassId?.toString()) {
      // Ajouter à la nouvelle classe
      await Class.findByIdAndUpdate(newClassId, { $push: { students: student._id } });
    }
    
    res.json(student);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Supprimer un étudiant
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      // Retirer l'étudiant de sa classe avant de le supprimer
      if (student.class) {
        await Class.findByIdAndUpdate(student.class, { $pull: { students: student._id } });
      }
      await student.deleteOne();
      res.json({ msg: 'Étudiant supprimé' });
    } else {
      res.status(404).json({ msg: 'Étudiant non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};