const Grade = require('../models/Grade.js');
const Class = require('../models/Class.js');
const Student = require('../models/Student.js');
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

// Obtenir les résultats simples (moyenne générale) pour une classe
const getClassResults = async (req, res) => {
  try {
    const { classId } = req.params;
    const targetClass = await Class.findById(classId).select('students');
    if (!targetClass) return res.status(404).json({ msg: 'Classe non trouvée' });

    const studentIds = targetClass.students;
    const results = await Grade.aggregate([
      { $match: { student: { $in: studentIds } } },
      { $group: { _id: '$student', averageGrade: { $avg: '$grade' } } },
      { $lookup: { from: 'students', localField: '_id', foreignField: '_id', as: 'studentInfo' } },
      { $project: { _id: 0, studentId: '$_id', studentName: { $concat: [{ $arrayElemAt: ['$studentInfo.firstName', 0] }, ' ', { $arrayElemAt: ['$studentInfo.lastName', 0] }] }, average: { $round: ['$averageGrade', 2] } } }
    ]);
    res.json(results);
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
  getClassResults,
  getDetailedClassResults,
};