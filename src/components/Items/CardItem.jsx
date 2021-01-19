import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import ClearIcon from '@material-ui/icons/Clear';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    margin: '1rem',
    maxHeigh: 300,

  },
  media: {
    height: 100,
  },
});

const CardItem = ({ item, onClick }) => {
  const classes = useStyles();

  return (
    <Card onClick={onClick} className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={item.imageUrl}
          title="Contemplative Reptile"
        />
        <CardContent>
          <div className="title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography className='capitalize' gutterBottom variant="body2" component="h4">
              {item.name}
            </Typography>
            {item.available ? (<CheckCircleIcon color='secondary' />) : (<ClearIcon htmlColor='red' />)}
          </div>

          <Typography variant="body2" color="textSecondary" component="p">
            {item.sizes
              ? `As low as $${item.price[item.sizes[0]]}`
              : item.price.toFixed(2)}
          </Typography>
          <div className="list" style={{ display: 'flex', justifyContent: 'space-around', padding: '0.5rem', alignItems: 'center' }}>
            {item.sizes && item.sizes.map(i => <p style={{ color: 'lightgray' }} key={i}>{i}</p>)}

          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}


export default CardItem;