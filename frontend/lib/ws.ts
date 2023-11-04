import { useContext } from 'react';
import { AppContext } from './Context';

export function useSocket() {
	const { socket, setSocket } = useContext(AppContext);

	return [socket, setSocket];
}
