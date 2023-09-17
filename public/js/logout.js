const logout = ()=>{
    axios.post('/auth/logout')
    .then(response=>{
        if(response.status == 201)  //Logged out, Session destroyed
        {
            console.log(response.data)
            location.assign("/")
        }   
    })
    .catch(error =>{
        console.log(error)
    })
}