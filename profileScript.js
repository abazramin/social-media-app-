// 
let getIdFromLocalStorage = localStorage.getItem('user')
let getId = JSON.parse(getIdFromLocalStorage);

// الداله بتعبىء البيانات الخاصه بي المستخدم في صفحة البروفايل
function getUserInPtofile() {
    // 
    const id = getId.id
    // main api url
    toggleLoder(true)
    axios.get(`${baseUrl}/users/${id}`)
        .then((response) => {
            // request success
            const user = response.data.data
            // user && username && iamge && email
            document.getElementById('user-profile').innerHTML = user.name
            document.getElementById('username-profile').innerHTML = user.username
            document.getElementById('email-profile').innerHTML = user.email
            document.getElementById('pic-profile').src = user.profile_image
            // Posts && Commetns Counts
            document.getElementById('post-count').innerHTML = user.posts_count
            document.getElementById('comment-count').innerHTML = user.comments_count
            document.getElementById('post-title').innerHTML = user.username
        }).finally(() => {
            toggleLoder(false)
        })
}
getUserInPtofile()
// الداله الخاصه بي بتعبئه بيانات البوستات الخاصه  بالمستخدم في صفحة البروفايل
function getpostsInProfile() {
    const id = getId.id
    // الرابط الرئيسي
    toggleLoder(true)
    fetch(`${baseUrl}/users/${id}/posts`)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(json => {
            // نجاح الريكسوت
            let container = json.data
            console.log(container)

            // 
            document.getElementById("user-posts").innerHTML = "";
            for (container of container) {
                let postTitle = '';
                // show or hide edit
                let userxx = getCurrentUser();
                let isMyPost = userxx != null && container.author.id == userxx.id
                let editBtnContent = ``
                // 
                if (isMyPost) {
                    editBtnContent = `
                    <button class="btn btn-secondary ms-2" style="float: right;" onclick="editPostClicked('${encodeURIComponent(JSON.stringify(container))}')">Edit</button>    
                    <button class="btn btn-danger" style="float: right;" onclick="deletePostClicked('${encodeURIComponent(JSON.stringify(container))}')">Delete</button>
                    `
                }
                if (container.title != null) {
                    postTitle = container.title
                }
                let content = `
                        <div class="col-lg-12 pb-3">
                                <div id="posts">
                                    <div class="card shadow">
                                        <div class="card-header">
                                            <img src="${container.author.profile_image}" class="rounded-circle border border-danger-subtle"
                                                style="width: 40px;" alt="image-post" class="img-fluid">
                                            <span class="fs-5 text-secondary fw-bold">${container.author.username}</span>
                                            ${editBtnContent}
                                        </div>
                                        <div class="card-body" style="cursor: pointer;" onclick="postCileked(${container.id})">
                                            <img src="${container.image}" class="img-fluid" alt="">
                                            <h6 style="color:#ddd;">${container.created_at}</h6>
                                            <h5>${container.title}</h5>
                                            <p>${container.body}</p>
                                            <hr>
                                            <span class="fw-bold">(${container.comments_count}) Comment</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                `
                document.getElementById("user-posts").innerHTML += content;
            }
        })
        .catch(json => {
            const errorx = josn.data.message;
            showAlart(`Sorry ! , ${errorx}`, "danger")
        }).finally(() => {
            toggleLoder(false)
        })
}
getpostsInProfile()