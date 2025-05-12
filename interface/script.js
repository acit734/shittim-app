(() => {
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// SECTION: Module load
const { ipcRenderer } = require("electron");
// !SECTION

// SECTION: Class Declaration
class loading_page_particle {
    constructor(x, y, size, color, angle, alpha) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.angle = angle;
        this.start_time = performance.now();
        this.alpha = alpha;
    }

    draw() {
        loading_page_particle_ctx.save();
        loading_page_particle_ctx.translate(this.x, this.y)
        loading_page_particle_ctx.rotate(this.angle * Math.PI / 180);

        loading_page_particle_ctx.beginPath();
        loading_page_particle_ctx.moveTo(0, -this.size);
        loading_page_particle_ctx.lineTo(-this.size, this.size);
        loading_page_particle_ctx.lineTo(this.size, this.size);
        loading_page_particle_ctx.closePath();

        loading_page_particle_ctx.fillStyle = `rgba(${this.color}${this.alpha})`;
        loading_page_particle_ctx.fill();

        loading_page_particle_ctx.restore();
    }

    update() {
        if (loading_page_stop_particle_animation) return;

        const elapsed = (performance.now() - this.start_time) / 3000;
        this.alpha = Math.abs(Math.sin(elapsed * Math.PI));
        this.draw();

        if (this.alpha < 0.01) {
            this.x = Math.random() * loading_page_particle_canvas.width;
            this.y = Math.random() * loading_page_particle_canvas.height;
        }
    }

    done() {
        if (this.alpha === 1 && !loading_page_particle_openup ||
            this.alpha === 0 && loading_page_particle_openup
        ) {
            this.draw();
            return;
        };
        const elapsed = (performance.now() - this.start_time) / 1000;


        if (!loading_page_particle_openup) {
            if (elapsed >= 1) {
                this.alpha = 1;
            } else {            
                this.alpha = Math.abs(Math.sin(elapsed * Math.PI/2))
            }
        } else {
            if (elapsed >= 1) {
                this.alpha = 0;
            } else {            
                this.alpha = Math.abs(Math.cos(elapsed * Math.PI/2))
            }
        }

        this.draw();
    }

    get_out() {
        const elapsed = (performance.now() - this.start_time) / 3000;

        if (elapsed >= 1) {
            this.alpha = 0;
        } else {
            this.alpha = Math.abs(Math.sin((elapsed * Math.PI/2) + Math.pi))
        }
    }
}
//!SECTION

// SECTION: Query Selectors
// SECTION: Login Page
const main_login_page = document.querySelector(".main#login-page");
const login_page_login_form_container = document.querySelector(".login-page#login-form-container");
const login_page_background_video = document.querySelector(".login-page#background-video");
const login_page_username_input = document.querySelector(".login-page#username-input");
const login_page_password_input = document.querySelector(".login-page#password-input");
const login_page_scanner_canvas = document.querySelector(".login-page#scanner-canvas");
const login_page_box_scanner = document.querySelector(".login-page#box-scanner");
const login_page_login_text = document.querySelector(".login-page#login-text");
const login_page_login_form = document.querySelector(".login-page#login-form");
const login_page_outer_box = document.querySelector(".login-page#outer-box");
const login_page_inner_box = document.querySelector(".login-page#inner-box");
const login_page_plus_1 = document.querySelector(".login-page#plus-1");
const login_page_plus_2 = document.querySelector(".login-page#plus-2");
const login_page_plus_3 = document.querySelector(".login-page#plus-3");
const login_page_plus_4 = document.querySelector(".login-page#plus-4");
// !SECTION

// SECTION Loading Page
const main_loading_page = document.querySelector(".main#loading-page");
const loading_page_progress_percentage = document.querySelector(".loading-page#progress-percentage");
const loading_page_loading_progress = document.querySelector(".loading-page#loading-progress");
const loading_page_particle_canvas = document.querySelector(".loading-page#particle-canvas");
const loading_page_loading_logo = document.querySelector(".loading-page#loading-logo");
const loading_page_progress_bar = document.querySelector(".loading-page#progress-bar");
// !SECTION
// SECTION Menu Page
const main_menu_page = document.querySelector(".main#menu-page");
const menu_page_interlude_image = document.querySelector(".menu-page#interlude-image");
const menu_page_background_video = document.querySelector(".menu-page#background-video");
// !SECTION
// !SECTION

// SECTION: Asset load
let stored_data = {};
(() => {
    function picker(req, blob) {
        const file_url = URL.createObjectURL(blob);
        
        if (req[0] === "image") {
            if (req[1] === "login-bg1.jpg") {
                //main_login_page.style.backgroundImage = `url(${file_url})`;
            } else if (req[1] === "logo-inverted.png") {
                loading_page_loading_logo.style.backgroundImage = `url(${file_url})`;
            } else if (req[2] === "Shittim_Chest_2.webp") {
                menu_page_interlude_image.style.backgroundImage = `url(${file_url})`;
            }
        } else if (req[0] === "font") {
            if (req[1] === "Noto-Sans.ttf") {
                const style_element = document.createElement("style");
                style_element.innerHTML = `@font-face {font-family: "noto-sans"; src: url("${file_url}") format("truetype")}`;
                document.head.append(style_element);
            }
        } else if (req[0] === "video") {
            if (req[1] === "login-page") {
                if (req[2] === "background.mp4") {
                    login_page_background_video.setAttribute("src", `${file_url}`);
                }
            } else if (req[1] === "menu-page") {
                if (req[2] === "background.mp4") {
                    menu_page_background_video.setAttribute("src", `${file_url}`);
                }
            }
        } else {
            stored_data[req.join('/')] = file_url;
        }
    }
    function update_progress() {
        const progress = ((completed_req / data_req.length) * 100).toFixed(0);
        loading_page_progress_bar.style.width = `${progress}%`;
        loading_page_progress_percentage.textContent = `${progress}%`
    }

    const data_req = [
        ["video", "menu-page", "background.mp4"],
        ["image", "logo-inverted.png"],
        ["font", "Noto-Sans.ttf"],
        ["image", "login-bg1.jpg"],
        ["audio", "Arona-Voicelines", "login-page-wrong-user.wav"],
        ["audio", "Arona-Voicelines", "login-page-wrong-pass.wav"],
        ["audio", "Arona-Voicelines", "login-page-auth-success.wav"],
        ["audio", "BA-Sound-Effects", "SE_Confirm_02.wav"],
        ["audio", "BA-Sound-Effects", "SE_Booting_01.wav"],
        ["image", "menu-page", "Shittim_Chest_2.webp"],
        ["video", "login-page", "background.mp4"],
        ["audio", "BA-OST", "Daily_Routine_24_7.mp3"],
    ];
    let completed_req = 0;

    const req_promises = data_req.map(req => {
        return fetch("http://localhost:3000/req-asset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req)
        })
        .then(response => response.blob())
        .then(blob => {
            completed_req++;
            update_progress(completed_req);
            picker(req, blob);
        })
        .catch(err => {
            console.error(`Error fetching ${req} with error: ${err}`)
        });
    });

    Promise.allSettled(req_promises).then(async () => {
        loading_page_loading_logo.style.opacity = '0';
        loading_page_loading_progress.style.opacity = '0';

        loading_page_stop_particle_animation = true;
        cancelAnimationFrame(loading_page_particle_animation_id);

        for (let particle of loading_page_particles) {
            particle.start_time = performance.now();
        }

        loading_page_loading_done();
        await wait(3100);
        loading_page_particles = null;
    });
})();
// !SECTION

