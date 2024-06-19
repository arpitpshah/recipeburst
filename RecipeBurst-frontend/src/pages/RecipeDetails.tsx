import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, CardContent, CardMedia, Container, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import { Recipe } from './RecipeForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { deleteRecipe, editRecipe, fetchRecipeByRecipeId } from '../services/recipeApi';

const RecipeDetails: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { recipeId } = useParams<{ recipeId: string }>();
  const [isEditable, setIsEditable] = useState(false);
  const auth = useSelector((state: RootState) => state.auth);
  const userId = auth.user?.userId;

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe((prevRecipe:any) => ({
      ...prevRecipe,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const isOwner = recipe && recipe.userId === userId;

  const handleSave = async () => {
    if (recipe) {
      const payload = {
        recipeName: recipe.recipeName,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        rating: recipe.rating,
        userId: recipe.userId
      };
  
      try {
        if(!recipeId){
          return null
        }
        const data = await editRecipe(recipeId, payload);
        handleOpenSnackbar('Recipe updated successfully');
        setIsEditable(false);
      } catch (error) {
        console.error('Error updating recipe details:', error);
      }
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage('');
  };

  const handleDeleteConfirm = async () => {
    if (recipe) {
      try {
        if(!userId){
          return null
        }
        await deleteRecipe(recipe.recipeId,userId);
        console.log('Recipe deleted successfully');
        handleOpenSnackbar('Recipe deleted successfully');
        setTimeout(()=>{
          setRecipe(null);
          navigate('/');
        },1000)
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
      handleCloseDeleteDialog();
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
        if(recipeId){
          try{
            const recipeData = await fetchRecipeByRecipeId(recipeId);
            setRecipe(recipeData[0]);
          }catch (error) {
          console.error('Error fetching recipe details:', error);
          }
        }
      }
    fetchRecipe();
  }, [recipeId]);

  if (!recipe) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const formatMultilineText = (text: string) => {
    return text.split('\r\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <Container maxWidth={false} sx={{ marginTop: 4 }}>
      <Grid container spacing={2} style={{background:"rgba(226, 114, 91, 0.50)", borderRadius:"15px",height:'500px',overflow:'auto',boxShadow:"0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"}}>
        <Grid item xs={12} md={6} style={{padding:'0px', height:'inherit'}}>
          <CardMedia
            component="img"
            image={recipe.imageUrl}
            alt={recipe.recipeName}
            sx={{ width: '100%',height:'inherit', objectFit:'inherit' }}
          />
        </Grid>
        <Grid item xs={12} md={6} style={{height:'inherit',overflow:'auto'}}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {isEditable ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  name="recipeName"
                  value={recipe.recipeName}
                  onChange={handleChange}
                />
              ) : (
                <h2>{recipe.recipeName}</h2>
              )}

              {isOwner && (
                <Box>
                  {isEditable ? (
                    <IconButton color="primary" onClick={handleSave}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton color="primary" onClick={handleEdit}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={handleOpenDeleteDialog}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </Box>
              )}
            </Box>
            {isEditable ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  name="ingredients"
                  value={recipe.ingredients}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  multiline
                  name="instructions"
                  value={recipe.instructions}
                  onChange={handleChange}
                  margin="normal"
                />
              </>
            ) : (
              <>
                <p><b>Ingredients:</b> {formatMultilineText(recipe.ingredients)}</p>
                <p><b>Instructions:</b> {formatMultilineText(recipe.instructions)}</p>
              </>
            )}
          </CardContent>
        </Grid>
      </Grid>
      <Dialog
      open={openDialog}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete Recipe"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this recipe?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog} color="primary">
          No
        </Button>
        <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
    <Snackbar
    open={openSnackbar}
    autoHideDuration={6000}
    onClose={handleCloseSnackbar}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  >
    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
      {snackbarMessage}
    </Alert>
  </Snackbar>
    </Container>
  );
};

export default RecipeDetails;
