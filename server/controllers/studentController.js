const Student = require('../models/Student.js');
const Class = require('../models/Class.js');
const User = require('../models/User.js'); // Importer le modèle User
const bcrypt = require('bcryptjs'); // Importer bcrypt pour hacher le mot de passe

// Créer un profil étudiant ET son compte de connexion
const createStudent = async (req, res) => {
  const { firstName, lastName, dateOfBirth, class: classId, email, password } = req.body; 
  if (!firstName || !lastName || !dateOfBirth || !email || !password) {
    return res.status(400).json({ msg: 'Veuillez remplir tous les champs requis, y compris email et mot de passe.' });
  }
  
  try {
    // 1. Vérifier si un compte utilisateur avec cet email existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Un utilisateur avec cet email existe déjà.' });
    }

    // 2. Créer le nouveau compte utilisateur
    const newUser = new User({
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: 'student' // Le rôle est automatiquement 'student'
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    const savedUser = await newUser.save();

    // 3. Créer le profil étudiant en le liant au nouveau compte
    const student = new Student({ 
      firstName, 
      lastName, 
      dateOfBirth, 
      class: classId,
      userAccount: savedUser._id // Lier au compte utilisateur
    }); 
    const createdStudent = await student.save();

    // 4. Si une classe a été assignée, ajouter l'étudiant à cette classe
    if (classId) {
      await Class.findByIdAndUpdate(classId, { $push: { students: createdStudent._id } });
    }
    
    res.status(201).json(createdStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur du serveur lors de la création de l'étudiant." });
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
    student.firstName = req.body.firstName || student.firstName;
    student.lastName = req.body.lastName || student.lastName;
    student.dateOfBirth = req.body.dateOfBirth || student.dateOfBirth;
    student.class = newClassId;
    await student.save();
    if (oldClassId && oldClassId.toString() !== newClassId) {
      await Class.findByIdAndUpdate(oldClassId, { $pull: { students: student._id } });
    }
    if (newClassId && newClassId.toString() !== oldClassId?.toString()) {
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
      if (student.class) {
        await Class.findByIdAndUpdate(student.class, { $pull: { students: student._id } });
      }
      // Supprimer aussi le compte utilisateur associé
      await User.findByIdAndDelete(student.userAccount);
      await student.deleteOne();
      res.json({ msg: 'Étudiant et son compte supprimés' });
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