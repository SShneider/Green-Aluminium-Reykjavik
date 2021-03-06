
const {expect} = require('chai')
const db = require('../index')
const Transaction = db.model('transaction')
const User = db.model('user')
const Stocks = db.model('stocks')
describe('transactionTests', ()=>{
    let cody
    beforeEach(() => {
        return db.sync({force: true})
    })
    beforeEach(async () => {
        cody = await User.create({
          firstName: "Cody",
          lastName: "Pumpkin",
          email: 'cody@puppybook.com',
          password: 'Cd123456*'
        })
        await Stocks.create({
            ticker: "TSLA"
        })
    })
    it('Works and records correct date', async()=>{
        let createdTransaction
        try{
            createdTransaction = await Transaction.create({
                stockTicker: "TSLA",
                priceAtTransaction: 800.03,
                quantity: 0,
                userId: 1,
            })
        }catch(err){
            console.error(err)
        }
        expect(Math.floor((Date.parse(createdTransaction.dateOfTransaction))/1000)).to.be.equal(Math.floor(Date.now()/1000))
    })
    it('rejects quantities below 0', async()=>{
        try{
            let createdTransaction = await Transaction.create({
                stockTicker: "TSLA",
                priceAtTransaction: 800.03,
                quantity: 0,
                userId: 1,
            })
        }catch(err){
            expect(err).to.be.equal("Must be a valid amount")
        }
    })
    
})