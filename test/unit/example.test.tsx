import React from 'react'
import { describe, it } from "@jest/globals" 
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

const baseDOM = (
    <BrowserRouter basename={basename}>
        <Provider store={store}>
            <Application />
        </Provider>
    </BrowserRouter>
)


describe('Тестирование хедера', () => {
    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
        const { container } = render(baseDOM)
    });
});
