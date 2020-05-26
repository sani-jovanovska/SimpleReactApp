import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

function ProductDetails({match}) {
    const [product,setProduct]=useState({})  
    useEffect(() => {
        const fetchData = async () => {
          const result = await axios(
            `https://my-json-server.typicode.com/drakulovski/dbplaceholder/products?categoryId=${match.params.id}`,
          );          
            setProduct(result.data[0]);         
        };
        fetchData();
    
      }, []);
      console.log(product)

      
  return (
    
    <div className="App">
        <Link to='/'><Button>Go Back</Button></Link><br/>
      <img src={product.picture} width={300} height={300}/><br/>
     
      <b>Title: </b> {product.title}<br/>
      <b>Price: </b> {product.price}<br/>
      <b>Description:</b>{product.description}
    </div>
  );
}

export default ProductDetails;
