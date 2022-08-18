import axios from "axios";
import { useCallback } from "react";
import { useEffect, useState } from "react";

const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const deleteApi = useCallback(
		(options) => {
			setIsLoading(true);
			axios
				.delete(url, options)
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
		deleteApi();
	}, [deleteApi]);

	return [data, error, isLoading, deleteApi];
};

export default useFetch;
