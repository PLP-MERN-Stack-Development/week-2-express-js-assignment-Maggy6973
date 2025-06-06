import express from 'express' // import express

const app = express(); // create an express application

const PORT = 3000; // define the port number WHERE  our backend will run


class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
  }
}

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.url} - ${timestamp}`);
  next();
}

const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'my-secret-key') {
     throw new AuthError('Invalid API key');
  }
  next();
}

const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  
  if (!name || !description || !price || !category || inStock === undefined) {
    throw new ValidationError('All fields are required: name, description, price, category, inStock');
  }
  
  if (typeof price !== 'number' || price <= 0) {
    throw new ValidationError('Price must be a positive number');
  }
  
  next();
}


app.use(loggerMiddleware); 

//Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!'); // send a response when the root URL is accessed
});

app.use(express.json());

app.get('/api/products', asyncHandler(async (req, res)=> {
  const products= [
    {id:1, name:'Mobiles', description:'Latest smartphones', price: 699, category: 'Electronics', inStock: true},
    {id:2, name:'Laptops', description:'High performance laptops', price: 1299, category: 'Electronics', inStock: true},
    {id:3, name:'Headphones', description:'Noise-cancelling headphones', price: 199, category: 'Electronics', inStock: true},
    {id:4, name:'Smartwatch', description:'Fitness tracking smartwatch', price: 249, category: 'Electronics', inStock: true},
    {id:5, name:'Tablets', description:'Portable tablets for work and play', price: 499, category: 'Electronics', inStock: false},
    {id:6, name:'Cameras', description:'Digital cameras for photography enthusiasts', price: 899, category: 'Electronics', inStock: false},
  ]
  
  let filteredProducts = [...products];
  
  // Filter by category
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  await new Promise(resolve => setTimeout(resolve, 10));
  
  res.status(200).json({
    products: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      totalProducts: filteredProducts.length
    }
  });
}));

app.get('/api/products/search', asyncHandler(async (req, res) => {
  const products= [
    {id:1, name:'Mobiles', description:'Latest smartphones', price: 699, category: 'Electronics', inStock: true},
    {id:2, name:'Laptops', description:'High performance laptops', price: 1299, category: 'Electronics', inStock: true},
    {id:3, name:'Headphones', description:'Noise-cancelling headphones', price: 199, category: 'Electronics', inStock: true},
    {id:4, name:'Smartwatch', description:'Fitness tracking smartwatch', price: 249, category: 'Electronics', inStock: true},
    {id:5, name:'Tablets', description:'Portable tablets for work and play', price: 499, category: 'Electronics', inStock: false},
    {id:6, name:'Cameras', description:'Digital cameras for photography enthusiasts', price: 899, category: 'Electronics', inStock: false},
  ]
  
  const searchTerm = req.query.q;
  
  if (!searchTerm) {
    throw new ValidationError('Search query parameter "q" is required');
  }
  
  const searchResults = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  await new Promise(resolve => setTimeout(resolve, 10));
  
  res.status(200).json({
    searchTerm: searchTerm,
    results: searchResults,
    count: searchResults.length
  });
}));


app.get('/api/products/stats', asyncHandler(async (req, res) => {
  const products= [
    {id:1, name:'Mobiles', description:'Latest smartphones', price: 699, category: 'Electronics', inStock: true},
    {id:2, name:'Laptops', description:'High performance laptops', price: 1299, category: 'Electronics', inStock: true},
    {id:3, name:'Headphones', description:'Noise-cancelling headphones', price: 199, category: 'Electronics', inStock: true},
    {id:4, name:'Smartwatch', description:'Fitness tracking smartwatch', price: 249, category: 'Electronics', inStock: true},
    {id:5, name:'Tablets', description:'Portable tablets for work and play', price: 499, category: 'Electronics', inStock: false},
    {id:6, name:'Cameras', description:'Digital cameras for photography enthusiasts', price: 899, category: 'Electronics', inStock: false},
  ]
  
  // Count by category
  const categoryStats = {};
  products.forEach(p => {
    categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
  });
  
  // Stock statistics
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;
  
  await new Promise(resolve => setTimeout(resolve, 10));
  
  res.status(200).json({
    totalProducts: products.length,
    categoryStats: categoryStats,
    stockStats: {
      inStock: inStockCount,
      outOfStock: outOfStockCount
    }
  });
}));

app.get('/api/products/:id', asyncHandler(async (req, res)=> {
  const products= [
    {id:1, name:'Mobiles', description:'Latest smartphones', price: 699, category: 'Electronics', inStock: true},
    {id:2, name:'Laptops', description:'High performance laptops', price: 1299, category: 'Electronics', inStock: true},
    {id:3, name:'Headphones', description:'Noise-cancelling headphones', price: 199, category: 'Electronics', inStock: true},
    {id:4, name:'Smartwatch', description:'Fitness tracking smartwatch', price: 249, category: 'Electronics', inStock: true},
    {id:5, name:'Tablets', description:'Portable tablets for work and play', price: 499, category: 'Electronics', inStock: false},
    {id:6, name:'Cameras', description:'Digital cameras for photography enthusiasts', price: 899, category: 'Electronics', inStock: false},
  ]
  
  await new Promise(resolve => setTimeout(resolve, 10));

  const product= products.find(p=> p.id === Number(req.params.id));
  if(!product){
     throw new NotFoundError('Product not found'); 
  }
  
  res.status(200).json({product}) 
}))

app.post('/api/products', authMiddleware, validateProduct, asyncHandler(async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 10));

  const NewProduct= req.body;
  NewProduct.id = Date.now(); 
  res.status(201).json({message: 'Product created successfully', product: NewProduct});
}))

app.put('/api/products/:id', authMiddleware, validateProduct, asyncHandler(async (req, res)=> {
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const updatedProduct = req.body;
  updatedProduct.id= Number(req.params.id);
  res.status(200).json({message: 'Product updated successfully', product: updatedProduct});
}))

app.delete('/api/products/:id', authMiddleware, asyncHandler(async (req, res)=> {
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const productId = Number(req.params.id);
  res.status(200).json({message: `Product with ID ${productId} deleted successfully`});
}))

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    });
  }
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Invalid JSON format'
    });
  }
  
  // Default server error
  res.status(500).json({
    error: 'ServerError',
    message: 'Something went wrong on the server'
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // log a message when the server starts
});