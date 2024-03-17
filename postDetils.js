const urlPrams = new URLSearchParams(window.location.search);
const id = urlPrams.get("postId")
// داله جلب البوستات من الرابط وتعبئتها في ملف الاتش ام ال
gatPost()
function gatPost() {
    // Main Data 
    toggleLoder(true)
    fetch(`${baseUrl}/posts/${id}`)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(json => {
            // المتغيرات الخاصه بعرض البوست
            let post = json.data;
            // let comment = post.comments;
            let authorx = post.author;
            let commentx = post.comments;
            // ملْء اليوزر نيم ب اسم اليوزر من قاعده البيانات
            document.getElementById('username-post').innerHTML = authorx.name;
            // افراغ الحاويه الخاصه بي التعليقات قبل ملئها
            document.getElementById('comment').innerHTML = '';
            // تعريف متغير 
            let commentContent = '';
            // عمل حلقه لملء التعليقات في كل مره نضغط فيها على بوست جديد
            for (commentx of commentx) {
                commentContent += `
                <!-- Comment -->
            <div id="comment">
                <div class="p-3" style="background-color: #eee;">
                    <div class="w-100">
                        <!--userimage  -->
                        <img src="${commentx.author.profile_image}" style="width: 40px;" class="img-fluid" alt="">
                        <span>${commentx.author.name}</span>
                    <!-- userbody -->
                        <div class="">
                        ${commentx.body}
                        </div>
                    </div>
                </div>
            </div>
                <!-- Comment -->
                `
            }
            // عرض تفاصيل البوست عندما نضغط عليه
            let content = `
                <div class="col-lg-1"></div>
    <div class="col-lg-10 pb-3">
        <div id="post">
            <div class="card shadow">
                <div class="card-header">
                    <img src="${authorx.profile_image}" class="rounded-circle border border-danger-subtle"
                        style="width: 40px;" alt="" class="img-fluid">
                    <span class="fs-5 text-secondary fw-bold">${authorx.name}</span>
                </div>
                <div class="card-body">
                    <img src="${post.image}" class="img-fluid" alt="">
                    <h6 style="color:#ddd;">${post.created_at}</h6>
                    <h5>${post.title}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <span class="fw-bold">(${post.comments_count}) Comments</span>
                    <span class="fw-bold bg-body-tertiary p-1" id="tagsHtml">Tags</span>
                </div>
            </div>
        </div>
        <div id="comment">
            ${commentContent}
        </div>
        <div class="input-group mb-3 w-100" id="add-comment-div">
            <input id="comment-input" type="text" placeholder="add your comment here.." class="form-control mt-2"/>
            <button class="btn btn-outline-primary mt-2" type="submit" onclick="createCommentClick()" > Send </button>
            </div>
    </div>
    <div class="col-lg-1"></div>
                `
            // اختيار عنصر البوست واضافه محتوى الذي فيه في الحاويه 
            document.getElementById("post").innerHTML = content;
        }).finally(() => {
            toggleLoder(false)
        })
}
// الداله الخاصه بي انشاء تعليق جديد
function createCommentClick() {
    // 
    let commentBody = document.getElementById('comment-input').value;
    // 
    let prams = {
        "body": commentBody
    }
    // 
    let token = localStorage.getItem('token');
    // 
    toggleLoder(true)
    let url = `${baseUrl}/posts/${id}/comments`
    // 
    axios.post(url, prams, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
        .then((response) => {
            // console.log(response)
            showAlart("Nice , Your comment was added", "success")
            gatPost()
        })
        .catch((error) => {
            // console.log(error)
            const errorm = error.response.data.message;
            showAlart(`Sorry ! , ${errorm}`, "danger")
        }).finally(() => {
            toggleLoder(false)
        })
}
