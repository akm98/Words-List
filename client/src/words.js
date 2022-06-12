import { useState, useEffect } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';



function Words() {
	const [wordsList, setWordsList] = useState(null);
	const [error, seterror] = useState(null);
	const [editErr, SetEditErr] = useState(null);

	
	const [inputWordval, SetInputWordval] = useState("");
	const [updatedWordval, SetUpdatedWordval] = useState("");
	const [dropDownValue, SetDropDownValue] = useState("Select a word to delete");
	const [deleteId, SetDeleteId] = useState(null);
	const [editDropDownValue, SetEditDropDownValue] = useState("Select a word to edit");
	const [editId, SetEditId] = useState(null);
	const [enableEditBox, SetEnableEditBox] = useState(false);

	
	useEffect(() => {
		getWords();
	}, []);

	const getWords = () => {
		fetch("https://wordlistakm.herokuapp.com/words")
			.then((results) => results.json())
			.then((data) => {
				data.words.sort(function(a,b){
					return a.id < b.id ? -1 : 1;
				})
				setWordsList(data.words);
			});
	}
	const deleteWord = () =>{
		if(deleteId != null && deleteId>0){			
			axios
			.delete(`https://wordlistakm.herokuapp.com/words/delete?id=${deleteId}`, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json",
				},
			})
			.then((res) => {
				getWords();
				const temp = dropDownValue;
				SetDropDownValue("Select a word to delete");
			
				
				if(res.data.IsSuccess){
					alert(`${temp} deleted Successfully`);
					SetInputWordval("");
					SetDeleteId(null);
				}else{
					alert(`Couldn't delete ${temp}. Maybe Word was not found!`)
				}
			})
			.catch((error) => {
				alert("An error occured " + error);
			});
		}
	}
	const editWord = () =>{
		if(editId != null && editId>0){	
			const body = {
				id:editId,
				word:updatedWordval
			}		
			axios
			.post(`https://wordlistakm.herokuapp.com/words/edit`, body ,{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json",
				},
			})
			.then((res) => {
				getWords();
				const temp = updatedWordval;
				SetEditDropDownValue("Select a word to edit");
				SetEnableEditBox(false);
				
				if(res.data.IsSuccess){
					alert(`${temp} updated Successfully`);
					SetInputWordval("");
				}else{
					alert(`Couldn't update ${temp}. Maybe Word was not found!`)
				}
			})
			.catch((error) => {
				alert("An error occured " + error);
			});
		}
	}
	const addWord = () => {
		const body = {
			word: inputWordval,
		};
		axios
			.post(`https://wordlistakm.herokuapp.com/words/add`, body, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json",
				},
			})
			.then((res) => {
				getWords();
				SetInputWordval("");
			})
			.catch((error) => {
				alert("An error occured " + error);
			});
	}
	const onTextChange= (e) => {
		const value = e.target.value;
		SetInputWordval(value);
	}
	const onTextUpdate = (e) =>{
		const value = e.target.value;
		SetUpdatedWordval(value);
	}

	const validateInput = (mode)=> {
		if(mode == 0){
			//mode == 0 means add
			if (inputWordval.trim().length == 0) {
				seterror("Word should not be null");
				SetEditErr("");
			} else {
				addWord();
				seterror("");
			}
		}else{
			// mode == 1 means edit

			if (updatedWordval.trim().length == 0) {
				SetEditErr("Word should not be null");
				seterror("");
			} else {
				editWord();
				SetEditErr("");
			}
		}
		
	}
	const handleEditSelect = (e) => {
		const val = wordsList.filter((i) => i.id == e);
		
		SetEditId(e);
		SetEditDropDownValue(val[0].word);
		SetUpdatedWordval(val[0].word);
		SetEnableEditBox(true);
	}
	const handleSelect = (e) =>{
		const val = wordsList.filter((i) => i.id == e);
		
		SetDeleteId(e);
		SetDropDownValue(val[0].word);
	}
	return (
		<>
			<div className='container'>
				<div className='row' style={{ marginTop: 50 + "px" }}>
					<div className='col-md-6'>
						<ul>All words :</ul>
						{wordsList &&
							wordsList.map((each, i) => (
								<li key={i + 1}>
									{i + 1}. {each.word}
								</li>
							))}
					</div>

					<div className='col-md-6'>
						<div className='add'>
							<label>Add Word </label>
							<input
								type='text'
								value={inputWordval}
								onChange={(e) => onTextChange(e)}
								className='mx-2'
								style={{ width: 300 + "px" }}
							/>
							<button
								className='btn btn-primary'
								onClick={() => validateInput(0)}
							>
								Add
							</button>
							<div className='ErrMsg text-danger center'>{error}</div>
						</div>

						<div className='edit'>
							<label>Edit Word </label>
							<DropdownButton							
								title={editDropDownValue}
								id="dropdown-menu-align-right"
								onSelect={handleEditSelect}
									>
									{wordsList &&
									wordsList.map((each, i) => (
									<Dropdown.Item eventKey={each.id}>{each.word}</Dropdown.Item>
								))}
								</DropdownButton>
								{enableEditBox && 
								<>
								<input
								type='text'
								value={updatedWordval}
								onChange={(e) => onTextUpdate(e)}
								className='mx-2 mt-3'
								style={{ width: 300 + "px" }}
							/>
							<button
								className='btn btn-success'
								onClick={() => validateInput(1)}
							>
								Edit
							</button>
								</>
							}
							
							<div className='ErrMsg text-danger center'>{editErr}</div>
						</div>

						<div className='delete mt-3'>
							<label>Delete Word </label>
							<DropdownButton
								title={dropDownValue}
								id="dropdown-menu-align-right"
								onSelect={handleSelect}
									>
									{wordsList &&
									wordsList.map((each, i) => (
									<Dropdown.Item eventKey={each.id}>{each.word}</Dropdown.Item>
								))}
								</DropdownButton>
						
							<button
								className='btn btn-danger mt-3'
								onClick={() => deleteWord()}
								disabled = {deleteId === null}
							>
								Delete
							</button>
						</div>



					</div>
				</div>
			</div>
		</>
	);
}

export default Words;