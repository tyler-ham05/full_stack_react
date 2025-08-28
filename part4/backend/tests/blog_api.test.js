const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'hairy pooper',
        author: 'jk rowling',
        url: 'www.hairypooper.com',
        likes: 9,
    },
    {
        title: 'gundam wing',
        author: 'toonami',
        url: 'www.gundamwing.com',
        likes: 200,
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})


test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})


test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(e => e.title)
    assert.strictEqual(titles.includes('hairy pooper'), true)
})


test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'new blog',
        author: 'new blog writer',
        url: 'www.newblog.com',
        likes: 134,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    assert(titles.includes('new blog'))
})

test('a blog with no likes can be added with default value 0', async () => {
    const newerBlog = {
        title: 'newer blog',
        author: 'newer blog writer',
        url: 'www.newerblog.com',
    }

    await api
        .post('/api/blogs')
        .send(newerBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const likes = response.body.map(r => r.likes)
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(likes.includes(0))
})

test('missing title, post fails', async () => {
    const titleLessBlog = {
        author: 'john cena',
        url: 'awdkfjlk;dafwjkadwf',
        likes: 123123
    }
    await api
        .post('/api/blogs')
        .send(titleLessBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('missing url, post fails', async () => {
    const titleLessBlog = {
        author: 'john cena',
        title: 'awdkfjlk;dafwjkadwf',
        likes: 123123
    }
    await api
        .post('/api/blogs')
        .send(titleLessBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('delete request', async() => {
    const response = await api.get('/api/blogs')
    const entries = response.body.map(entry => entry.id)
    await api
        .delete(`/api/blogs/${entries[0]}`)
        .expect(204)
    const new_response = await api.get('/api/blogs')
    assert.strictEqual(new_response.body.length, initialBlogs.length - 1 )
})

test('put request', async() => {
    const response = await api.get('/api/blogs')
    const entries = response.body.map(entry => entry.id)
    const updatedPerson = {
        title: 'harry potter',
        author: 'jk prowling',
        url: 'www.jkprowling.com',
        likes: 123
    }
    await api
        .put(`/api/blogs/${entries[0]}`)
        .send(updatedPerson)
        .expect(200)
    const new_response = await api.get('/api/blogs')
    const titles = new_response.body.map(response => response.title)
    assert(titles.includes('harry potter'))
    assert(new_response.body.length === response.body.length)
})





after(async () => {
    await mongoose.connection.close()
})