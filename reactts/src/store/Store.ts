import { configureStore } from '@reduxjs/toolkit'
// import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistStore } from 'reduxjs-toolkit-persist'
// import storage from 'reduxjs-toolkit-persist/lib/storage' // defaults to localStorage for web

import { reducers } from './CombinedReducers'
import { errorLogApi } from '@/apiClients/errorLogApi'

// const persistConfig = {
//     key: 'root',
//     //storage,
//     blacklist: blacklist,
// }

// const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types, Alert and whenever showAlert is called.
            // ignoredActions: [
            //     FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
            // ],
            // // Ignore these field paths in all actions
            // ignoredActionPaths: ['app.alert.buttons[0].handler'],
            //   // Ignore these paths in the state
            //   ignoredPaths: ['items.dates']
            // persist/PERSIST is from 'redux-persist/integration/react'
        }
    })
    .concat(errorLogApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;
// export const persistor = persistStore(store);
export default store