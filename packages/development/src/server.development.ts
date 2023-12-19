import express from 'express'

const app = express()

function randomItem<ItemType = any>(itemsList: ItemType[]): ItemType {
  return itemsList[Math.round(Math.random() * (itemsList.length - 1))]
}

type User = {
  id: Number
  name: string
  email: string
  birthday?: Date
  createdAt?: Date
  updatedAt?: Date
}

type Role = "admin" | "editor" | "guest"

type Admin = User & {
  role: Role
}

app.get('/', (req, res) => {
  const admins: Admin[] = []

  const roles: Role[] = [
    'admin',
    'editor',
    'guest'
  ]

  for (let i = 1; i < 150; i++) {
    const role = randomItem<Role>(roles)

    admins.push({
      id: i,
      email: `admin.00${i}1@gmail.com`,
      name: `Admin Number ${i}`,
      role: role
    })
  }

  res.json(admins)
})

app.listen(3332, () => {
  console.log('Running Server!!!')
})
