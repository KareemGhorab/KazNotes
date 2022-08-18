import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Modal from "../../components/modal/Modal";
import Backdrop from "../../components/backdrop/Backdrop";
import usePost from "../../hooks/usePost";
import useDelete from "../../hooks/useDelete";
import usePut from "../../hooks/usePut";
import useFetch from "../../hooks/useFetch";
import { useToken, useUser } from "../../context/userContext/UserContext";
import Note from "../../components/note/Note";
import { useRef } from "react";
import { useMemo } from "react";

const DEFAULT_INPUT_STATE = {
	note: {
		title: "",
		desc: "",
	},
	modalConfig: {
		modalTitle: "",
		submitBtnText: "",
	},
	new: false,
};

export default function Home() {
	const currentUser = useUser();
	const userToken = useToken();
	const [input, setInput] = useState(() => ({ ...DEFAULT_INPUT_STATE }));
	const [isInputting, setIsInputting] = useState(false);
	const [notes, setNotes] = useState(() => []);
	const [noteAddedData, , isLoadingNewNote, postNewNote] = usePost(
		"https://route-egypt-api.herokuapp.com/addNote"
	);
	const [notesData, , isLoadingNotesData, fetchNotesData] = useFetch(
		"https://route-egypt-api.herokuapp.com/getUserNotes"
	);

	useEffect(() => {
		fetchNotesData({
			headers: {
				Token: userToken,
				userID: currentUser._id,
			},
		});
	}, [currentUser._id, userToken, fetchNotesData, noteAddedData]);

	useEffect(() => {
		if (notesData?.message !== "success") {
			return;
		}
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
		setIsInputting(false);
		setInput((prevInput) => ({ ...prevInput, new: !prevInput.new }));
	};

	useEffect(() => {
		if (!input.note.title) {
			return;
		}
		console.log("post");
		postNewNote({
			title: input.note.title,
			desc: input.note.desc,
			userID: currentUser._id,
			token: userToken,
		});
	}, [input.new, postNewNote, currentUser._id, userToken]);

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
					{isLoadingNotesData ? (
						<div className="d-flex justify-content-center">
							<div className="h1">Loading...</div>
						</div>
					) : (
						<div className="row gy-4 mt-4">
							{notes.map((element) => {
								return (
									<div className="col-md-3" key={element.id}>
										<Note
											title={element.title}
											desc={element.desc}
											id={element.id}
										/>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</main>
		</>
	);
}
