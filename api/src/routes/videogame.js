const { Router } = require('express');

// Importo Videogame para generar un nuevo juego
const { Videogame , Genre}= require('../db');
const axios = require ('axios');
const router = Router();

const {
    API_KEY
  } = process.env;

/*
function removeTags(str) {
    if ((str===null) || (str===''))
        return '';
    else
        str = str.toString();    
    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
}
*/


router.get('/:idVideogame' , async (req,res,next) => {
    const {idVideogame} = req.params;
    if (!idVideogame) return res.status(404).send("No se especifico el id");
    console.log(idVideogame);
    try {
        if (idVideogame.length < 10) {
            // https://api.rawg.io/api/games/3328?key=88746d59f283472eafe6adbe231549ca
            let game = await axios.get(`https://api.rawg.io/api/games/${idVideogame}?key=${API_KEY}`);
            if (game) {
                game = { 
                    id: game.data.id,
                    name: game.data.name,
                    background_image: game.data.background_image,
                    description: game.data.description_raw , //removeTags(game.data.description),
                    released: game.data.released,
                    rating: game.data.rating,
                    platforms: game.data.platforms.map (element => (
                        element = {id: element.platform.id , name:element.platform.name})),
                    genres: game.data.genres.map (element => (element= {id:element.id , name:element.name}))
                }
                return res.send(game);
            }
            res.status(404).send("No existe el juego buscado");
        }
        else {
            console.log("Estoy buscando el juego en la DB")
            let game = await Videogame.findByPk(idVideogame, { include: Genre });
            if(game) {
                game = {
                    id: game.id,
                    name: game.name,
                    background_image: game.background_image,
                    description: game.description,
                    released: game.released,
                    rating: game.rating,
                    platforms: game.platforms,
                    genres: game.genres
                }
            //console.log(game);
                return res.send(game);
            }
           // res.status(404).send("No existe el juego buscado"); 
        }
    }
    catch (error) {
        res.status(404).send("No existe el juego buscado"); // aca funciona ver bien porque
        return next();
    }
}); 


router.post('/' , async (req,res,next) => {
    const {
        name,
        description,
        released,
        rating,
        platforms,
        genres,
        background_image
    } = req.body;
    //console.log(background_image)
    if (name && description  && platforms && genres) {
        try {
            const [game , created] = await Videogame.findOrCreate ({
                where: {
                    name
                },
                defaults: {
                    description,
                    released,
                    rating,
                    platforms,
                    background_image
                }
            })
            if (created)  {
                //console.log("Estoy aca y le voy a crear los generos")
                genres.forEach (async (element) => {
                    let genre = await Genre.findOne({ 
                        where: {name: element} 
                    });
                    await game.setGenres (genre.id);
                })
                let gameReturned = await Videogame.findByPk(game.id,{  
                    include:Genre 
                })
                return res.send(gameReturned);
            }
            else {
                console.log("El juego ya existe")
                return res.send({error:"El juego ya existe"});
            }
        }
        catch (error) {
            return next (error);
        }
    }
    res.status(500).send("Error");
});




module.exports = router;