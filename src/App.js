import React, { useEffect,useState } from 'react';
import './App.css';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    
  },
}));

function App(){
  return(
  <Router>
    <div>
      <Switch>
      <Route path="/" exact component={Product}/>
      <Route path="/details/:id" component={ProductDetails}/>
      </Switch>
      </div>
    </Router>)
}

function Product() {
  const [listProducts,setListProducts]=useState([]);
  const [listStates,setListStates]=useState([]);
  const [listCategories,setListCategories]=useState([]);
  const [sortValue,setSortValue]=useState('');
  const [showDialog,setShowDialog]=useState(false);
  const [item,setItem]=useState({title:'',price:'',description:'',stateId:0,picture:'',categoryId:'',check:false})
  const[stateValue,setStateValue]=useState('');
  const[categoryValue,setCategoryValue]=useState('');
  const [errorTitle,setErrorTitle]=useState('');
  const [errorPrice,setErrorPrice]=useState('');
  const [checked, setChecked] = React.useState(false);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://my-json-server.typicode.com/drakulovski/dbplaceholder/products',
      );
      const states = await axios(
        'https://my-json-server.typicode.com/drakulovski/dbplaceholder/states',
      );
      const categories=await axios(
        'https://my-json-server.typicode.com/drakulovski/dbplaceholder/categories',
      );
      setListProducts(result.data);
      setListStates(states.data);
      setListCategories(categories.data);
    };
    fetchData();

  }, []);
  const handleClickOpen = () => {
    setShowDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleChange = event => {
    setSortValue(event.target.value);
  };

  const handleStateValue = event => {
    setStateValue(event.target.value);
  };
  const handleCategoryValue = event => {
    setCategoryValue(event.target.value);
  };

  
  const handleCheckbox = name => event => {
    setChecked(event.target.checked );
  };

//tuka mi gi zacuvuva
 const addItem = item => {
    axios.post("https://my-json-server.typicode.com/drakulovski/dbplaceholder/products", item)
      .then(response => {
        listProducts.push(response.data);
       handleClose();
      })
      .catch(error => console.log(error));
  }

  function deleteProduct(id)
      {
          return axios.delete(`https://my-json-server.typicode.com/drakulovski/dbplaceholder/products/${id}`)
          .then(res => {
            
            let list=listProducts.filter(m => m.id !== id);
            console.log(list)
            setListProducts(list)
          })
          .catch(err => {
            console.log(err);
          }); 
      }


  //sortiranje za dropdown na pocetna 
  let sortedListProducts=listProducts;
  if(sortValue!=='')
  {
    if(sortValue==='name')
    {
      sortedListProducts=listProducts.sort((a, b) => (a.name > b.name) ? 1 : -1)
    }
    else{
      sortedListProducts=listProducts.sort((a, b) => (a.price > b.price) ? 1 : -1)
    }   
  }
  return ( 
    <div className="App">
      <div>
      <AppBar position="static">
        <Toolbar>
           <Typography className={classes.title} component={'span'} style={{textAlign:'left'}}>
              <FormControl className={classes.formControl} >
              <InputLabel style={{color:'white'}}>Choose</InputLabel>
              <Select
                value={sortValue}
                onChange={handleChange}
              >
                <MenuItem value='name'>Name</MenuItem>
                <MenuItem value='price'>Price</MenuItem>
              </Select>      
              </FormControl>
          </Typography>

          <Button color="inherit" onClick={()=>handleClickOpen()}>ADD PRODUCT</Button>
        </Toolbar>
      </AppBar>
    </div>
      
       
      
      <Grid container spacing={1} >      
      {sortedListProducts.map((product,i) => 
     <Grid key={i} item sm style={{minHeight:'450px',height:'450px'}}> 
      <Card className={classes.root} style={{height:'100%'}}>      
      
        <CardContent>
        <Link to={`/details/${product.id}`}><CardMedia style={{height:'300px'}}
          component="img"
          image={product.picture}
          
        />
        </Link>
          <Typography gutterBottom variant="h5" component={'span'}>
            {product.title}
          </Typography><br/>
          <Typography component={'span'}>
            ${product.price}
          </Typography> <br/> 
        </CardContent>
        <CardActions>
        <Button style={{color:'red'}} onClick={()=>deleteProduct(product.id)}>Delete</Button><br/>    
          </CardActions>
    </Card>
       
    </Grid>)}
    <Dialog open={showDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            helperText="Title is required with minimum 4 characters."
            error={errorTitle.length<4 && item.title!==''}
            onChange={(e)=>{setItem({...item,title:e.target.value}); setErrorTitle(e.target.value)}}
          />
           <TextField
            autoFocus
            margin="dense"
            id="price"
            label="Price"
            fullWidth
            error={errorPrice<4 && item.price!==''}
            helperText="Price is required and should be higher than 4."
            onChange={(e)=>{setItem({...item,price:e.target.value}); setErrorPrice(e.target.value)}}

          />
           <FormControlLabel
           control={
           <Checkbox
            checked={checked}
            onChange={()=>{handleCheckbox(true); setItem({...item,stock:true})}}
            value={checked}
            color="primary"
          />
        }
        label="Stock"
      />
            <TextField
            autoFocus
            type='text'
            margin="dense"
            id="description"
            label="Description"
            fullWidth
            onChange={(e)=>setItem({...item,description:e.target.value})}

          />
           <TextField
            autoFocus
            margin="dense"
            id="image"
            label="Image Url"
            fullWidth
            onChange={(e)=>{setItem({...item,picture:e.target.value})}}
          />
          <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">State</InputLabel>
          <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={stateValue}
          onChange={handleStateValue}
      
          >
          {listStates.map((element,i) => <MenuItem key={element.id} value={element.name} onClick={()=> { setItem({...item,stateId:element.id})}}>{element.name}</MenuItem>)}
        </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={categoryValue}
          onChange={handleCategoryValue}     
          >
          {listCategories.map((element,i) => <MenuItem key={element.id} value={element.name} onClick={()=> { setItem({...item,categoryId:element.id})}}>{element.name}</MenuItem>)}
        </Select>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button disabled={item.picture===''||categoryValue===''||stateValue===''||(errorTitle.length<4 || item.title==='')||(errorPrice<4 && item.price==='')} onClick={()=>{addItem(item)}} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
    
    </div>
  );
}

export default App;
