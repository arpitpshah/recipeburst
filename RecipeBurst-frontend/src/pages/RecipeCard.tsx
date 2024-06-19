import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Box } from '@mui/material';

interface RecipeCardProps {
  recipe: {
    recipeId?: string;
    recipeName: string;
    imageUrl?: string;
    description?: string;
    ingredients?:string;
    instructions?:string
  };
  onClick?: () => void;
}


const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const formatMultilineText = (text: string) => {
    return text.split('\r\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };
  return (
    <CardActionArea onClick={onClick}>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, maxHeight: 340,borderRadius:'15px', backgroundColor: 'rgba(226, 114, 91, 0.50)' }}>
        <CardMedia
          component="img"
          sx={{ width: { sm: '50%', xs: '100%' }, height: 'auto' }}
          image={recipe.imageUrl}
          alt={recipe.recipeName}
        />
        <CardContent sx={{ flex: 1, padding: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Typography gutterBottom variant="h5" component="div">
            {recipe.recipeName}
          </Typography>
          <Box sx={{ overflow: 'auto', textOverflow: 'ellipsis' }}>
          <Typography variant="body1" color="text.secondary" fontWeight="bold">
              Ingredients:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden' }}>
              {recipe.ingredients ? formatMultilineText(recipe.ingredients) : ''}
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight="bold" mt={2}>
              Instructions:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', overflow: 'hidden', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              {recipe.instructions ? formatMultilineText(recipe.instructions) : ''}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </CardActionArea>
    
  );
};

export default RecipeCard;
