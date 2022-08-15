import React, { useReducer, useEffect, useRef, useMemo } from "react";
import Joi from "joi";
import styles from "./Register.module.css";
import CustomAlert from "../../components/alert/CustomAlert";
import usePost from "../../hooks/usePost";
import { useCallback } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//#region Constants
const SCHEMA = Joi.object({
	first_name: Joi.string().alphanum().required(),
	last_name: Joi.string().alphanum().required(),
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ["com", "net"] },
		})
		.required(),
	password: Joi.string()
		.pattern(new RegExp(".{8,}"))
		.pattern(new RegExp("[0-9]+"))
		.pattern(new RegExp("[a-z]+"))
		.pattern(new RegExp("[A-Z]+"))
		.pattern(new RegExp("[^A-Za-z0-9]+"))
		.required(),
	age: Joi.string().required(),
});

const USER_INPUT_STATE_ACTIONS = {
	UPDATE_INPUT: "updateInput",
	RESET_INPUT: "resetInput",
};

const INPUT_NAMES = {
	FIRST_NAME: "first_name",
	LAST_NAME: "last_name",
	EMAIL: "email",
	PASSWORD: "password",
	AGE: "age",
};

const DEFAULT_INPUT = {
	[INPUT_NAMES.FIRST_NAME]: "",
	[INPUT_NAMES.LAST_NAME]: "",
	[INPUT_NAMES.EMAIL]: "",
	[INPUT_NAMES.PASSWORD]: "",
	[INPUT_NAMES.AGE]: "",
};

const DEFAULT_FALSE = {
	[INPUT_NAMES.FIRST_NAME]: false,
	[INPUT_NAMES.LAST_NAME]: false,
	[INPUT_NAMES.EMAIL]: false,
	[INPUT_NAMES.PASSWORD]: false,
	[INPUT_NAMES.AGE]: false,
};

const PASSWORD_ERROR = (
	<>
		<span>Password must contain:</span>
		<ul>
			<li>At least eight characters</li>
			<li>At least one special character</li>
			<li>At least one lowercase letter</li>
			<li>At least one uppercase letter</li>
			<li>At least one number</li>
		</ul>
	</>
);
//#endregion

//#region Helper functions
const validateInput = (userInput, inputName) => {
	const validationResponse = SCHEMA.validate(userInput, { abortEarly: false });
	const errors = validationResponse.error?.details.filter((element) =>
		element.message.includes(inputName)
	);

	return errors?.at(0)?.message ?? "";
};
//#endregion

//#region Reduce functions
const reduceUserInputState = (state, action) => {
	switch (action.type) {
		case USER_INPUT_STATE_ACTIONS.UPDATE_INPUT:
			const newState = {
				input: {
					...state.input,
					[action.payload.key]: action.payload.value,
				},
			};
			const err = validateInput(newState.input, action.payload.key);
			return {
				...state,
				...newState,
				error: {
					...state.error,
					[action.payload.key]: err,
				},
				isBlurred: {
					...state.isBlurred,
					[action.payload.key]: true,
				},
			};
		case USER_INPUT_STATE_ACTIONS.RESET_INPUT:
			return {
				...state,
				input: {
					...DEFAULT_INPUT,
				},
				isBlurred: {
					...DEFAULT_FALSE,
				},
			};
		default:
			return state;
	}
};
//#endregion

