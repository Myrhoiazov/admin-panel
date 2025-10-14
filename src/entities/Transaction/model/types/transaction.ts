import { PaymentMethod } from "@/entities/PaymentMethod"
import { TransactionCategory } from "@/entities/TransactionCategory"
import { TransactionType } from "@/entities/TransactionType"


export interface Transaction {
    id?: string
    type?: TransactionType
    amount?: string
    category?: TransactionCategory
    description?: string
    date?: string
    paymentMethod?: PaymentMethod;
}