// SECTION: Login Page
let LoginPage = function() {
    let login_page_input_timeout_id = null;

    async function login_page_open_verif_box() {
        new Audio(stored_data["audio/Arona-Voicelines/login-page-auth-success.wav"]).play();
        new Audio(stored_data["audio/BA-Sound-Effects/SE_Confirm_02.wav"]).play();

        login_page_username_input.removeEventListener("focus", login_page_username_input_focus);
        login_page_username_input.removeEventListener("blur", login_page_username_input_blur);
        login_page_password_input.removeEventListener("focus", login_page_password_input_focus);
        login_page_password_input.removeEventListener("blur", login_page_password_input_blur);
        login_page_password_input.removeEventListener("input", login_page_password_input_input);

        login_page_username_input.setAttribute("readonly", '');
        login_page_password_input.setAttribute("readonly", '');

        login_page_username_input.style.border = "2px solid lightgreen";
        login_page_username_input.style.boxShadow = "0px 0px 5px lightgreen";
        login_page_password_input.style.border = "2px solid lightgreen";
        login_page_password_input.style.boxShadow = "0px 0px 5px lightgreen";
        login_page_login_text.style.transform = "translate(0, -25px)";
        login_page_login_form.style.transform = "translate(0, -25px)";

        for (let i = 0; i < 3; i++) {
            const opacity_now = window.getComputedStyle(login_page_plus_1).opacity;

            login_page_plus_1.style.opacity = opacity_now === '0' ? '1' : '0';
            login_page_plus_2.style.opacity = opacity_now === '0' ? '1' : '0';

            await wait(100);
        }

        login_page_plus_1.style.transform = "translate(31px, 30px)";
        login_page_plus_2.style.transform = "translate(-30px, -31px)";

        await wait(100);

        login_page_outer_box.style.transform = 'scale(1)';

        await wait(100);

        login_page_inner_box.style.transform = 'scale(1)';
    }
    function login_page_username_input_focus() {
        login_page_username_input.style.border = "2px solid white";
        login_page_username_input.style.boxShadow = "0px 0px 5px white";
    }
    function login_page_username_input_blur() {
        login_page_username_input.style.border = "";
        login_page_username_input.style.boxShadow = "";
    }
    function login_page_password_input_focus() {
        const input_event = new Event("input");
        if (login_page_password_input.value !== '') login_page_password_input.dispatchEvent(input_event);
        else {
            login_page_password_input.style.border = "2px solid white";
            login_page_password_input.style.boxShadow = "0px 0px 5px white";
        }
    }
    function login_page_password_input_blur() {
        login_page_password_input.style.border = "";
        login_page_password_input.style.boxShadow = "";
    }
    function login_page_password_input_input() {
        clearTimeout(login_page_input_timeout_id);
        if (login_page_password_input.value === '') {
            login_page_password_input.style.border = "2px solid white";
            login_page_password_input.style.boxShadow = "0px 0px 5px white";
            return;
        }

        login_page_password_input.style.border = "2px solid yellow";
        login_page_password_input.style.boxShadow = "0px 0px 5px yellow";

        const login_page_inputted_value = {
            user: login_page_username_input.value,
            pass: login_page_password_input.value
        }

        login_page_input_timeout_id = setTimeout(() => {
            fetch("http://localhost:3000/login-page", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(login_page_inputted_value)
            })
            .then(response => response.json())
            .then(data => {
                if (data.respond) {
                    login_page_open_verif_box();
                } else {
                    if (data.why === "user") {
                        new Audio(stored_data["audio/Arona-Voicelines/login-page-wrong-user.wav"]).play();
                        login_page_username_input.style.border = "2px solid red";
                        login_page_username_input.style.boxShadow = "0px 0px 5px red";
                    } else if (data.why === "pass") {
                        new Audio(stored_data["audio/Arona-Voicelines/login-page-wrong-pass.wav"]).play();
                        login_page_password_input.style.border = "2px solid red";
                        login_page_password_input.style.boxShadow = "0px 0px 5px red";
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }, 3000)
    }
    async function login_page_inner_box_mouseenter() {
        const ctx = login_page_scanner_canvas.getContext("2d");

        login_page_inner_box.removeEventListener("mouseenter", login_page_inner_box_mouseenter)
        
        login_page_plus_2.style.transform = "translate(-30px, 30px)";
        
        await wait(300);
        
        login_page_plus_1.style.transform = "translate(31px, -30px)";
        login_page_plus_2.style.transform = "translate(-30px, -30px)";
        
        new Audio(stored_data["audio/BA-Sound-Effects/SE_Booting_01.wav"]).play();
        
        await wait(300);
        
        let elapsed = performance.now();

        async function go_down() {
            const value = (performance.now() - elapsed) / 3000;
            
            if (value >= 1) {
                plus4_plus4_appear();
                return;
            }

            const translate = (value * 60) - 30;
            const height = (value * 130);

            ctx.clearRect(0, 0, login_page_scanner_canvas.width, login_page_scanner_canvas.height);
            ctx.save();
            ctx.fillStyle = "rgba(144, 238, 144, 0.5)";
            ctx.fillRect(0, 0, login_page_scanner_canvas.width, height);
            ctx.restore();
            
            login_page_plus_1.style.transform = `translate(31px, ${translate}px)`;
            login_page_plus_2.style.transform = `translate(-30px, ${translate}px)`;

            requestAnimationFrame(go_down);
        }
        async function plus4_plus4_appear() {
            for (let i = 0; i < 3; i++) {
                const opacity_now = window.getComputedStyle(login_page_plus_3).opacity;
                const new_opacity = opacity_now === '0' ? '1' : '0';

                login_page_plus_3.style.opacity = new_opacity;
                login_page_plus_4.style.opacity = new_opacity;

                await wait(100)
            }

            await wait(100)

            remove_login_page();
        }
        async function remove_login_page() {
            main_login_page.style.transform = "scale(1.2)";

            await wait(300);

            main_login_page.remove();

            await wait(2000);
            menu_page_background_video.style.opacity = '1';
            menu_page_background_video.play();
            menu_page.play_background_music();
            menu_page.navbar.style.marginTop = "0";
            menu_page.selection_container.style.transform = "translateX(0)";
            return;
        }

        go_down();
    }

    login_page_username_input.addEventListener("focus", login_page_username_input_focus);
    login_page_username_input.addEventListener("blur", login_page_username_input_blur);
    login_page_password_input.addEventListener("focus", login_page_password_input_focus);
    login_page_password_input.addEventListener("blur", login_page_password_input_blur);
    login_page_password_input.addEventListener("input", login_page_password_input_input);
    login_page_inner_box.addEventListener("mouseenter", login_page_inner_box_mouseenter)
}
LoginPage();
// !SECTION

// SECTION Loading Page
const loading_page_particle_ctx = loading_page_particle_canvas.getContext("2d");
let loading_page_transition_particles = [];
let loading_page_particles = [];
let loading_page_stop_particle_animation = false;
let loading_page_particle_animation_id = null;
// let loading_page_animate_done_id = null;
let loading_page_particle_openup = false;

loading_page_particle_canvas.width = window.innerWidth;
loading_page_particle_canvas.height = window.innerHeight;

function loading_page_random_gray() {
    const value = (Math.random() * 156) + 80;
    return `${value}, ${value}, ${value}, `;
}
async function loading_page_init_particle(count) {
    for (i = 0; i < count; i++) {
        let size = Math.random() * 20 + 10;
        let x = Math.random() * loading_page_particle_canvas.width;
        let y = Math.random() * loading_page_particle_canvas.height;
        let grey_value = loading_page_random_gray();
        let angle = Math.random() > 0.5 ? 0 : 180;

        if (loading_page_stop_particle_animation) break;
        loading_page_particles.push(new loading_page_particle(x, y, size, grey_value, angle, 0));
        loading_page_animate();
        await wait(1000);
    }
}
function loading_page_animate() {
    loading_page_particle_ctx.clearRect(0, 0, loading_page_particle_canvas.width, loading_page_particle_canvas.height);
    for(let particle of loading_page_particles) {
        particle.update();
    }
    loading_page_particle_animation_id = requestAnimationFrame(loading_page_animate);
}
function loading_page_canvas_resize() {
    loading_page_particle_canvas.height = window.innerHeight;
    loading_page_particle_canvas.width = window.innerWidth;
}
async function loading_page_loading_done() {
    let angle_turn = true
    let x_pos = 0;
    let y_pos = 40;
    while (true) {
        if (x_pos > loading_page_particle_canvas.width + (40 * 2)) {
            if (angle_turn) {
                angle_turn = false;
                x_pos = 40;
            } else {
                angle_turn = true;
                x_pos = 0;
                y_pos += 40 * 2;
            }
        }
        let size = 40;
        let x = x_pos;
        let y = y_pos;
        let grey_value = loading_page_random_blue();
        let angle = angle_turn ? 0 : 180;

        loading_page_transition_particles.push(new loading_page_particle(x, y, size, grey_value, angle, 0));
        loading_page_animate_done();
        x_pos += 2 * 40;
        await wait(1);

        if (x_pos > loading_page_particle_canvas.width + 40 && y_pos > loading_page_particle_canvas.height + 40) break;
    }
    
    loading_page_open_up();
    await wait(1000);
    loading_page_transition_particles = null;
    main_loading_page.remove();
}
function loading_page_animate_done() {
    if (loading_page_transition_particles === null) return
    loading_page_particle_ctx.clearRect(0, 0, loading_page_particle_canvas.width, loading_page_particle_canvas.height);

    if (loading_page_particles !== null){
        for (let particle of loading_page_particles) {
            particle.get_out();
        }
    }
    for (let particle of loading_page_transition_particles) {
        particle.done();
    }

    requestAnimationFrame(loading_page_animate_done);
}
function loading_page_random_blue() {
    const slider = Math.random() * 119;
    const r = slider;
    const g = slider + 104;
    const b = slider + 140;
    return `${r}, ${g}, ${b}, `
}
async function loading_page_open_up() {
    loading_page_particle_openup = true;
    for (let particle of loading_page_transition_particles) {
        particle.start_time = performance.now();
    }
    main_loading_page.style.backgroundColor = 'transparent';
    main_loading_page.style.pointerEvents = "none";
}

loading_page_init_particle(50);

window.addEventListener("resize", loading_page_canvas_resize)
// !SECTION

// SECTION Menu Page
let menu_page = {
    // Elements
    navbar: document.querySelector(".menu-page#navbar"),
    selection_container: document.querySelector(".menu-page#selection-container"),
    music_sound_toggle: document.querySelector(".menu-page#music-sound-toggle"),
    svg_volume_high: document.querySelector(".menu-page#svg-volume-high"),
    svg_volume_xmark: document.querySelector(".menu-page#svg-volume-xmark"),
    date: document.querySelector(".menu-page#date"),

    // Variables
    background_music: null,
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],

    // Functions
    play_background_music: (music = null) => {
        if (!music) {
            menu_page.background_music = new Audio(stored_data["audio/BA-OST/Daily_Routine_24_7.mp3"])
        }

        menu_page.background_music.loop = true;
        menu_page.background_music.play()
    },
    music_sound_toggle_turn: () => {
        if (menu_page.background_music.volume === 1) {
            menu_page.background_music.volume = 0;
            menu_page.svg_volume_high.style.transform = "translateY(-30px)";
            menu_page.svg_volume_xmark.style.transform = "translateY(0)";
        } else if (menu_page.background_music.volume === 0) {
            menu_page.background_music.volume = 1;
            menu_page.svg_volume_high.style.transform = "translateY(0)";
            menu_page.svg_volume_xmark.style.transform = "translateY(30px)";
        }
    },
    set_date: () => {
        const day = new Date().getDate();
        const month = menu_page.months[new Date().getMonth()];
        const year = new Date().getFullYear();

        menu_page.date.textContent = `${day} ${month} ${year}`;
    },

    //Init
    init: () => {
        menu_page.music_sound_toggle.addEventListener("click", menu_page.music_sound_toggle_turn);

        menu_page.set_date();
    }
};
menu_page.init();
})()