import React from 'react'
import { describe, it, expect } from "@jest/globals" 
import { render } from '@testing-library/react'
import events from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';

import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { Application } from '../../src/client/Application'
import { ApplicationState } from '../../src/client/store';

const basename = '/hw/store';
const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);


describe('Тестирование хедера', () => {
    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {        
        const { getByTestId } = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        )

        const headerNavbarNav = getByTestId("navbar-nav")
        const navLinks = headerNavbarNav.querySelectorAll(".nav-link")
        expect(navLinks.length).toEqual(4)
    });

    it("название магазина в шапке должно быть ссылкой на главную страницу", () => {
        const { getByTestId } = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        )

        const headerBrand = getByTestId("link-to-main-page")
        expect(headerBrand.getAttribute("href") == "/hw/store/").toBeTruthy()
    });
});
