import React from 'react';
import { useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import {createGame} from '../../store/actions'

import style from './FormAddGame.module.css';


export default function FormAddGame () {
    const {genres} = useSelector(state => state);
    // CONSULTAR SI PUEDO UTILIZAR LA RUTA PARA LAS PLATAFORMAS
    const platforms = ["PC","PlayStation 5","PlayStation 4","PlayStation 3","PlayStation 2","PlayStation",
    "PS Vita", "PSP","Xbox One","Xbox Series S/X","Xbox 360","Xbox","iOS","Android",
    "macOS","Classic Macintosh","Apple II","Linux","Nintendo Switch","Nintendo 3DS","Nintendo DS",
    "Nintendo DSi","Wii U","Wii","GameCube","Nintendo 64","Game Boy Advance","Game Boy Color","Game Boy",
    "SNES","NES","Atari 7800","Atari 5200","Atari 2600","Atari Flashback","Atari 8-bit","Atari ST",
    "Atari Lynx","Atari XEGS","Jaguar","Commodore / Amiga","Genesis","SEGA Saturn","SEGA CD",
    "SEGA 32X","SEGA Master System","Dreamcast","Game Gear","3DO","Neo Geo","Web"];
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        name: '',
        description: '',
        released: '',
        rating: '',
        platforms: [],
        genres: [],
        background_image:'',
        errors: {
            name: 'Nombre no puede estar vacio',
            description: 'Descripcion no puede estar vacio',
            released: '',
            rating: 'El rating debe ser un valor entre 0 y 5',
            platforms: 'Debe incluir al menos una plataforma',
            genres: 'Debe incluir al menos un genero',
          },
    });

    const [disabled , setDisabled] = useState(true);

    function controlError (errors, name , value) {
        switch (name) {
            case 'name': 
              errors.name = value.length > 0 ? '' : 'Nombre no puede estar vacio';
              break;
            case 'description': 
              errors.description = value.length > 0 ? '': 'Descripcion no puede estar vacio' ;
              break;
            case 'rating': 
              errors.rating = (value>= 0 && value<=5 )  ? '': 'El rating debe ser un valor entre 0 y 5' ;
              break;
            case 'platforms':
              errors.platforms = ((value && input.platforms[0] !== value ) || input.platforms[1] ) ? ''
              : "Debe incluir al menos una plataforma";
            break;
            case 'genres':
              errors.genres = ((value && input.genres[0] !== value)|| input.genres[1]) ? ''
              : "Debe incluir al menos un genero";
            break;
            default:
              break;
          }
          return errors;
    }

    
    function validate (errors) {
        let haveErrors = false;
        for (let clave in errors) {
            errors[clave].length > 0 && (haveErrors=true);
        }
        if (haveErrors) {setDisabled(true)}
        else {(setDisabled(false))}
    }
    


    function handleChange(e) {
        const { value, name , label} = e.target;
        let {errors} = input;

        //errors = controlError(errors , value , label);
        
        if(value === "genres" || value === "platforms") {
            setInput({
                ...input,
                [value]: input[value].includes(label)?input[value].filter(element => element !== label):[...input[value], label],
                errors
            });
            //console.log(input);
            //console.log(errors, value, label);
            errors = controlError(errors , value , label);
        }
        else{
            setInput({
                ...input,
                [name]: value,
                errors
            });
            errors = controlError(errors , name , value);
        }
        validate (input.errors);
      }

      function handleSubmit (e){
        e.preventDefault();
        console.log(input);
        dispatch(createGame(input));
        setInput({
            name: '',
            description: '',
            released: '',
            rating: '',
            platforms: [],
            genres: [],
            background_image: '',
            errors: {
                name: '',
                description: '',
                released: '',
                rating: '',
                platforms: '',
                genres: '',
              },
        })
    }

    return (
        <div className={style.grid}>
            <form onSubmit={handleSubmit} className={style.form}>
                <div className={style.container}>
                  <label className={style.label} >Nombre</label>
                  <input
                  className={style.input}
                  name="name"
                  type="text"
                  value={input.name}
                  onChange={handleChange}
                  placeholder="Nombre"></input>
                  {!input.errors.name ? null : <div className={style.error}>{input.errors.name}</div>}
                </div>
                <div className={style.container}>
                  <label className={style.label} >Descripción</label>
                  <textarea 
                  className={`${style.input} ${style.description}`}
                  name="description"
                  type="text"
                  value={input.description}
                  onChange={handleChange}
                  placeholder="Descripción"></textarea>
                  {!input.errors.description ? null : <div className={style.error}>{input.errors.description}</div>}
                </div>
                <div className={style.container}>
                  <label className={style.label} >Imagen URL</label>
                  <textarea 
                  className={`${style.input} ${style.bk}`}
                  name="background_image"
                  type="text"
                  value={input.background_image}
                  onChange={handleChange}
                  placeholder="URL de la imagen del juego"></textarea>
                </div>
                <div className={style.container}>
                  <label className={style.label} >Fecha de lanzamiento</label>
                  <input 
                  className={style.input}
                  type="date"
                  name="released"
                  value={input.released}
                  onChange={handleChange}></input>
                </div>
                <div className={style.container}>
                  <label className={style.label} >Rating</label>
                  <input 
                  className={style.input}
                  type="text"  //Ver si modifico esto por un number y en la base de datos por in Interger
                  name="rating"
                  value={input.rating}
                  onChange={handleChange}
                  placeholder="Rating"></input>
                  {!input.errors.rating ? null : <div className={style.error}>{input.errors.rating}</div>}
                </div>
                <div className={style.container}>
                  <label className={style.label} >Géneros</label>
                  <input 
                  className={style.input}
                  name="genres" 
                  multiple 
                  type="text" 
                //list="genres"
                  value = {input.genres}
                //onChange={handleChange}
                  placeholder = "Elija del recuadro los generos"
                  />
                  {!input.errors.genres ? null : <div className={style.error}>{input.errors.genres}</div>}
                  <select  className={style.select} multiple  value={input.genres} onClick={handleChange}>
                  {
                    genres.map ((element) => <option key = {element.id} value="genres" label={element.name}/>)
                  }
                  </select>
                </div>  
                <div className={style.container}>
                  <label className={style.label} >Plataformas</label>
                  <input
                  className={style.input}
                  type="text"
                  multiple
                  name="platforms"
                  //list="platforms"
                  value={input.platforms}
                  //onChange={handleChange}
                  placeholder = "Elija del recuadro las plataformas"
                  />
                  {!input.errors.platforms ? null : <div className={style.error}>{input.errors.platforms}</div>}
                  <select  className={style.select} multiple  value={input.platforms} onClick={handleChange}>
                  {
                    platforms.map ((element,index) => <option key = {index} value="platforms" label={element}/>)
                  }
                  </select>
                </div>
                <input className={style.btn} disabled={disabled} type="submit" value="Submit" />
            </form>
        </div>
    );
}
