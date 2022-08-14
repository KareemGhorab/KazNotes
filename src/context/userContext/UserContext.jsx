const { createContext, useState, useContext } = require("react");

const UserContext = createContext();
const SetUserContext = createContext();

export const useUser = () => useContext(UserContext);
export const useSetUser = () => useContext(SetUserContext);

const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	return (
		<UserContext.Provider value={user}>
			<SetUserContext.Provider value={setUser}>
				{children}
			</SetUserContext.Provider>
		</UserContext.Provider>
	);
};
