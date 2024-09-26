// atoms/instanceAtom.js
import { atom } from 'jotai';

// Persist the instanceId state in localStorage
const instanceIdAtom = atom(
    null, // Default value
    (get, set, update) => {
        set(instanceIdAtom, typeof update === 'function' ? update(get(instanceIdAtom)) : update);
        if (typeof window !== 'undefined') {
            localStorage.setItem('instanceId', String(get(instanceIdAtom)));
        }
    }
);

instanceIdAtom.onMount = (setAtom) => {
    if (typeof window !== 'undefined') {
        const savedValue = localStorage.getItem('instanceId');
        if (savedValue !== null) {
            setAtom(Number(savedValue)); // Convert to number if necessary
        }
    }
};

export default instanceIdAtom;
