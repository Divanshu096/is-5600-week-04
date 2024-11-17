const path = require('path')
const Products = require('./products');
const autoCatch = require('./lib/auto-catch')


// const { get } = require('http');
/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
*/
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  }
  
  /**
   * List all products
   * @param {object} req
   * @param {object} res
   */
  async function listProducts(req, res) {
    const { offset = 0, limit = 25 ,tag} = req.query

    try {
      res.json(await Products.list({
        offset: Number(offset),
        limit: Number(limit),
        tag,

      }))
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }


async function getProduct (req, res, next){
  const { id } = req.params

  try{
    const product = await Products.get(id)
    if (!product) {
      return next()
    }
    return res.json(product)
  }catch(err){

    res.status(500).json({error:err.message})
  }

}

async function createProduct(req, res){
  console.log('request body:', req.body)
  res.json(req.body)

}

async function deleteProduct(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id } = req.params;

  try {
    await Products.deleteProduct(id); // Call the delete method from products.js
    console.log(`Product with ID ${id} was deleted`);
    res.status(202).json({ message: `Product with ID ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function updateProduct(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id } = req.params;
  const productData = req.body; // The updated product data from the request

  try {
    await Products.update(id, productData); // Call the update method from products.js
    console.log(`Product with ID ${id} was updated`);
    res.status(200).json({ message: `Product with ID ${id} updated` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

  module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
  });
