import { currency_list } from "./dataTools";
import { Currencies } from "@/types/types";

// // arr = contractor?.currencies: string[]
// export function currencyDisplay(arr: string[]) {
//     const contractorCurrency: Currency[]= []

//     arr.forEach(i => {
//         currency_list.forEach(j => {
//             i === j.code && contractorCurrency.push(j)
//         })
//     })

//     return contractorCurrency
// }

export function totalSum(arr: number[]) {
    let total = 0

    arr.forEach(i => {
        total = i + total
    })

    return total
}

export function formatCurrency(num: number, code: string) {
    if (num.toString().length < 16) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(num)
    }
}