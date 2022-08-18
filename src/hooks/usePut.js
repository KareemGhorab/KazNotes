import axios from "axios";
import { useCallback } from "react";
import { useEffect, useState } from "react";

const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const put = useCallback(
		(options) => {
			setIsLoading(true);
			axios
				.put(url, options)
				.then(({ data }) => {
					setData(data);
				})
				.catch((er) => {
					setError(er);
				})
				.finally(() => {
					setIsLoading(false);
				});
		},
		[url]
	);

	useEffect(() => {
		put();
	}, [put]);

	return [data, error, isLoading, put];
};

export default useFetch;
