import React from "react";
import StringOperations from "../../utils/stringOperations";

export default function CustomAlert({ message }) {
	if (typeof message === "string") {
		message = StringOperations.capitalizeFirstLetter(
			message
				.replace(new RegExp("_", "gi"), " ")
				.replace(new RegExp('"', "gi"), "")
				.replace(new RegExp("not allowed to be empty", "gi"), "required")
				.replace(new RegExp("Citizen validation failed: email: ", "gi"), "")
		);
	}

	return (
		<div className={`alert alert-danger mb-0`} role="alert">
			{message}
		</div>
	);
}
