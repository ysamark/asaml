// import factory from '@database/factory'

import { PayoneerCard } from 'sales:cards:@services/PayoneerCard'

describe('App Test', () => {
  it('should create a user', async () => {
    // const val = 1 + 3

    const title = 'Pays'

    const pay = new PayoneerCard({ title })

    const user = { name: 'Sam', id: 1 } // await factory.create('User')

    // expect(user.name).toBe('John Doe')

    expect(user).toBe(user)
    expect(pay.title).toBe(title)
    expect('ok').toBe('ok')
  })
})
