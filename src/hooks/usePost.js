import { useState } from "react";
import axios from "axios";

const usePost = (url) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const post = (body) => {
		setIsLoading(true);
		axios
			.post(url, body)
			.then(({ data }) => {
				setData(data);
			})
			.catch((er) => {
				setError(er);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return [data, error, isLoading, post];
};

export default usePost;
