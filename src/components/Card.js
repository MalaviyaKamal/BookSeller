import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid, Container } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
({
  root: {
    width: 275,
    // maxWidth: 275,
    backgroundColor: "#e0e0e0"

  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function SimpleCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Grid container alignItems='center' justifyContent='center'>
      <Grid item >
        <Card variant="outlined" className={classes.root} align='center'>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              <br/>
              USER
            </Typography>
            <Typography variant="h5" component="h2">
              DARSHAN
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              student
            </Typography>
            <Typography variant="body2" component="p">
              lorem ipsum dolor sit amet
            </Typography>
          </CardContent>
          <CardActions>
            <Container align='center'>
              <Button size="small" variant='outlined' color='primary'>Learn More</Button>
            </Container>
          </CardActions>
        </Card>
      </Grid>
    </Grid>

  );
}
