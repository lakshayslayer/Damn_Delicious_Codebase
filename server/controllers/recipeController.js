require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const categories = require("../../MongoDB Data/recipes.json");


///////////////////////////////////////////  HomePage Controller  //////////////////////////////////////

/**
 * GET /
 * Homepage 
*/

exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, thai, american, chinese };

    // console.log(Recipe.findOne({"name": "Chinese"}));

    res.render('index', { title: 'Damn Delicious', categories, food } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


exports.about = async(req, res) => {
  try {
    res.render('about', { title: 'Damn Delicious - About' } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

exports.contact = async(req, res) => {
  try {
    res.render('contact', { title: 'Damn Delicious - Contact' } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

/////////////////////////////////////////// Success Email Controller  //////////////////////////////////////

exports.success = async(req, res) => {
  try {
    res.render('success', { title: 'Contact - Success' } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

///////////////////////////////////////////  Explore Categories Controller  //////////////////////////////////////

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Damn Delicious - Categoreis', categories } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

///////////////////////////////////////////  Explore Category By ID Controller  //////////////////////////////////////

/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Damn Delicious - Categories', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

///////////////////////////////////////////  Explore Recipe Controller  //////////////////////////////////////

/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Damn Delicious - Recipe', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


///////////////////////////////////////////  Search Recipe Controller  //////////////////////////////////////

/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Damn Delicious - Search', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
  
}

///////////////////////////////////////////  Explore Latest Category Controller  //////////////////////////////////////

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Damn Delicious - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


///////////////////////////////////////////  Explore Random Category Controller  //////////////////////////////////////

/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Damn Delicious - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


///////////////////////////////////////////  Submit Recipe Controller - POST  //////////////////////////////////////

/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Damn Delicious - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}


////////////////////////////////////////////  Submit Recipe Controller - POST   ////////////////////////////////////


/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}


/////////////////////////////////////  More Features That Can Be Added To Project  //////////////////////////////////////

/*

Delete Recipe
async function deleteRecipe(){
  try {
    await Recipe.deleteOne({ name: 'New Recipe From Form' });
  } catch (error) {
    console.log(error);
  }
}
deleteRecipe();

*/

/*

Update Recipe
async function updateRecipe(){
  try {
    const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
    res.n; // Number of documents matched
    res.nModified; // Number of documents modified
  } catch (error) {
    console.log(error);
  }
}
updateRecipe();

*/


/////////////////////////////////////////////////  Dummy Data Example   ////////////////////////////////////////////

/*

// Used for inserting category data to mongoDB manually 

async function insertDymmyCategoryData(){
  try {
    await Category.insertMany([
      {
        "name": "Thai",
        "image": "thai-food.jpg"
      },
      {
        "name": "American",
        "image": "american-food.jpg"
      }, 
      {
        "name": "Chinese",
        "image": "chinese-food.jpg"
      },
      {
        "name": "Mexican",
        "image": "mexican-food.jpg"
      }, 
      {
        "name": "Indian",
        "image": "indian-food.jpg"
      },
      {
        "name": "Spanish",
        "image": "spanish-food.jpg"
      }
    ]);
  } catch (error) {
    console.log('err', + error)
  }
}

insertDymmyCategoryData();

*/


// Used for inserting recipe data to mongoDB manually 

/*
async function insertDymmyRecipeData(){
  try {
    await Recipe.insertMany([
      { 
        "name": "Recipe Name Goes Here",
        "description": `Recipe Description Goes Here`,
        "email": "recipeemail@raddy.co.uk",
        "ingredients": [
          "1 level teaspoon baking powder",
          "1 level teaspoon cayenne pepper",
          "1 level teaspoon hot smoked paprika",
        ],
        "category": "American", 
        "image": "southern-friend-chicken.jpg"
      },
      { 
        "name": "Recipe Name Goes Here",
        "description": `Recipe Description Goes Here`,
        "email": "recipeemail@raddy.co.uk",
        "ingredients": [
          "1 level teaspoon baking powder",
          "1 level teaspoon cayenne pepper",
          "1 level teaspoon hot smoked paprika",
        ],
        "category": "American", 
        "image": "southern-friend-chicken.jpg"
      },
    ]);
  } catch (error) {
    console.log('err', + error)
  }
}

insertDymmyRecipeData();

*/