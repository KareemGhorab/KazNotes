import React from "react";
import styles from "./Modal.module.css";
import ReactDOM from "react-dom";

export default function Modal(props) {
	

	return (
		<>
			{ReactDOM.createPortal(
				<div
					className={`${styles["modal-back"]} vh-100 overflow-hidden bg-black bg-opacity-75 position-absolute top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center`}
				>
					Hello
				</div>,
				document.getElementById("modal-root")
			)}
		</>
	);
}
