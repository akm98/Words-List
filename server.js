require("dotenv").config();
const express = require("express");
const Sequelize = require("sequelize");
const app = express();
const pool = require("./dbconfig");
const port = process.env.PORT || 5000;
app.use(express.json());

console.log("env",process.env.DATABASE_URL,process.env.PG_DATABASE,process.env.PG_USER, process.env.PG_PASSWORD,process.env.PG_HOST,process.env.PG_PORT)

const sequelize = new Sequelize("dpgjcamtou9ve", "urnuwnvhsmcdkz", "bf695b757ef7c8c1636a4105f436d56a5e8ecaaf96aafa281848e8ed27e827c6", {
	host:"ec2-3-248-121-12.eu-west-1.compute.amazonaws.com",
	port:"5432",
	dialect: 'postgres',
	// define: {		
	// 	createdAt: 'createdat',
	// 	updatedAt: 'updatedat',
	// }
  })

sequelize.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
  });

const WordsMaster = sequelize.define(
	"WordsMasters",{
		word: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "WordsMasters",
	}
);
//sequelize.sync({ force: true });
console.log("All models were synchronized successfully.");

app.post("/words/add",async (req, res)=>{
	try{
		res.set('Access-Control-Allow-Origin', '*');
		const newWord = new WordsMaster(req.body);
		await newWord.save();
		res.json({ response:"Word added successfully" });
	}
	catch(error){
		console.log(error)
	}
})

app.delete("/words/delete",async (req, res)=>{
	res.set('Access-Control-Allow-Origin', '*');
	

	const id = req.query.id;
	WordsMaster.destroy({
		where: { id: id }
	}).then(num => {
		if (num == 1) {
		  res.send({
			message: "Word was deleted successfully!",
			IsSuccess: true
		  });
		} else {
		  res.send({
			message: `Cannot delete Word with id=${id}. Maybe Word was not found!`,
			IsSuccess: false
		  });
		}
	  })
	  .catch(err => {
		res.status(500).send({
		  message: "Could not delete Word with id=" + id,
		  IsSuccess: false
		});
	});

	
})

app.post("/words/edit",async (req, res)=>{
	res.set('Access-Control-Allow-Origin', '*');
	

	const id = req.body.id;
	const word = req.body.word;
	WordsMaster.update(req.body, {
		where: { id: id }
	}).then(num => {
		if (num == 1) {
		  res.send({
			message: "Word was updated successfully!",
			IsSuccess: true
		  });
		} else {
		  res.send({
			message: `Cannot updated Word with id=${id}. Maybe Word was not found!`,
			IsSuccess: false
		  });
		}
	  })
	  .catch(err => {
		res.status(500).send({
		  message: "Could not updated Word with id=" + id,
		  IsSuccess: false
		});
	});

	
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
app.listen(port, () => console.log(`App listening on port ${port}!`));