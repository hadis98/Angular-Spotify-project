const profile_img = document.querySelector('.profile-photo_container');
const profile_input = document.querySelector('.profile-photo input');
const profile_label = document.querySelector('.profile-photo label');
const profile_name = document.getElementById('profile-name');

updateProfile();

function setProfileName() {
    profile_name.innerText = getUserName();
}

setProfileName();

profile_input.addEventListener("change", function(event) {
    let file = profile_input.files[0];
    const modal_username = document.querySelector('.modal-getInfo input');
    const modal_img = document.querySelector('.modal-image');
    const delete_img = document.querySelector('#delete-modalImg');
    const modal_input = document.querySelector('.modal-image input');
    let photo_target = '../assets/Icons/user-profile.svg';
    let username_target = getUserName();
    const save_modal = document.getElementById('save-photo');
    modal_username.value = getUserName();

    modal_username.addEventListener('change', () => {
        username_target = modal_username.value;
    })
    if (file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            modal_img.style.backgroundImage = `url('${e.target.result}')`;
            photo_target = e.target.result;
        }
        reader.readAsDataURL(file);
        delete_img.addEventListener('click', () => {
            modal_img.style.backgroundImage = `url('../assets/Icons/user-profile.svg')`;
        })

        modal_input.addEventListener('change', (e) => {
            let file_modal = modal_input.files[0];
            if (file_modal) {
                let reader_modal = new FileReader();
                reader_modal.onload = (object) => {
                    modal_img.style.backgroundImage = `url('${object.target.result}')`;
                    photo_target = object.target.result;
                }
                reader_modal.readAsDataURL(file_modal);
            }
        })
    }


    save_modal.addEventListener('click', () => {
        profile_img.style.backgroundImage = `url('${photo_target}')`;
        setUserName(username_target);

        let result_photo_link = `${photo_target}`;
        PostData("postAlter", {
                token: localStorage.getItem("token"),
                username: username_target,
                avatar: result_photo_link,
            })
            .then(res => {
                updateProfile();
            }, error => {
            })

        setProfileName();
        document.getElementById('modal').style.display = 'none';
    })


}, false);

profile_label.addEventListener('click', editProfile);

const library_playlists = document.getElementById('library_playlists');

const fillData_library = (playlists) => {
        return `
  <div class="cards__container">
      ${playlists.map(
          (playlist) =>
            ` 
          <div class="card-playlist" >
              <a id=${playlist.id} class="music-link" href="./songsList.html?id&playlist=${playlist.id}" >
                  <div class="music-link__image">
                  <img src="${playlist.cover?playlist.cover:'../assets/Icons/musical-note.svg'}" alt="cover" />
                  <button class="play-playlists-button">
                  <img src="../assets/Icons/play-button.svg"  class="play_sign_button svgColor" alt="">
                  </button>
                  </div>
                  <h4 class="card-playlist__title">${playlist.name}</h4>
                  <p>${localStorage.getItem('username')}</p>
              </a>
          </div>
      `
        )
        .join("")}
  </div>

`

};



/***************** work with playlists ******************** */


function getAllPlaylists(){
    const user_playlists = [];
    PostData("postAllPlaylists", {
        token: localStorage.getItem("token")
    }).then(res => {
        res.forEach(item => {
            user_playlists.push(item);
            getPlaylistSongs(item['id']);
        });
        library_playlists.innerHTML = fillData_library(user_playlists);
    }).catch(error=>{
       showToast(error);
    });
}

getAllPlaylists();

let avatar_img;

function updateProfile(){
    GetData("getUser", parseInt(localStorage.getItem('userId')) )
    .then(res => {
        avatar_img = res['user']['avatar'];
        let image_url = document.querySelector('.profile-photo_container').style.backgroundImage;
        document.querySelector('.profile-photo_container').style.backgroundImage = `url(${avatar_img})`;
        // profile_img.style.backgroundImage = avatar;
    })
}

// function getUserData(){
//     const data;
//     GetData("getUser", parseInt(localStorage.getItem('userId')) )
//     .then(res => {
//         data = res;
//         avatar = res['user']['avatar'];
//         profile_img.style.backgroundImage = `url(${avatar})`;
//         // profile_img.style.backgroundImage = avatar;
//     })
//     return data;
// }