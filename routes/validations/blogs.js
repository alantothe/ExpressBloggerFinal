const validateBlogData = (blogData) => {
    console.log(blogData)

    if (blogData.title === undefined || blogData.title.length > 40 || typeof(blogData.title) !== "string" ){
        return{
        message: "Title required, must be under 40 Characters and must be a string",
        isValid: false
        }}

    if (blogData.author === undefined || blogData.author.length > 40 || typeof(blogData.author) !== "string" ){
        return{
        message: "Author required, must be under 40 Characters and must be a string",
        isValid: false
        }}




else {
        return{
        isValid: true
        }}

}

module.exports = {
    validateBlogData,
}