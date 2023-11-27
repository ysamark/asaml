const express = require('express')

const app = express()

app.get('/users', (req, res) => {
  const users = [
    {
      id: Math.random(),
      name: 'Sam',
      email: 'sam@bo'
    },
    {
      id: Math.random(),
      name: 'Sam',
      email: 'sam@bo'
    },
    {
      id: Math.random(),
      name: 'Sam',
      email: 'sam@bo'
    },
    {
      id: Math.random(),
      name: 'Sam',
      email: 'sam@bo'
    },
    {
      id: Math.random(),
      name: 'Sam',
      email: 'sam@bo'
    },
    {
      id: Math.random(),
      name: 'Sam',
      email: 'sam@bo'
    }
  ]

  res.json({ data: users })
})

app.listen(4400, () => console.log('Server is running'))
