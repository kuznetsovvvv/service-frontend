// import type { UserRemoveSolid } from 'flowbite-svelte-icons';
import { writable } from 'svelte/store';

const userStore = writable({
  loggedIn: false,
  storephone: ''
});

export const userStatus = {
  subscribe: userStore.subscribe,
  setLoggedIn: (phone) => userStore.set({ loggedIn: true, storephone: phone }),
  reset: () => userStore.set({ loggedIn: false, storephone: '' })
};


// const userId = writable({
// id: ''
// });

// export const userIdStatus = {
//   subscribe: userId.subscribe,
//   addId: (Id) => userId.set({ id: Id }),
//   UserRemoveSolid: () => userId.set({ id: '' })
// };


