const profilePic = document.getElementById('user-profile-pic')
const fullName = document.getElementById('user-fullname')
const mobile = document.getElementById('user-mobile')
const email = document.getElementById('user-email')
const gender = document.getElementById('user-gender')
const dob = document.getElementById('user-dob')
const addr = document.getElementById('user-address')
const editbtn = document.getElementById('edit-details-btn')
const updatebtn = document.getElementById('update-details-btn')

const toggleinput = () =>{
    fullName.disabled  = !fullName.disabled
    mobile.disabled  = !mobile.disabled
    email.disabled  = !email.disabled
    gender.disabled  = !gender.disabled
    dob.disabled  = !dob.disabled
    addr.disabled  = !addr.disabled
    editbtn.classList.toggle("hide");
    updatebtn.classList.toggle("hide");
}

const populateDataOnDOM = (data)=>{
    // console.log(data.img)
    profilePic.src = data.img;
    fullName.value = data.name;
    mobile.value = data.mob;
    email.value = data.email;
    gender.value = data.gender
    dob.value = data.dob.split('T')[0]
    addr.value = data.address
}

const updateProfilePic = async()=>{
    const sendImagetoSever = async(imageAsURL)=>{
        const data = {
            img : imageAsURL
        }
        await axios.post('/user/update-user-profile', data)
        .then(response => {
            if(response.status == 201){
                populateDataOnDOM(response.data.userinfo);
            }
        })
        .catch(error => {
            const status = error.response.status
            if(status == 404 ||status == 400 || status == 500){
                $.notify(error.response.data.message, "error");
            }
        }); 
    }

    await Swal.fire({
        title: 'Update Profile Image',
        input: 'file',
        inputAttributes: {
          'accept': 'image/*',
        },
        showCancelButton: true
      }).then(result=>{
        // console.log(result)
        if(result.isConfirmed === true){
            if(result.value === null)
            {
                console.log("No Image is set -> unset the image")
            }
            else{
                console.log(result.value)
                const reader = new FileReader()
                reader.onload = async (e) => {
                    await sendImagetoSever(e.target.result)
                    // console.log(e.target.result)
                }
                reader.readAsDataURL(result.value)
            }
        }
    })
      
}

const edit = ()=>{
    toggleinput()
}
const update = ()=>{
    const userdata = {
        name : fullName.value,
        mob : mobile.value,
        email: email.value,
        gender : gender.value,
        dob : dob.value,
        address : addr.value 
    }
    axios.post('/user/update-user-profile', userdata, {
        headers: {
            'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if(response.status == 201){
                const data = response.data
                if(data.update_status.acknowledged === true)
                {
                    populateDataOnDOM(data.userinfo);
                    $.notify("Changes were made Successfully!", "success");
                    toggleinput()
                }
                else{
                    $.notify("Database Acknowledgement : Failed", "error");
                }
            }
        })
        .catch(error => {
            console.log(error)
            const status = error.response.status
            if(status == 401 ||status == 400 || status == 500){
                $.notify(error.message, "error");
            }
        });


    // toggleinput()
}

window.addEventListener("DOMContentLoaded", async (event) => {
    await axios.post('/user/get-user-profile', {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if(response.status == 201){
            const data = response.data
            populateDataOnDOM(data);
        }
    })
    .catch(error => {
        const status = error.response.status
        if(status == 401 ||status == 400 || status == 500){
            $.notify(error.response.data.message, "error");
        }
    });
})