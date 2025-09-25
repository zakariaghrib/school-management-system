const Grade = require('../models/Grade.js');
const Class = require('../models/Class.js');
const Subject = require('../models/Subject.js');

// Ajouter une nouvelle note
const addGrade = async (req, res) => {
  const { student, subject, grade, examType, teacher } = req.body;
  try {
    const newGrade = new Grade({ student, subject, grade, examType, teacher });
    await newGrade.save();
    res.status(201).json(newGrade);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Obtenir toutes les notes individuelles pour une classe
const getGradesForClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const targetClass = await Class.findById(classId).select('students');
    if (!targetClass) {
      return res.status(404).json({ msg: 'Classe non trouvée' });
    }
    const studentIds = targetClass.students;
    const grades = await Grade.find({ student: { $in: studentIds } })
      .populate('student', 'firstName lastName')
      .populate('subject', 'name')
      .sort({ createdAt: -1 });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// Mettre à jour une note
const updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (grade) {
      grade.grade = req.body.grade || grade.grade;
      grade.examType = req.body.examType || grade.examType;
      const updatedGrade = await grade.save();
      res.json(updatedGrade);
    } else {
      res.status(404).json({ msg: 'Note non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Supprimer une note
const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (grade) {
      await grade.deleteOne();
      res.json({ msg: 'Note supprimée' });
    } else {
      res.status(404).json({ msg: 'Note non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// Obtenir le bulletin de notes détaillé pour une classe
const getDetailedClassResults = async (req, res) => {
  try {
    const { classId } = req.params;
    const targetClass = await Class.findById(classId).populate('students', 'firstName lastName');
    if (!targetClass) return res.status(404).json({ msg: 'Classe non trouvée' });

    const allSubjects = await Subject.find({});
    const studentIds = targetClass.students.map(s => s._id);

    const results = await Grade.aggregate([
      { $match: { student: { $in: studentIds } } },
      { $group: { _id: { student: '$student', subject: '$subject' }, averageSubjectGrade: { $avg: '$grade' } } },
      { $group: { _id: '$_id.student', gradesBySubject: { $push: { subjectId: '$_id.subject', average: '$averageSubjectGrade' } }, overallAverage: { $avg: '$averageSubjectGrade' } } }
    ]);

    const detailedResults = targetClass.students.map(student => {
      const studentResult = results.find(r => r._id.equals(student._id));
      return {
        studentId: student._id,
        studentName: `${student.firstName} ${student.lastName}`,
        gradesBySubject: studentResult ? studentResult.gradesBySubject : [],
        overallAverage: studentResult ? studentResult.overallAverage : 0
      };
    });

    res.json({
      className: targetClass.name,
      allSubjects: allSubjects,
      results: detailedResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

module.exports = {
  addGrade,
  getGradesForClass,
  updateGrade,
  deleteGrade,
  getDetailedClassResults,
};