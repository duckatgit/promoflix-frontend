export const safeLocalStorage = typeof window !== "undefined" ? localStorage : {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
};

// Now you can use safeLocalStorage without errors