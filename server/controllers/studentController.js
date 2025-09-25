const Student = require('../models/Student.js');
const Class = require('../models/Class.js'); // N'oubliez pas cet import !

// @desc    Create a new student
// @route   POST /api/students
// @access  Private (Admin, Teacher)
const createStudent = async (req, res) => {
  // Récupérer 'class' depuis le corps de la requête
  const { firstName, lastName, dateOfBirth, class: classId } = req.body; 
  if (!firstName || !lastName || !dateOfBirth) {
    return res.status(400).json({ msg: 'Veuillez remplir les champs requis' });
  }
  try {
    // Créer le nouvel étudiant en incluant l'ID de la classe
    const student = new Student({ firstName, lastName, dateOfBirth, class: classId }); 
    const createdStudent = await student.save();

    // Si une classe a été assignée, ajouter l'étudiant à cette classe
    if (classId) {
      await Class.findByIdAndUpdate(classId, { $push: { students: createdStudent._id } });
    }

    res.status(201).json(createdStudent);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get all students (with optional class filter)
// @route   GET /api/students
// @access  Private (Admin, Teacher)
const getAllStudents = async (req, res) => {
  try {
    // Crée un objet de filtre. S'il y a un classId dans la query, on l'ajoute au filtre.
    const filter = {};
    if (req.query.classId) {
      filter.class = req.query.classId;
    }
    
    // On utilise .populate pour afficher le nom de la classe au lieu de juste son ID
    const students = await Student.find(filter).populate('class', 'name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get a single student by ID
// @route   GET /api/students/:id
// @access  Private (Admin, Teacher)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class', 'name');
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ msg: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      student.firstName = req.body.firstName || student.firstName;
      student.lastName = req.body.lastName || student.lastName;
      student.dateOfBirth = req.body.dateOfBirth || student.dateOfBirth;
      student.class = req.body.class || student.class;
      
      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ msg: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      await student.deleteOne();
      res.json({ msg: 'Student removed' });
    } else {
      res.status(404).json({ msg: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

