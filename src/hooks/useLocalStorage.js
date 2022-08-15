import { useEffect, useState } from "react";

const getStoredValue = (key, value) => {
	const v = localStorage.getItem(key);
	if (v) return JSON.parse(v);

	if (value instanceof Function) return value();
	return value;
};

const useLocalStorage = (key, initialValue) => {
	const [value, setValue] = useState(() => {
		return getStoredValue(key, initialValue);
	});

	useEffect(() => {
		if (!value) {
			localStorage.setItem(key, "");
			return;
		}
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.log(error);
		}
	}, [key, value]);

	return [value, setValue];
};

export default useLocalStorage;
