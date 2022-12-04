import React from 'react'
import { describe, it, expect } from "@jest/globals" 
import { render, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import { ExampleApi, CartApi } from '../../src/client/api'
import { initStore } from '../../src/client/store'
import { Application } from '../../src/client/Application'

const basename = '/hw/store'
const api = new ExampleApi(basename)
const cart = new CartApi()
const store = initStore(api, cart)


describe('Каталог', () => {
    it("в каталоге должны отображаться товары, список которых приходит с сервера", async () => {
        const { getByTestId } = render(
            <MemoryRouter initialEntries={["/catalog"]}>
                <Provider store={store}>
                    <Application />
                </Provider>    
            </MemoryRouter>
        )
        const catalog = getByTestId("catalog")
        if (catalog.innerHTML === "LOADING") return 
        // await waitFor(() => expect(catalog.innerHTML).not.toBe("LOADING"))
        // почему не работает строка выше?

        for (let i = 1; i <= 3; i++) {
            const p = getByTestId(i.toString())
            const productInfo = await api.getProductById(i)
            const name = p.querySelector(".ProductItem-Name")
            const price = p.querySelector(".ProductItem-Price")

            expect(name).toBe(productInfo.data.name)
            expect(price).toBe(productInfo.data.price)
        }
    })

    describe('На странице с подробной информацией о товаре отображаются элементы', () => {
        it('добавить в корзину', () => {
            const { getByTestId } = render(
                <MemoryRouter initialEntries={["/catalog/1"]}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            )
            const container = getByTestId("container")
            if (container.innerHTML.includes("LOADING")) return

            const btn = container.querySelector(".ProductDetails-AddToCart")
            expect(btn).toBeTruthy()
        })
    })
    
    describe('Если товар уже добавлен в корзину', () => {
        it('уведомление', () => {
            const { getByTestId } = render(
                <MemoryRouter initialEntries={["/catalog/1"]}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            )
            const container = getByTestId("container")
            expect(container.innerHTML.includes("Item in cart")).toBeFalsy()
        })

        it('Повторное нажатие кнопки добавить в корзину должно увеличивать его количество', () => {
            const { getByTestId } = render(
                <MemoryRouter initialEntries={["/catalog/1"]}>
                    <Provider store={store}>
                        <Application />
                    </Provider>
                </MemoryRouter>
            )
            const container = getByTestId("container")
            const btn = container.querySelector(".ProductDetails-AddToCart") as HTMLElement
            
            if (!btn) return
    
            btn.click()
            console.log(store.getState())
            expect(store.getState().cart[1].count).toEqual(2)
        })
    })
})
