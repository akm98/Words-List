import React from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Words() {
	const [wordsList, setWordsList] = React.useState(null);
	const [error, seterror] = React.useState(null);
	const [inputWordval, SetInputWordval] = React.useState("");


	React.useEffect(() => {
		getWords();
	}, []);

	function getWords(){
		fetch("/words")
			.then((results) => results.json())
			.then((data) => {
				setWordsList(data.words);				
			});
	}

	function addWord(){
		const body = {
			word:inputWordval
		};
		axios.post(`/words/add`, body ,{
			headers: {
				'Access-Control-Allow-Origin': '*',
				"Content-Type": "application/json",				
			  }
		})
      		.then(res => {
				getWords();
				SetInputWordval("");
			})
			.catch(error =>{
				alert("An error occured "+error);
			});

	}
	function onTextChange(e){
		const value = e.target.value;
		SetInputWordval(value);
	}

	function validateInput (){
		
		if(inputWordval.trim().length == 0 ){
			seterror("Word should not be null"+inputWordval);
		}else{
			addWord();
			seterror("");
		}
	}
	return (
		<>
		<div className="container">
			<div className="row" style={{marginTop: 50 + 'px'}}>
		<div className="col-md-6">
				<ul>All words :</ul> 
				{wordsList && wordsList.map((each,i) => <li key={i+1}>{i+1}. {each.word}</li>	)}	
		</div>

		<div className="col-md-6">
				
				<label>Add Word  </label>
					<input 
					type="text" 
					value={inputWordval}
					onChange = {(e)=>onTextChange(e)}
					className="mx-2"
					style={{width: 300 + 'px'}}
					/>
					<button className="btn btn-primary" onClick={()=>validateInput()}>Add</button>
					<div className="ErrMsg text-danger center">{error}</div>
				
				
		</div>

		</div>
		</div>
			
		</>
	);
}

export default Words;
