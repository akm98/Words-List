const express = require("express");
const Sequelize = require("sequelize");
const app = express();
const port = 3001;
app.use(express.json());

const user = 'postgres'
const host = 'localhost'
const database = 'Juspay'
const password = '123456'
const pg_port = '5432'

const sequelize = new Sequelize(database, user, password, {
	host,
	pg_port,
	dialect: 'postgres',
	logging: false
  })
sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
  });

const WordsMaster = sequelize.define(
	"WordsMaster",{
		word: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	}
);
//sequelize.sync({ force: true });
console.log("All models were synchronized successfully.");

app.post("/words/add",async (req, res)=>{
	try{
		res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		const newWord = new WordsMaster(req.body);
		await newWord.save();
		res.json({ response:"Word added successfully" });
	}
	catch(error){
		console.log(error)
	}
})

app.get("/words", async (req, res) => {
	
	try {
		res.set('Access-Control-Allow-Origin', '*');
		const words = await WordsMaster.findAll();
		res.json({ words });
	} catch (error) {
		console.error(error);
	}
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
