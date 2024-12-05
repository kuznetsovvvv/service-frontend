import { writable } from 'svelte/store';

const userStore = writable({
  loggedIn: false,
  storephone: '',
  who:''
});

export const userStatus = {
  subscribe: userStore.subscribe,
  setLoggedIn: (phone,Who) => userStore.set({ loggedIn: true, storephone: phone,who: Who}),
  reset: () => userStore.set({ loggedIn: false, storephone: '', who: '' }),
};


