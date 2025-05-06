import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { IGeoLocation, IGeoLocationFromNavigator } from 'src/shared/dataModels/IGeoLocation';


const appSlice = createSlice({
    name: "appSlice",
    initialState: {
        loading: false,
        gettingTempToken: false,
        appBarPageTitle: null, // this is a string to display special text or other content.
        geoLocation: {
            IPv4: "",
            city: "Markham",
            country_code: "CA",
            country_name: "Canada",
            latitude: 43.6555,
            longitude: -79.3626,
            postal: "M5A",
            state: "Ontario"
        },
        geoLocationFromNavigator: null,
        openImportantNotificationDialog: false,
    },
    reducers: {
        /* any other state updates here */
        setOpenImportantNotificationDialog: (state, action: PayloadAction<boolean>) => {
            state.openImportantNotificationDialog = action.payload;
        },
        // setGeoLocation: (state, action: PayloadAction<IGeoLocation>) => {
        //     state.geoLocation.IPv4 = action.payload.IPv4;
        //     state.geoLocation.city = action.payload.city;
        //     state.geoLocation.country_code = action.payload.country_code;
        //     state.geoLocation.country_name = action.payload.country_name;
        //     state.geoLocation.latitude = action.payload.latitude;
        //     state.geoLocation.longitude = action.payload.longitude;
        //     state.geoLocation.postal = action.payload.postal;
        //     state.geoLocation.state =action.payload.state;
        // },
        // setGeoLocationFromNavigator: (state, action: PayloadAction<IGeoLocationFromNavigator>) => {
        //     state.geoLocationFromNavigator.accuracy = action.payload.accuracy;
        //     state.geoLocationFromNavigator.altitude = action.payload.altitude;
        //     state.geoLocationFromNavigator.altitudeAccuracy = action.payload.altitudeAccuracy;
        //     state.geoLocationFromNavigator.latitude = action.payload.latitude;
        //     state.geoLocationFromNavigator.longitude = action.payload.longitude;
        //     state.geoLocationFromNavigator.speed = action.payload.speed;
        // },
        setLoading: (state, action: PayloadAction<boolean>) =>{
            state.loading = action.payload;
        },
        setGettingTempToken: (state, action: PayloadAction<boolean>) =>{
            state.gettingTempToken = action.payload;
        },
    },
    // extraReducers: builder => {
    // }
});

export const { setLoading, setGettingTempToken, setOpenImportantNotificationDialog } = appSlice.actions;

export default appSlice.reducer;

