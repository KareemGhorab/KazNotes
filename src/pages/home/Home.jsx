import React, { useState, useEffect } from "react";
import { useReducer } from "react";
import Modal from "../../components/modal/Modal";
import { useUser } from "../../context/userContext/UserContext";
import usePost from "../../hooks/usePost";
import styles from "./Home.module.css";

const INPUT_ACTIONS = {
	SET_IS_INPUTTING: "isInputting",
	UPDATE_INPUT: "updateInput",
};

const reduceInputState = (state, action) => {};

export default function Home() {
	const currentUser = useUser();
	const [notes, setNotes] = useState([]);
	const [data, , isLoading, reAdd] = usePost(
		"https://route-egypt-api.herokuapp.com/addNote"
	);
	const [inputState, dispatchInputState] = useReducer(reduceInputState, {
		input: {},
		isInputting: false,
	});

	useEffect(() => {
		if (notes.length === 0) {
			return;
		}
		reAdd(notes.at(-1));
	}, [notes, reAdd]);

	const addNote = (note) => {
		setNotes((prevNotes) => [...prevNotes, note]);
	};

	const addNoteHandler = () => {};

	return (
		<>
			<main className="bg-sec vh-100 py-5">
				<div className="container">
					<div className="row justify-content-end">
						<button
							onClick={addNoteHandler}
							className={`btn btn-info text-white  ${styles.button}`}
						>
							Add note
						</button>
						{inputState.isInputting && <Modal />}
					</div>
				</div>
			</main>
		</>
	);
}
