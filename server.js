require("dotenv").config();
const express = require("express");
const Sequelize = require("sequelize");
const app = express();
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
	//server static content
	//npm run build
	app.use(express.static(path.join(__dirname, "client/build")));
  }
  

const sequelize = new Sequelize(process.env.DATABASE_URL,{
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			rejectUnauthorized: false
		}
	}
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