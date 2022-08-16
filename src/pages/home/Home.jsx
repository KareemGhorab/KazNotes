import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Modal from "../../components/modal/Modal";
import Backdrop from "../../components/backdrop/Backdrop";
import usePost from "../../hooks/usePost";
import useFetch from "../../hooks/useFetch";
import { useUser } from "../../context/userContext/UserContext";
import Note from "../../components/note/Note";

const DEFAULT_INPUT_STATE = {
	note: {
		title: "",
		desc: "",
	},
	modalConfig: {
		modalTitle: "",
		submitBtnText: "",
	},
};

export default function Home() {
	const currentUser = useUser();
	const [input, setInput] = useState({ ...DEFAULT_INPUT_STATE });
	const [isInputting, setIsInputting] = useState(false);
	const [notes, setNotes] = useState([]);
	const [, , isLoadingNewNote, postNewNote] = usePost(
		"https://route-egypt-api.herokuapp.com/addNote"
	);
	const [notesData, , isLoadingNotesData, fetchNotesData] = useFetch(
		"https://route-egypt-api.herokuapp.com/getUserNotes"
	);

	useEffect(() => {
		fetchNotesData({
			headers: {
				Token: currentUser.token,
				userID: currentUser.user._id,
			},
		});
		console.log("Initial fetch");
	}, [fetchNotesData]);
	useEffect(() => {
		console.log(notesData);
		if (!notesData?.Notes) {
			return;
		}
		console.log("Notes fetch");
		setNotes(
			notesData.Notes.map((element) => ({
				id: element._id,
				title: element.title,
				desc: element.desc,
			}))
		);
	}, [notesData]);

	const inputHandler = (e) => {
		setInput((prevState) => ({
			...prevState,
			note: {
				...prevState.note,
				[e.target.name]: e.target.value,
			},
		}));
	};

	const submitHandler = (e) => {
		e.preventDefault();
		setNotes((prevNotes) => [...prevNotes, input.note]);
	};
	useEffect(() => {
		if (!input.note.title) {
			return;
		}
		postNewNote({
			title: input.note.title,
			desc: input.note.desc,
			userID: currentUser.user._id,
			token: currentUser.token,
		});

		setIsInputting(false);
	}, [currentUser.user._id, currentUser.token, notes, postNewNote]);

	const addNewNoteBtnHandler = () => {
		setInput((prevState) => ({
			...prevState,
			modalConfig: {
				modalTitle: "New Note",
				submitBtnText: "Add Note",
			},
		}));
	};
	useEffect(() => {
		if (input.modalConfig.modalTitle) {
			setIsInputting(true);
		}
	}, [input.modalConfig.modalTitle]);

	const cancelHandler = () => {
		setIsInputting(false);
	};
	useEffect(() => {
		if (!isInputting) {
			setInput({ ...DEFAULT_INPUT_STATE });
		}
	}, [isInputting]);

	return (
		<>
			{isInputting && (
				<Backdrop>
					<Modal
						titleInput={input.note.title}
						descInput={input.note.desc}
						inputHandler={inputHandler}
						onSubmit={submitHandler}
						onCancel={cancelHandler}
						{...input.modalConfig}
					/>
				</Backdrop>
			)}

			<main className="bg-sec vh-100 py-5">
				<div className="container">
					<div className="row justify-content-end">
						<button
							onClick={addNewNoteBtnHandler}
							className={`btn btn-info text-white ${styles.button}`}
						>
							Add note
						</button>
					</div>
					<div className="row gy-4 mt-4">
						{notes.map((element, index) => (
							<div className="col-lg-3">
								<Note key={index} title={element.title} desc={element.desc} />
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
