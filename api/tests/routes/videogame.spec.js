/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Videogame , Genre , conn } = require('../../src/db.js');

const agent = session(app);
/*
const videogame = {
  name: 'Super Mario Bros',
};
*/

describe('Videogame routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  describe('POST /videogame', () => {
  it('responde con 200', function(){
  return agent.post('/videogame')
      .send({
        name: 'Super Mario Bros 1',
        description: 'Adventure game with Mario',
        platforms: ["PC","PlayStation 5"],
        genres: ["Action"]
      })
      .expect(200);
  });
  /*
  beforeEach(() => Videogame.sync({ force: true })
    .then(() => Videogame.create(videogame)));
  describe('POST /videogame', () => {
    it('should get 200', () =>
      agent.get('/videogame').expect(200)
    );
  });
  */
  it('setea correctamente el juego en la base de datos', function(){
    return agent.post('/videogame')
      .send({
        name: 'Super Mario Bros 2',
        description: 'Adventure game with Mario',
        platforms: ["PC","PlayStation 5"],
        genres: ["Action"]
      })
      .then(() => {
        return Videogame.findOne({
          where: {
            name: 'Super Mario Bros 2'
          },
          include: {
            model: Genre
          }
        });
      })
      .then(response => {
        expect(response.name).to.equal('Super Mario Bros 2');
        expect(response.description).to.equal('Adventure game with Mario');
      });
  }); 
});
after(()=> Videogame.sync({force:true}));
});
