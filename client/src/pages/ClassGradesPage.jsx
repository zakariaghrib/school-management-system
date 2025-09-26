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
  Select, MenuItem, FormControl, InputLabel, TextField, IconButton, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ClassGradesPage = () => {
  const { classId } = useParams();
  const { user } = useContext(AuthContext);
  
  const [classInfo, setClassInfo] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState('');
  const [editingGrade, setEditingGrade] = useState(null);

  const [student, setStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [examType, setExamType] = useState('Examen Finale');

  const [filterStudent, setFilterStudent] = useState('');

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

  const handleEditClick = (g) => {
    setEditingGrade(g);
    setStudent(g.student._id);
    setSubject(g.subject._id);
    setGrade(g.grade);
    setExamType(g.examType);
  };

  const handleCancelEdit = () => {
    setEditingGrade(null);
    setStudent('');
    setSubject('');
    setGrade('');
    setExamType('Examen Finale');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingGrade) {
      const gradeData = { grade, examType };
      try {
        await gradeService.updateGrade(editingGrade._id, gradeData, user.token);
        setMessage("Note modifiée avec succès !");
        handleCancelEdit();
        loadData();
      } catch (error) {
        setMessage(error.response?.data?.msg || "Erreur de modification.");
      }
    } else {
      const gradeData = { student, subject, grade, examType, teacher: user.id };
      try {
        await gradeService.addGrade(gradeData, user.token);
        setMessage("Note ajoutée avec succès !");
        setStudent(''); setSubject(''); setGrade('');
        loadData();
      } catch (error) {
        setMessage(error.response?.data?.msg || "Erreur d'ajout.");
      }
    }
  };

  const handleDelete = async (gradeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await gradeService.deleteGrade(gradeId, user.token);
        loadData();
      } catch (error) {
        setMessage(error.response?.data?.msg || "Erreur de suppression.");
      }
    }
  };

  const filteredGrades = filterStudent
    ? grades.filter(g => g.student._id === filterStudent)
    : grades;

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

      {/* Formulaire d'ajout/modification */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">{editingGrade ? 'Modifier une note' : 'Ajouter une note'}</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                {/* --- CORRECTION ICI --- */}
                <InputLabel id="student-select-label">Étudiant</InputLabel>
                <Select 
                  labelId="student-select-label"
                  id="student-select"
                  value={student} 
                  label="Étudiant" 
                  onChange={e => setStudent(e.target.value)} 
                  required 
                  disabled={!!editingGrade}
                >
                  {classInfo.students.map(s => <MenuItem key={s._id} value={s._id}>{s.firstName} {s.lastName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                {/* --- CORRECTION ICI --- */}
                <InputLabel id="subject-select-label">Matière</InputLabel>
                <Select 
                  labelId="subject-select-label"
                  id="subject-select"
                  value={subject} 
                  label="Matière" 
                  onChange={e => setSubject(e.target.value)} 
                  required 
                  disabled={!!editingGrade}
                >
                  {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth label="Type d'examen" value={examType} onChange={e => setExamType(e.target.value)} required />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth label="Note / 20" type="number" value={grade} onChange={e => setGrade(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button type="submit" variant="contained" fullWidth>{editingGrade ? 'Mettre à jour' : 'Ajouter'}</Button>
              {editingGrade && <Button variant="outlined" onClick={handleCancelEdit} fullWidth>Annuler</Button>}
            </Grid>
          </Grid>
        </Box>
        {message && <Typography color="primary.main" sx={{ mt: 2 }}>{message}</Typography>}
      </Paper>

      {/* Tableau des notes */}
      <Typography variant="h6">Historique des notes</Typography>
      <FormControl sx={{ minWidth: 250, my: 2 }}>
        <InputLabel id="filter-student-label">Filtrer par étudiant</InputLabel>
        <Select 
          labelId="filter-student-label"
          value={filterStudent} 
          label="Filtrer par étudiant" 
          onChange={e => setFilterStudent(e.target.value)}
        >
          <MenuItem value=""><em>Tous les étudiants</em></MenuItem>
          {classInfo.students.map(s => <MenuItem key={s._id} value={s._id}>{s.firstName} {s.lastName}</MenuItem>)}
        </Select>
      </FormControl>
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
            {filteredGrades.map((g) => (
              <TableRow key={g._id} hover>
                <TableCell>{g.student?.firstName} {g.student?.lastName}</TableCell>
                <TableCell>{g.subject?.name}</TableCell>
                <TableCell>{g.examType}</TableCell>
                <TableCell>{g.grade}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(g)}><EditIcon color="primary" /></IconButton>
                  <IconButton onClick={() => handleDelete(g._id)}><DeleteIcon color="error" /></IconButton>
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
