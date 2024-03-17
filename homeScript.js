// متغيرات البجانيشن
let currentpage = 1;
let lastpage = 1;
// ===================== INFINITE SCROLL ================= //
window.addEventListener('scroll', function () {
    // 
    const endPage = window.innerHeight + window.scrollY >= document.body.scrollHeight
    // 
    // console.log(this.window.innerHeight, this.window.scrollY, this.document.body.scrollHeight)
    if (endPage && currentpage < lastpage) {
        currentpage = currentpage + 1
        gatPosts(false, currentpage)
    }
});
// داله جلب البوستات من الرابط وتعبئتها في ملف الاتش ام ال
function gatPosts(reload = true, page = 1) {
    toggleLoder(true)
    // Main Data 
    fetch(`${baseUrl}/posts?limit=50&&page=${page}`)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(json => {
            toggleLoder(false)
            let container = json.data
            // lastpage = container.data.meta.last_page
            if (reload) {
                document.getElementById("posts").innerHTML = "";
            }
            // 
            for (container of container) {
                // 
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
                // 
                if (container.title != null) {
                    postTitle = container.title
                }
                // 
                let content = `
                        <div class="col-lg-12 pb-3">
                            <div id="posts">
                                <div class="card shadow">
                                    <div class="card-header">
                                        <div onclick="userCilcked(${container.id})" style="cursor: pointer;">
                                        <img src="${container.author.profile_image}" class="rounded-circle border border-danger-subtle"
                                                style="width: 40px;" alt="image-post" class="img-fluid">
                                            <span class="fs-5 text-secondary fw-bold">${container.author.username}</span>
                                        </div>
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
                        </div>`
                document.getElementById("posts").innerHTML += content;
            }
        })
        .catch(json => {
            const errorH = data.message;
            showAlart(`Sorry ! , ${errorH}`, "danger")
        }).finally(() => {
            toggleLoder(false)
        })
}
gatPosts()
//الدالة الخاصة بارسال الكيوري براميترز الى صفحة تفاصيل البوست
function postCileked(postId) {
    window.location = `postDe.html?postId=${postId}`
}