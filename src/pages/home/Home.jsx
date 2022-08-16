import React from "react";
import { useReducer } from "react";
import styles from "./Home.module.css";

const reduceInputState = (state, action) => {};

export default function Home() {
	const [inputState, dispatchInputState] = useReducer(reduceInputState, {
		
	});

	return (
		<>
			<main className="bg-sec vh-100 py-5">
				<div className="container">
					<div className="row justify-content-end">
						<button
							onClick={() => {}}
							className={`btn btn-info text-white  ${styles.button}`}
						>
							Add note
						</button>
					</div>
				</div>
			</main>
		</>
	);
}
