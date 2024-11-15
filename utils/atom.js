
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils'


export const videoArrayAtom = atomWithStorage('videoArrayAtom', [])

// export const videoArrayAtom = atom([]);

export const csvDataAtom = atomWithStorage('csvData',null)


