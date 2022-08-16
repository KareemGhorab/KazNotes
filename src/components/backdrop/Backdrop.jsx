import React from "react";
import { createPortal } from "react-dom";
import styles from "./Backdrop.module.css";

export default function Backdrop(props) {
	return (
		<>
			{createPortal(
				<div
					className={`${styles.backdrop} vh-100 overflow-hidden bg-black bg-opacity-75 
					position-absolute top-0 start-0 end-0 bottom-0 
					d-flex justify-content-center align-items-center`}
				>
					{props.children}
				</div>,
				document.getElementById("backdrop-root")
			)}
		</>
	);
}
