import { createSlice }  from "@reduxjs/toolkit"

const uiSlice = createSlice({
    name: "ui",
    initialState:{
        language: "es",
        currency: "mxn",
        modalIsOpen: false,
        selectedItem: {},
        cartListIsOpen: false,
        cartItems: [],
        order: {},
    },
    reducers:{
        toggleLanguage: (state) => {
            state.language = state.language === "es" ? "en" : "es";
        },
        toggleCurrency: (state) => {
            state.currency = state.currency === "mxn" ? "usd" : "mxn";
        },
        setCartItems: (state, action) => {
            state.cartItems = [...state.cartItems, action.payload];
        },
        toggleCarModal: (state) => {
            state.modalIsOpen = !state.modalIsOpen;
        },
        selectItem: (state, action) => {
            state.selectedItem = action.payload;
        },
        toggleCartList: (state) => {
            state.cartListIsOpen = !state.cartListIsOpen;
        },

    }
})

export const uiActions = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
