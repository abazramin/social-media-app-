// الرابط الرئيسي المستخدم لعمل الركويست
const baseUrl = 'https://tarmeezacademy.com/api/v1';
// 
setUi()
// Toggle Loader
function toggleLoder(show = true) {
    // 
    if (show) {
        document.getElementById('loader').style.visibility = 'visible';
    } else {
        document.getElementById('loader').style.visibility = 'hidden';
    }
}
// داله عامه تستخدم لاظهار رساله نجاح او فشل
function showAlart(customMessage, type) {
    const alertPlaceholder = document.getElementById('success-alert')
    const alert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')
        alertPlaceholder.append(wrapper)
    }
    alert(customMessage, type)
    // setTimeout(() => {
    //     const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
    //     alertToHide.dis()
    // }, 3000)
}
// تحديث واجهه المستخدم بعد تسجيل الدخول بعد التسجيل الناجح وتغير والواجهه بعد ذلك
function setUi() {
    // const getuser = localStorage.getItem("user");
    const getToken = localStorage.getItem("token");
    const loginDiv = document.getElementById('logged-in-div')
    // const registarBtn = document.getElementById('registar-login')
    const logoutDiv = document.getElementById('lobout-div');
    // 
    let lodaer = document.getElementById('loader');
    // 
    let profile_not_logIn = document.getElementById('profile-notlog-in')
    // الزر حق اضافه بوست جديد 
    const btnNewPost = document.getElementById('add-btn');
    // 
    let content_profile = document.getElementById('profile-hide');
    // 
    if (getToken == null) {
        loginDiv.style.setProperty('display', 'flex', 'important')
        // registarBtn.style.visibility = "visible"
        logoutDiv.style.setProperty('display', 'none', 'important')
        btnNewPost.style.setProperty('display', 'none', 'important')
        profile_not_logIn.style.setProperty('display', 'block', 'important')
        content_profile.style.setProperty('display', 'none', 'important')
        lodaer.style.setProperty('display', 'none', 'important')
    } else {
        loginDiv.style.setProperty('display', 'none', 'important')
        // registarBtn.style.visibility = "hidden"
        logoutDiv.style.setProperty('display', 'flex', 'important')
        btnNewPost.style.setProperty('display', 'flex', 'important')
        const user = getCurrentUser()
        document.getElementById('nav-userName').innerHTML = user.username
        document.getElementById('profile-image').src = user.profile_image
        profile_not_logIn.style.setProperty('display', 'none', 'important')
        content_profile.style.setProperty('display', 'block', 'important')
        lodaer.style.setProperty('display', 'block', 'important')
    }
}
// داله بتشوف اذا المستخدم مسجل دخوله ولا لا
function getCurrentUser() {
    let user = null
    const storageUSer = localStorage.getItem('user');
    if (storageUSer != null) {
        user = JSON.parse(storageUSer)
    }
    return user
}
// todos: get tags , get pangations 
// داله انشاء حساب جديد
function registar() {
    // المتغيرات الخاصه بانشاء حساب جديد
    let newuser = document.getElementById('new-user').value;
    let newName = document.getElementById('new-name').value;
    let newEmail = document.getElementById('new-email').value;
    let newPassword = document.getElementById('new-password').value;
    let setimage = document.getElementById('image-input-registar').files[0];
    // const token = localStorage.getItem('token');
    // استخدمت اوبجيكت الفورم داتا بدل البرام عشن الصوره م بتكون جيسون ولازم تكون فورم داتا
    let formData = new FormData()
    formData.append('username', newuser);
    formData.append('name', newName);
    formData.append('password', newPassword);
    formData.append('email', newEmail);
    formData.append('image', setimage);
    // 
    const headers = {
        // 'authorization': `Bearer ${token}`
        'Content-Type': "multipart/form-data",
    }
    // رابط انشاء الحساب
    const url = `${baseUrl}/register`
    toggleLoder(true)
    axios.post(url, formData, {
        headers: headers
    })
        .then((result) => {
            // بعد رجوع الريسبونس بنجاح نقوم بحفظ التوكن واليوزر في اللوكال ستورج
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            //  اخفاء المودل بعد  انشاء حساب  بشكل تلقائي
            let modal = document.getElementById('registar-Modal');
            const modalIns = bootstrap.Modal.getInstance(modal);
            modalIns.hide()
            // رساله نجاح انشاء الحساب
            showAlart("Nice, You have created a new account", "success")
            // تغير واجهه السمتخدم بناء على 
            setUi()
        }).catch((error) => {
            // رساله الخطا اذا كان اسم المستخدم او الايميل مستخدم قبل كدا
            const message = error.response.data.message;
            showAlart(`Sorry, ${message}`, "danger")
        })
        .finally(() => {
            toggleLoder(false)
        })
}
// داله تسجيل الدخول
function logInBtn() {
    // المتغيرات الخاصه بتسجيل الدخول
    let user = document.getElementById("user-input").value;
    let password = document.getElementById("password-input").value;
    // البرامز الخاص بي تسجيل الدخول
    const prams = {
        "username": user,
        "password": password
    }
    // رابط تسجيل الدخول
    const url = `${baseUrl}/login?`
    toggleLoder(true)
    axios.post(url, prams)
        .then((result) => {
            // بعد نجاح رجوع الريسبونس نقوم بحفظ التوكن  في متغير
            let tokenx = result.data.token;
            // بعد نجاح رجوع الريسبونس نقوم بحفظ التوكن واليوزر في اللوكال ستورج
            localStorage.setItem("token", tokenx);
            // بعد نجاح رجوع الريسبونس نقوم بحفظ  اليوزر في متغير
            let userx = result.data.user
            // بعد نجاح رجوع الريسبونس نقوم بحفظ التوكن واليوزر في اللوكال ستورج
            localStorage.setItem("user", JSON.stringify(userx));
            // اخفاء القائمه حقت المودل يعد حفظ التوكن و اليوزر في اللوكال ستورج , محتاج بحث اكتر في الطريقه دي عشان عشان تثبت المعلومة
            let modal = document.getElementById('login-modal');
            const modalIns = bootstrap.Modal.getInstance(modal);
            modalIns.hide()
            // اظهار رساله نجاح تسجيل الدخول
            showAlart("Nice, you're logged in", 'success')
            // تعير واجهه المستخدم بناء علي تسجيل الدخول
            setUi()
        })
        .catch((erorr) => {
            // رساله الخطا اذا كان اسم المستخدم او الايميل مستخدم قبل كدا
            const messagex = erorr.response.data.message;
            showAlart(`Sorry, ${messagex}`, "danger")
        }).finally(() => {
            toggleLoder(false)
        })
}
// داله تسجيل الخروج
function logout() {
    // ازاله التوكن من اللوكال ستوريج
    localStorage.removeItem("token")
    // ازاله اليوزر من اللوكال ستوريج
    localStorage.removeItem("user")
    // رساله تم تسجل لخروج بنجاح
    showAlart("You are logged out", "danger")
    // 
    let modalx = document.getElementById('logout-modal');
    const modalInsx = bootstrap.Modal.getInstance(modalx);
    modalInsx.hide()
    // استدعاء داله Ui Cahnge
    setUi()
}
// الداله الخاصه بتعديل البوست
function editPostClicked(postObject) {
    // 
    let conta = JSON.parse(decodeURIComponent(postObject))
    // 
    document.getElementById('post-modal-submit-btn').innerHTML = "Updata"
    // 
    document.getElementById('post-id-input').value = conta.id;
    // 
    document.getElementById('post-title').innerHTML = "Edit Post"
    // 
    document.getElementById('postTitle-input').value = conta.title;
    // 
    document.getElementById('postBody-input').value = conta.body
    let postModal = new bootstrap.Modal(document.getElementById('new-post'), {})
    postModal.toggle()
}
// الداله الخاصه بحذف البوست
function deletePostClicked(postObjectx) {
    // 
    let cont = JSON.parse(decodeURIComponent(postObjectx))
    // 
    document.getElementById('del-post-title').value = cont.id;
    // 
    let postModal = new bootstrap.Modal(document.getElementById('delete-post'), {})
    postModal.toggle()
}
//
function addBtnClicked() {
    // 
    document.getElementById('post-modal-submit-btn').innerHTML = "Create"
    // 
    document.getElementById('post-id-input').value = '';
    // 
    document.getElementById('post-title').innerHTML = "Create a  New Post"
    // 
    document.getElementById('postTitle-input').value = '';
    // 
    document.getElementById('postBody-input').value = '';
    let postModal = new bootstrap.Modal(document.getElementById('new-post'), {})
    postModal.toggle()
}
// 
function confirmPostDelete() {
    // 
    const delId = document.getElementById('del-post-title').value
    const token = localStorage.getItem('token');
    const headers = {
        "authorization": `Bearer ${token}`,
    }
    // رابط تسجيل الدخول
    toggleLoder(true)
    const url = `${baseUrl}/posts/${delId}`
    axios.delete(url, {
        headers: headers
    })
        .then((result) => {
            console.log(result)
            const modal = document.getElementById('delete-post')
            const modalIns = bootstrap.Modal.getInstance(modal)
            modalIns.hide()
            // 
            showAlart("The post has been deleted", "danger")
            // 
            gatPosts()
        }).catch((error) => {
            // 
            const message = error.response.data.message;
            showAlart(`Sorry, ${message}`, "danger")
        })
        .finally(() => {
            toggleLoder(false)
        })
}
// داله انشاء بوست جديد
function createNewPost() {
    // 
    let postIdx = document.getElementById('post-id-input').value;
    isCreate = postIdx == null || postIdx == '';
    // تعريف المتغيرات الخاصه باضافه بوست جديد
    let titlePost = document.getElementById("postTitle-input").value;
    let bodyPost = document.getElementById("postBody-input").value;
    let imagePost = document.getElementById("setImage-input").files[0];
    // استخدمت اوبجيكت الفورم داتا بدل البرام عشن الصوره م بتكون جيسون ولازم تكون فورم داتا
    let formData = new FormData()
    formData.append('title', titlePost);
    formData.append('body', bodyPost);
    formData.append('image', imagePost);
    // 
    // const url = `${baseUrl}/posts`
    const token = localStorage.getItem('token')
    // نضمن التوكن داخل الفورم داتا عشان نقدر نضيف بوست جديد ونعرف الداله انو المستخدم مسجل دخوله
    const headers = {
        "authorization": `Bearer ${token}`,
    }
    if (isCreate) {
        url = `${baseUrl}/posts`
    } else {
        // 
        formData.append("_method", "put");
        // 
        url = `${baseUrl}/posts/${postIdx}`
    }
    toggleLoder(true)
    axios.post(url, formData, {
        headers: headers
    })
        .then((result) => {
            // اخفاء المودل بعد اضافه البوست
            let modal = document.getElementById('new-post');
            const modalIns = bootstrap.Modal.getInstance(modal);
            modalIns.hide()
            // رساله تم اضافه البوست
            showAlart("Nice, Post has been edited", "success")
            // تحديث الصفحه تلقائي بعد اضافه البوست
            gatPosts()
        })
        .catch((erorr) => {
            // رساله الخطا عند حدوث مشلكه في اضافه البوست
            const messagex = erorr.response.data.message;
            // رساله الخطا
            showAlart(messagex, 'danger')
        })
        .finally(() => {
            toggleLoder(false)
            gatPosts()
        })
}



