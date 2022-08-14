import { useEffect } from "react";
import { useState } from "react";

const useLocalStorage = (key) => {
	const [value, setValue] = useState("");

	useEffect(() => {
		localStorage.setItem(key, value);
	}, [key, value]);

	const set = (value) => {
		setValue(JSON.stringify(value));
	};
	const get = () => JSON.parse(localStorage.getItem(key));

	return [set, get];
};

export default useLocalStorage;
