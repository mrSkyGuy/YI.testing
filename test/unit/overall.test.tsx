import React from 'react'
import { describe, it, expect } from "@jest/globals" 
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { Application } from '../../src/client/Application'

const basename = '/hw/store';
const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);


describe('Общие требования', () => {
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

    it("на ширине меньше 576px навигационное меню должно скрываться за гамбургер", () => {
        const { getByTestId } = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        )

        const headerNavbar = getByTestId("navbar-nav")
        expect(headerNavbar.parentElement?.classList.contains("navbar-collapse")).toBeTruthy()
    })

    it("при выборе элемента из меню гамбургера, меню должно закрываться", () => {
        const { getByTestId } = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </BrowserRouter>
        )
        const burger = getByTestId("burger-button");
        const navbar = getByTestId("navbar-nav");
        const navbarWrapper = navbar.parentElement;
        const navItem = navbar.querySelector(".nav-link") as HTMLElement;

        expect(navbarWrapper?.classList).toContain("collapse");
        burger.click()
        expect(navbarWrapper?.classList).not.toContain("collapse");
        if (navItem) {
            navItem.click()
            expect(navbarWrapper?.classList).toContain("collapse");
        }
    })
});
