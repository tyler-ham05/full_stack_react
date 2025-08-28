const blog = require("../models/blog");

const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    var sum = 0
    blogs.forEach(blog => {
        sum += blog.likes
    });
    return sum
}

const favoriteBlog = (blogs) => {
    var favorite = blogs[0]
    blogs.forEach(blog => {
        if (blog.likes > favorite.likes){
            favorite = blog
        }
    });
    return favorite
}

const mostBlogs = (blogs) => {
    blogMap = new Map()
    blogs.forEach(blog => {
        if (blogMap.has(blog.author)){
            blogMap.set(blog.author, blogMap.get(blog.author) + 1)
        }
        else{
            blogMap.set(blog.author,1)
        }
    });
    
    try {
        let [key, val] = [...blogMap.entries()].reduce((max, entry) =>
        entry[1] > max[1] ? entry : max
        )
        return {
            author: key,
            blogs: val
        }
    } catch (error) {
        return undefined
    }
}

const mostLikes = (blogs) => {
    blogMap = new Map()
    blogs.forEach(blog => {
        if (blogMap.has(blog.author)){
            blogMap.set(blog.author, blogMap.get(blog.author) + blog.likes)
        }
        else{
            blogMap.set(blog.author,blog.likes)
        }
    });
    
    try {
        let [key, val] = [...blogMap.entries()].reduce((max, entry) =>
        entry[1] > max[1] ? entry : max
        )
        return {
            author: key,
            likes: val
        }
    } catch (error) {
        return undefined
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
