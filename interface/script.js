document.addEventListener("DOMContentLoaded", () => {
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
const menu_page_interlude_image = document.querySelector(".menu-page#interlude-image");
const menu_page_background_video = document.querySelector(".menu-page#background-video");
const menu_page_transition_logo = document.querySelector(".menu-page#transition-logo");
// !SECTION
// !SECTION

// SECTION: Asset load
let stored_data = {};
(() => {
    function update_progress() {
        const progress = ((completed_req / data_req.length) * 100).toFixed(0);
        loading_page_progress_bar.style.width = `${progress}%`;
        loading_page_progress_percentage.textContent = `${progress}%`
    }
    function store(obj, link) {
        stored_data[obj] = link;
    }

    const data_req = [
        ["video/menu-page/background.mp4", (obj) => {
            menu_page_background_video.setAttribute("src", `${obj}`);
        }],
        ["image/logo-inverted.png", (obj) => {
            loading_page_loading_logo.style.backgroundImage = `url(${obj})`;
            menu_page_transition_logo.style.backgroundImage = `url(${obj})`;
        }],
        ["font/Noto-Sans.ttf", (obj) => {
            const style_element = document.createElement("style");
            style_element.innerHTML = `@font-face {font-family: "noto-sans"; src: url("${obj}") format("truetype")}`;
            document.head.append(style_element);
        }],
        ["image/login-bg1.jpg"],
        ["audio/Arona-Voicelines/login-page-wrong-user.wav"],
        ["audio/Arona-Voicelines/login-page-wrong-pass.wav"],
        ["audio/Arona-Voicelines/login-page-auth-success.wav"],
        ["audio/BA-Sound-Effects/SE_Confirm_02.wav"],
        ["audio/BA-Sound-Effects/SE_Booting_01.wav"],
        ["image/menu-page/Shittim_Chest_2.webp", (obj) => {
            menu_page_interlude_image.style.backgroundImage = `url(${obj})`;
        }],
        ["video/login-page/background.mp4", (obj) => {
            login_page_background_video.setAttribute("src", `${obj}`);
        }],
        ["audio/BA-OST/Daily_Routine_24_7.mp3"],
        ["image/menu-page/BG_ComputerCenter.jpg", (obj) => {
            menu_page.selection_object_application.style.backgroundImage = `url(${obj})`;
        }]
    ];
    let completed_req = 0;

    const req_promises = data_req.map(req => {
        return fetch("http://localhost:3000/req-asset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req[0])
        })
        .then(response => response.blob())
        .then(blob => {
            const file_url = URL.createObjectURL(blob);

            completed_req++;
            update_progress(completed_req);
            if (req[1]) req[1](file_url);
            else store(req[0], file_url);
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
                    menu_page.username.textContent = login_page_inputted_value.user;
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
    main : document.querySelector(".main#menu-page"),
    selection_object_application: document.querySelector(".menu-page.selection-object#application"),
    selection_container: document.querySelector(".menu-page#selection-container"),
    music_sound_toggle: document.querySelector(".menu-page#music-sound-toggle"),
    transition_canvas: document.querySelector(".menu-page#transition-canvas"),
    transition_screen: document.querySelector(".menu-page#transition-screen"),
    svg_volume_xmark: document.querySelector(".menu-page#svg-volume-xmark"),
    transition_logo: document.querySelector(".menu-page#transition-logo"),
    transition_text: document.querySelector(".menu-page#transition-text"),
    svg_volume_high: document.querySelector(".menu-page#svg-volume-high"),
    exit_button: document.querySelector(".menu-page#exit-button"),
    username: document.querySelector(".menu-page#username"),
    navbar: document.querySelector(".menu-page#navbar"),
    date: document.querySelector(".menu-page#date"),
    time: document.querySelector(".menu-page#time"),

    // Class
    transition_screen_particle: class {
        constructor(x, y, angle, duration) {
            this.x = x;
            this.y = y;
            this.size = 0;
            this.angle = !angle ? 0 : 180;
            this.alpha = 0;
            this.start = performance.now();
            this.end_came_in = this.start + 500;
            this.end_stand_by = this.end_came_in + duration;
            this.end_came_out = this.end_stand_by + 500;
            this.finish = false;
        }

        draw() {
            menu_page.transition_canvas_ctx.save();
            menu_page.transition_canvas_ctx.translate(this.x, this.y)
            menu_page.transition_canvas_ctx.rotate(this.angle * Math.PI / 180);

            menu_page.transition_canvas_ctx.beginPath();
            menu_page.transition_canvas_ctx.moveTo(0, -this.size);
            menu_page.transition_canvas_ctx.lineTo(-this.size, this.size);
            menu_page.transition_canvas_ctx.lineTo(this.size, this.size);
            menu_page.transition_canvas_ctx.closePath();

            menu_page.transition_canvas_ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            menu_page.transition_canvas_ctx.fill();

            menu_page.transition_canvas_ctx.restore();
        }

        transitions() {
            const now = performance.now();
            let alpha;
            let size;
            if (now <= this.end_came_in) {
                alpha = (now - this.start) / 500;
                size = 20 + (12 * alpha);
                this.alpha = alpha;
                this.size = size;
                this.draw();
            } else if (now > this.end_came_in && now <= this.end_stand_by) {
                this.alpha = 1;
                this.size = 32;
                this.draw();
            } else if (now > this.end_stand_by && now <= this.end_came_out) {
                alpha = 1 - ((now - this.end_stand_by) / 500)
                size = 20 + (12 * alpha);
                this.alpha = alpha;
                this.size = size;
                this.draw();
            } else if (now > this.end_came_out) {
                this.finish = true;
            }
        }
    },

    // Variables
    transition_canvas_ctx: null,
    background_music: null,
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],

    // Functions: For Event Listener
    music_sound_toggle_click: () => {
        function updateToggle(condition) {
            fetch("http://localhost:3000/menu-page/background-music-toggle/", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ purpose: "post", state: condition })
            })
        }
        if (menu_page.background_music.volume === 1) {
            updateToggle(false)
            menu_page.background_music.volume = 0;
            menu_page.svg_volume_high.style.transform = "translateY(-30px)";
            menu_page.svg_volume_xmark.style.transform = "translateY(0)";
        } else if (menu_page.background_music.volume === 0) {
            updateToggle(true);
            menu_page.background_music.volume = 1;
            menu_page.svg_volume_high.style.transform = "translateY(0)";
            menu_page.svg_volume_xmark.style.transform = "translateY(30px)";
        }
    },
    exit_button_click: () => {
        window.close();
    },
    selection_object_click: function() {
        menu_page.display_transition_destination(this);
    },
    window_resize: () => {
        menu_page.transition_canvas.width = window.innerWidth;
        menu_page.transition_canvas.height = window.innerHeight;
    },

    // Functions: General
    play_background_music: (music = null) => {
        if (!music) {
            music = new Audio(stored_data["audio/BA-OST/Daily_Routine_24_7.mp3"])
        }

        menu_page.background_music = music
        menu_page.background_music.loop = true;
        fetch("http://localhost:3000/menu-page/background-music-toggle/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ purpose: "get" })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.toggle) {
                menu_page.background_music.volume = 0;
                menu_page.svg_volume_high.style.transform = "translateY(-30px)";
                menu_page.svg_volume_xmark.style.transform = "translateY(0)";
            }
        });
        menu_page.background_music.play();
    },
    set_time_and_date: () => {
        const pad = num => String(num).padStart(2, '0')
        const now = new Date();

        const day = now.getDate();
        const month = menu_page.months[now.getMonth()];
        const year = now.getFullYear();

        const hour = pad(now.getHours());
        const minute = pad(now.getMinutes());
        const second = pad (now.getSeconds());

        if (menu_page.date.textContent === null || parseInt(menu_page.date.textContent.split(' ')[0]) !== day) menu_page.date.textContent = `${day} ${month} ${year}`;
        if (menu_page.time.textContent === null || parseInt(menu_page.time.textContent.split(':')[2]) !== second) menu_page.time.textContent = `${hour}:${minute}:${second}`;
    },
    generate_transition_from_particle: () => {
        menu_page.window_resize();
        menu_page.transition_screen.style.pointerEvents = "auto";

        const half_width = menu_page.transition_canvas.width / 2;
        const half_height = menu_page.transition_canvas.height / 2;
        const canvas = menu_page.transition_canvas;
        const ctx = menu_page.transition_canvas_ctx;
        let particle_generator = {
            top: [],
            bottom: [],
        };
        let particles = [];
        let selisih = 0;
        let flip = true;
        let animation_id;

        function animate_particles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            Promise.all(particles.map(async (particle) => {
                particle.transitions();
            }));

            particles.filter(particle => !particle.finish)
            if (particles.length === 0) {
                cancelAnimationFrame(animation_id);
                return;
            }
            requestAnimationFrame(animate_particles);
        }
        function push_generator(x_base, y_base, flip, direction) {
            const duration = 4000;
            const particle_function = async (y_param = y_base) => {
                    if (y_param <= -30) return;
                    const x = x_base;
                    const y = y_param;
                    const angle = flip;

                    particles.push(new menu_page.transition_screen_particle(x, y, angle, duration))

                    await wait(100);

                    particle_function(direction ? y - 60 : y + 60);
                }

                particle_generator.top.push(particle_function);
        }
        function create_generator(y_sect, direction) {
            while (selisih < half_width + 30) {
                let x_base1;
                let x_base2;
                let y_base = y_sect;

                if (selisih === 0) {
                    x_base1 = half_width;
                    push_generator(x_base1, y_base, flip, direction);
                } else {
                    x_base1 = half_width - selisih;
                    x_base2 = half_width + selisih;
                    push_generator(x_base1, y_base, flip, direction);
                    push_generator(x_base2, y_base, flip, direction);
                }

                selisih += 30;
                flip = !flip;
            }

            selisih = 0;
            flip = true;
        }

        create_generator(half_height - 30, true);
        create_generator(half_height + 30, false);

        Promise.all(particle_generator.top.map(fn => fn()));
        animation_id = requestAnimationFrame(animate_particles);
    },
    display_transition_destination: async (selection) => {
        const application_page_main = application_page.general.main;
        const transition_screen = menu_page.transition_screen;
        const transition_text = menu_page.transition_text;
        const transition_logo = menu_page.transition_logo;
        const menu_page_main = menu_page.main;
        const navbar = menu_page.navbar;

        menu_page.generate_transition_from_particle();

        const motive = selection.querySelector(".menu-page.selection-text").textContent;
        transition_text.textContent = motive;
        await wait(500);

        transition_logo.style.opacity = '1';

        await wait(750);

        transition_logo.style.opacity = '0';

        await wait(500);

        transition_text.style.opacity = '1';
        application_page_main.appendChild(navbar);
        menu_page_main.style.visibility = "hidden";

        await wait (2250);

        transition_text.style.opacity = '0';

        await wait(500);

        transition_screen.style.pointerEvents = "none";
    },

    //Init
    _init: async () => {
        [...menu_page.selection_container.children].forEach(child => {
            child.addEventListener("click", menu_page.selection_object_click);
        });
        
        menu_page.music_sound_toggle.addEventListener("click", menu_page.music_sound_toggle_click);
        menu_page.exit_button.addEventListener("click", menu_page.exit_button_click);
        window.addEventListener("resize", menu_page.window_resize);

        setInterval(() => {
            menu_page.set_time_and_date();
        }, 1000);

        menu_page.transition_canvas.width = window.innerWidth;
        menu_page.transition_canvas.height = window.innerHeight;

        menu_page.transition_canvas_ctx = menu_page.transition_canvas.getContext("2d");
    }
};

let application_page = {
    general: {
        main: document.querySelector(".main#application-page")
    },
    application_list: {}
}

menu_page._init();
})