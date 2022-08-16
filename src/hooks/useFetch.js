import axios from "axios";
import { useCallback } from "react";
import { useEffect, useState } from "react";

const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const fetchApi = useCallback((options) => {
		setIsLoading(true);
		axios
			.get(url, options)
			.then(({ data }) => {
				setData(data);
			})
			.catch((er) => {
				setError(er);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [url]);

	useEffect(() => {
		fetchApi();
	}, [fetchApi]);

	return [data, error, isLoading, fetchApi];
};

export default useFetch;
