const bcrypt = require('bcrypt')
const User = require('../models/user')
const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)


const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test.only('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))


    })
    test.only('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    test.only('creation fails with proper statuscode if username is less than a certain length', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'rr',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test.only('creation fails with proper statuscode if password is less than a certain length', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'asdfasf',
            name: 'Superuser',
            password: 'dd',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert(result.body.error.includes('password must be longer'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })



})



after(async () => {
    await mongoose.connection.close()
})

