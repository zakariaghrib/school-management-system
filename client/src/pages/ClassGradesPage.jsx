import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import subjectService from '../services/subjectService';
import classService from '../services/classService';
import gradeService from '../services/gradeService';

// Importations MUI
import { 
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Button,
  Select, MenuItem, FormControl, InputLabel, TextField, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ClassGradesPage = () => {
  const { classId } = useParams();
  const { user } = useContext(AuthContext);
  
  const [classInfo, setClassInfo] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState('');

  const [student, setStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [examType, setExamType] = useState('Contrôle 1');

  const loadData = () => {
    if (user && classId) {
      classService.getClassById(classId, user.token).then(res => setClassInfo(res.data));
      subjectService.getAllSubjects(user.token).then(res => setSubjects(res.data));
      gradeService.getGradesForClass(classId, user.token).then(res => setGrades(res.data));
    }
  };

  useEffect(() => {
    loadData();
  }, [user, classId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gradeData = { student, subject, grade, examType, teacher: user.id };
    try {
      await gradeService.addGrade(gradeData, user.token);
      setMessage("Note ajoutée avec succès !");
      setStudent(''); setSubject(''); setGrade('');
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur");
    }
  };

  const handleDelete = async (gradeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await gradeService.deleteGrade(gradeId, user.token);
        loadData();
      } catch (error) {
        setMessage(error.response?.data?.msg || "Erreur de suppression");
      }
    }
  };

  if (!classInfo) return <p>Chargement...</p>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Gestion des Notes : {classInfo.name}
        </Typography>
        <Button variant="outlined" component={Link} to={`/classes/${classId}/results`}>
          Voir le bulletin
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Ajouter une note</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200, flexGrow: 1 }}>
            <InputLabel>Étudiant</InputLabel>
            <Select value={student} label="Étudiant" onChange={e => setStudent(e.target.value)} required>
              {classInfo.students.map(s => <MenuItem key={s._id} value={s._id}>{s.firstName} {s.lastName}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200, flexGrow: 1 }}>
            <InputLabel>Matière</InputLabel>
            <Select value={subject} label="Matière" onChange={e => setSubject(e.target.value)} required>
              {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Type d'examen" value={examType} onChange={e => setExamType(e.target.value)} required sx={{ minWidth: 150, flexGrow: 1 }} />
          <TextField label="Note / 20" type="number" value={grade} onChange={e => setGrade(e.target.value)} required sx={{ width: 120 }}/>
          <Button type="submit" variant="contained">Ajouter</Button>
        </Box>
        {message && <Typography color="primary.main" sx={{ mt: 2 }}>{message}</Typography>}
      </Paper>

      <Typography variant="h6">Notes enregistrées</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Étudiant</TableCell>
              <TableCell>Matière</TableCell>
              <TableCell>Type d'examen</TableCell>
              <TableCell>Note</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((g) => (
              <TableRow key={g._id} hover>
                <TableCell>{g.student?.firstName} {g.student?.lastName}</TableCell>
                <TableCell>{g.subject?.name}</TableCell>
                <TableCell>{g.examType}</TableCell>
                <TableCell>{g.grade}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(g._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ClassGradesPage;