export default function Register() {
	//#region hooks
	const [userInputState, dispatchUserInputState] = useReducer(
		reduceUserInputState,
		{
			input: {
				...DEFAULT_INPUT,
			},
			error: {
				...DEFAULT_INPUT,
			},
			isBlurred: {
				...DEFAULT_FALSE,
			},
		}
	);
	const [mainErrorMsg, setMainErrorMsg] = useState("");
	const buttonRef = useRef();
	const [data, , isLoading, rePost] = usePost(
		"https://route-egypt-api.herokuapp.com/signup"
	);
	const navigate = useNavigate();

	const errorList = useMemo(
		() => Object.values(userInputState.error),
		[userInputState.error]
	);
	const isBlurredList = useMemo(
		() => Object.values(userInputState.isBlurred),
		[userInputState.isBlurred]
	);
	const validate = useCallback(() => {
		return (
			isBlurredList.every((element) => element) &&
			errorList.every((element) => element.length === 0)
		);
	}, [isBlurredList, errorList]);

	useEffect(() => {
		validate()
			? (buttonRef.current.disabled = false)
			: (buttonRef.current.disabled = true);
	}, [validate]);

	useEffect(() => {
		if (!data) return;

		if (data.message === "success") {
			navigate("/login");
		} else {
			setMainErrorMsg(data.message);
		}
	}, [data, navigate]);
	//#endregion

	//#region functions
	const updateInput = (key, value) => {
		dispatchUserInputState({
			type: USER_INPUT_STATE_ACTIONS.UPDATE_INPUT,
			payload: { key, value },
		});
	};

	const inputHandler = (e) => {
		updateInput(e.target.name, e.target.value);
		setMainErrorMsg("");
	};

	const submitHandler = (e) => {
		e.preventDefault();

		rePost(userInputState.input);

		dispatchUserInputState({ type: USER_INPUT_STATE_ACTIONS.RESET_INPUT });
	};
	//#endregion

	return (
		<>
			<div className="container">
				<div className="row justify-content-center align-items-center min-vh-100">
					<form
						onSubmit={submitHandler}
						className={`${styles.form}`}
						noValidate
					>
						<div className="row mb-3 gy-3">
							<div className="col-md-6">
								<input
									value={userInputState.input[INPUT_NAMES.FIRST_NAME]}
									autoComplete="off"
									onChange={inputHandler}
									onBlur={inputHandler}
									className={`form-control ${
										userInputState.isBlurred[INPUT_NAMES.FIRST_NAME] &&
										(userInputState.error[INPUT_NAMES.FIRST_NAME]
											? "is-invalid"
											: "is-valid")
									}`}
									type="text"
									placeholder="Enter First Name"
									name="first_name"
								/>
								{userInputState.error[INPUT_NAMES.FIRST_NAME] && (
									<CustomAlert
										message={userInputState.error[INPUT_NAMES.FIRST_NAME]}
									/>
								)}
							</div>
							<div className="col-md-6">
								<input
									value={userInputState.input[INPUT_NAMES.LAST_NAME]}
									autoComplete="off"
									onChange={inputHandler}
									onBlur={inputHandler}
									className={`form-control ${
										userInputState.isBlurred[INPUT_NAMES.LAST_NAME] &&
										(userInputState.error[INPUT_NAMES.LAST_NAME]
											? "is-invalid"
											: "is-valid")
									}`}
									type="text"
									placeholder="Enter Last Name"
									name="last_name"
								/>
								{userInputState.error[INPUT_NAMES.LAST_NAME] && (
									<CustomAlert
										message={userInputState.error[INPUT_NAMES.LAST_NAME]}
									/>
								)}
							</div>
						</div>
						<div className="mb-3">
							<input
								value={userInputState.input[INPUT_NAMES.EMAIL]}
								autoComplete="off"
								onChange={inputHandler}
								onBlur={inputHandler}
								className={`form-control ${
									userInputState.isBlurred[INPUT_NAMES.EMAIL] &&
									(userInputState.error[INPUT_NAMES.EMAIL]
										? "is-invalid"
										: "is-valid")
								}`}
								type="email"
								placeholder="Enter Your Email"
								name="email"
							/>
							{userInputState.error[INPUT_NAMES.EMAIL] && (
								<CustomAlert
									message={userInputState.error[INPUT_NAMES.EMAIL]}
								/>
							)}
						</div>
						<div className="mb-3">
							<input
								value={userInputState.input[INPUT_NAMES.AGE]}
								autoComplete="off"
								onChange={inputHandler}
								onBlur={inputHandler}
								className={`form-control ${
									userInputState.isBlurred[INPUT_NAMES.AGE] &&
									(userInputState.error[INPUT_NAMES.AGE]
										? "is-invalid"
										: "is-valid")
								}`}
								type="number"
								placeholder="Enter Your Age"
								name="age"
							/>
							{userInputState.error[INPUT_NAMES.AGE] && (
								<CustomAlert message={userInputState.error[INPUT_NAMES.AGE]} />
							)}
						</div>
						<div className="mb-3">
							<input
								value={userInputState.input[INPUT_NAMES.PASSWORD]}
								autoComplete="off"
								onChange={inputHandler}
								onBlur={inputHandler}
								className={`form-control ${
									userInputState.isBlurred[INPUT_NAMES.PASSWORD] &&
									(userInputState.error[INPUT_NAMES.PASSWORD]
										? "is-invalid"
										: "is-valid")
								}`}
								type="password"
								placeholder="Enter Your Password"
								name="password"
							/>
							{userInputState.error[INPUT_NAMES.PASSWORD] && (
								<CustomAlert message={PASSWORD_ERROR} />
							)}
						</div>
						<button
							className="btn btn-dark w-100 text-main border-0 bg-sec"
							type="submit"
							ref={buttonRef}
							disabled
						>
							{isLoading ? "Loading..." : "Sign Up"}
						</button>
						{mainErrorMsg && <CustomAlert message={mainErrorMsg} />}
					</form>
				</div>
			</div>
		</>
	);
}
