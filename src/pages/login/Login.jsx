import React, { useReducer, useEffect, useRef, useMemo } from "react";
import Joi from "joi";
import styles from "./Login.module.css";
import CustomAlert from "../../components/alert/CustomAlert";
import usePost from "../../hooks/usePost";
import { useCallback } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//#region Constants
const SCHEMA = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().required(),
});

const USER_INPUT_STATE_ACTIONS = {
	UPDATE_INPUT: "updateInput",
	RESET_INPUT: "resetInput",
};

const INPUT_NAMES = {
	EMAIL: "email",
	PASSWORD: "password",
};

const DEFAULT_INPUT = {
	[INPUT_NAMES.EMAIL]: "",
	[INPUT_NAMES.PASSWORD]: "",
};

const DEFAULT_FALSE = {
	[INPUT_NAMES.EMAIL]: false,
	[INPUT_NAMES.PASSWORD]: false,
};
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
			isBlurred: {
				...DEFAULT_FALSE,
			},
		}
	);
	const [isError, setisError] = useState(false);
	const buttonRef = useRef();
	const [data, , isLoading, rePost] = usePost(
		"https://route-egypt-api.herokuapp.com/signin"
	);
	const navigate = useNavigate();

	const isBlurredList = useMemo(
		() => Object.values(userInputState.isBlurred),
		[userInputState.isBlurred]
	);
	const validate = useCallback(() => {
		return isBlurredList.every((element) => element);
	}, [isBlurredList]);

	useEffect(() => {
		validate()
			? (buttonRef.current.disabled = false)
			: (buttonRef.current.disabled = true);
	}, [validate]);

	useEffect(() => {
		if (!data) return;

		if (data.message === "success") {
			navigate("/home");
		} else {
			setisError(true);
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
		setisError(false);
	};

	const submitHandler = (e) => {
		e.preventDefault();

		rePost(userInputState.input);

		dispatchUserInputState({ type: USER_INPUT_STATE_ACTIONS.RESET_INPUT });
	};
	//#endregion

	return (
		<>
			<div className="row justify-content-center align-items-center min-vh-100">
				<form onSubmit={submitHandler} className={`${styles.form}`} noValidate>
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
					</div>
					<button
						className="btn btn-dark w-100 text-main border-0 bg-sec"
						type="submit"
						ref={buttonRef}
						disabled
					>
						{isLoading ? "Loading..." : "Sign In"}
					</button>
					{isError && <CustomAlert message={"Invalid Email or Password"} />}
				</form>
			</div>
		</>
	);
}
