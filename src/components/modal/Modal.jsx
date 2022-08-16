import React from "react";
import Card from "react-bootstrap/Card";

function Modal({
	modalTitle,
	submitBtnText,

	titleInput,
	descInput,
	inputHandler,

	onSubmit,
	onCancel,
}) {
	return (
		<Card
			style={{
				width: "25rem",
				color: "black",
				paddingRight: "1rem",
				paddingLeft: "1rem",
			}}
		>
			<Card.Body>
				<Card.Title>{modalTitle || "Title"}</Card.Title>
				<Card.Text>
					<input
						className="form-control mb-3"
						name="title"
						type="text"
						value={titleInput}
						onChange={inputHandler}
						placeholder="Title"
					/>
					<textarea
						className="form-control"
						name="desc"
						cols="30"
						rows="10"
						value={descInput}
						onChange={inputHandler}
						placeholder="Description"
					></textarea>
				</Card.Text>
				<footer className="d-flex justify-content-end">
					<button
						type="submit"
						className="btn btn-info text-light me-3"
						onClick={onSubmit}
					>
						{submitBtnText || "Submit"}
					</button>

					<button className="btn btn-danger text-light" onClick={onCancel}>
						Cancel
					</button>
				</footer>
			</Card.Body>
		</Card>
	);
}

export default Modal;
