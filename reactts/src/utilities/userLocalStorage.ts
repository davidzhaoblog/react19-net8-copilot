export const loadUserState = () => {
    try {
        const serializedState = localStorage.getItem('userState');
        if (serializedState === null) {
            return undefined; // No state in localStorage
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Failed to load state from localStorage:', err);
        return undefined;
    }
};

export const saveUserState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('userState', serializedState);
    } catch (err) {
        console.error('Failed to save state to localStorage:', err);
    }
};