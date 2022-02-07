console.log(localStorage)
var flow_number = '';

var welcome_bubble_opacity=0;
async function show_welcome()
{
    await delay(2000)
    if(welcome_bubble_opacity==1)clearInterval(t);
    welcome_bubble_opacity+=0.02;
    document.getElementById("welcome_bubble").style.opacity=welcome_bubble_opacity;
    document.getElementById("welcome_bubble").style.filter="alpha(opacity="+(welcome_bubble_opacity*100)+")";
}
var t=setInterval(show_welcome,25);

async function show_typing(left, top) {
    //await delay(2000);
    let chat_bubble = document.getElementById('chat-bubble')
    chat_bubble.style.left  = left+'px';
    chat_bubble.style.top  = top+'px';
    chat_bubble.style.visibility  = 'visible';
    document.getElementById('chatbox').scrollTop += 1000; // dp I need this
    await delay(2000); //dlugosc czasu ile widoczny jest dymek
    chat_bubble.style.visibility  = 'hidden';
}

var opened;
function start(){
	if(document.getElementById("chatbot_container").style.visibility != "visible"){
		document.getElementById("chatbot_container").style.visibility = "visible";
		if(opened!=true){
			let bot_msg = document.getElementsByClassName("bot-msg");
			let user_msg = document.getElementsByClassName("user-msg");
			for(let i=0;i<bot_msg.length;i++){
				bot_msg[i].classList.add("apply-font");
			}
			for(let i=0;i<user_msg.length;i++){
				user_msg[i].classList.add("apply-font"); //to nie dziala
			}
			document.getElementById("welcome_bubble").style.visibility = "hidden";
			check_next(1)
		}
		opened = true;
	}
	else{
		document.getElementById("chatbot_container").style.visibility = "hidden";
		var cDiv = document.getElementById("chatbot_container").children;
for (var i = 0; i < cDiv.length; i++) {
        cDiv[i].style.visibility = "hidden";
}
	}
}
const delay = ms => new Promise(res => setTimeout(res, ms));
async function check_next(next_block){
    flow_number = next_block;
    if(next_block != 1){
        await delay(2000); //opznienie blokow
    }
    //document.getElementById('chatbox').scrollTop += document.getElementById('chatbox').scrollHeight;
    let block_type = document.querySelectorAll('[id^="'+next_block+'"]')[0];
    //let block_type = document.getElementById(next_block);
    if(block_type.classList.contains("text")){
        text_block(next_block);
    }
    else if(block_type.classList.contains("input_CB")){
        // await for input being done
        //await get_data();
        input_block(next_block);
    }
    else if(block_type.classList.contains("email")){
        email_block(next_block);
    }
    else if(block_type.classList.contains("phone")){
        phone_block(next_block);
    }
    else if(block_type.classList.contains("multiple")){
        multiple_block(next_block);
    }
    else if(block_type.classList.contains("link_CB")){
        link_block(next_block);
    }
}
function get_data(){
    let chatbot_input = document.getElementById("chatbot-input");
    localStorage.setItem('data', chatbot_input.value)
    document.getElementById(flow_number+'_user_msg').innerHTML = chatbot_input.value;
    document.getElementById(flow_number+'_user_msg').style.display = 'block';
    document.getElementById("chatbot-form").style.display = "none";
    document.getElementById('chatbox').style.height = '520px';
    let subject;
    if(document.getElementById(flow_number).classList.contains("input_CB")){
        subject = "Ktoś zostawił wiadomość poprzez twojego chatbota";
    }
    else{
        subject = "Pozyskałeś nowego leada!";
    }
    fetch('http://127.0.0.1:8000/api/lead/%s', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lead: chatbot_input.value,
            subject: subject,
        })
    }).then(res => {
        return res.json()
    })
    .then(data => console.log(data))
    .catch(error => console.log('ERROR'))
}
function handle_flow_number(flow_number){
    return parseInt(flow_number.toString().replace(/\D/g,'')) + 1 + flow_number.toString().replace(/[0-9]/g, '');
}
async function text_block(flow_number){
    //show chat-bubble, maybe new function
/*     chat_bubble.style.visibility  = 'visible';
    setTimeout(
        function(){
            chat_bubble.style.visibility  = 'hidden';
        }
    , 2000) */
    // do other stuff
    let msg = document.getElementById(flow_number);
    msg.style.visibility = "hidden";
    //show_typing(msg.offsetLeft, msg.offsetTop);
    setTimeout(
        function() {
            msg.style.display = "block";
    }, 1200);
    //next block
    if(msg.style.display = "block"){
        let next_block = handle_flow_number(flow_number);
        await delay(100)
        check_next(next_block);
    }
    console.log(msg.offsetLeft, msg.offsetTop);
    show_typing(msg.offsetLeft, msg.offsetTop);
    await delay(2000)
    msg.style.visibility = "visible";
}
function multiple_block(flow_number){
    //let msg = document.getElementById(flow_number);
    setTimeout(
        function() {
            let options = document.querySelectorAll('[id^="'+flow_number+'"]');
            for(var i = 0; i < options.length; i++){
                options[i].style.display = "block"
                if(options[i].id.includes('_user_msg')){
                    options[i].style.display = "none"
                }
                else{
                    document.getElementById('buttons_container').appendChild(options[i])
                    let buttons_size = document.getElementById('buttons_container').offsetHeight
                    document.getElementById('chatbox').style.height = (520-buttons_size)+'px';
                    document.getElementById('chatbox').scrollTop += 1000;
                }
            }
    }, 1000);
}
function option_choosen(option){
    //type option
    //var users_option = document.createelement("div");
    //alert(option)
    //let id = parseInt(flow_number.replace(/\D/g,''));

    //users_option.className = "user-msg";
    //document.getElementById("chatbox").appendChild(users_option);
    //hide options
    let options = document.getElementsByClassName("multiple-btn")
    for(var i = 0; i < options.length; i++){
        console.log(options[i])
        options[i].style.display = "none"
    }
    document.getElementById('chatbox').style.height = '520px';
    //show resp, thats going to be handled in next one

    var users_option = document.getElementById(option+'_user_msg');
    users_option.innerHTML = document.getElementById(option).innerHTML;
    users_option.style.display = 'block';

    let flow_number = parseInt(option.replace(/\D/g,'')) + 1 + option.replace(/[0-9]/g, '');
    check_next(flow_number);
}
document.addEventListener("submit", (e) => {
    // Store reference to form to make later code easier to read
    const form = e.target;
    
    let next_block = handle_flow_number(flow_number);
    check_next(next_block);

    e.preventDefault();
});
function input_block(flow_number){
	//show chat-bubble
	let msg = document.getElementById(flow_number);
	document.getElementById("chatbot-input").placeholder = "Napisz wiadomość";
	//and mail functionality, osobna funkcja, do input and then div with class users_msg
	if(document.getElementById("chatbar").style.backgroundColor != ""){
		document.getElementById("Icon-Color").style.fill = document.getElementsByClassName("chatbar").style.backgroundColor;
	}
	else{
		document.getElementById("Icon-Color").style.fill = '#B0D4DD'
	}
	//get_data(flow_number)
	setTimeout(
		function() {
			msg.style.display = "block";
			document.getElementById('chatbox').style.height = '450px';
			document.getElementById("chatbot-form").reset();
			document.getElementById("chatbot-form").style.display = "block";
			document.getElementById('chatbox').scrollTop += 1000;
	}, 1000);
	//next block
	// YEAH, HERE AWAIT FOR FUNCTION THAT HANDLES INPUT, OR MAYBE NOT
	return flow_number;
}

async function email_block(flow_number){
	let msg = document.getElementById(flow_number);
	setTimeout(
		function() {
			msg.style.display = "block";
			document.getElementById('chatbox').style.height = '450px';
			document.getElementById("chatbot-form").style.display = "block";
			document.getElementById('chatbox').scrollTop += 1000;
			document.getElementById("chatbot-input").placeholder = "twoj@email.com";
			if(document.getElementById("chatbar").style.backgroundColor != ""){
				document.getElementById("Icon-Color").style.fill = document.getElementsByClassName("chatbar").style.backgroundColor;
			}
			else{
				document.getElementById("Icon-Color").style.fill = '#B0D4DD'
			}
	}, 1000);
	return flow_number;
}

function phone_block(flow_number){
	//show chat-bubble
	let msg = document.getElementById(flow_number);
	//and mail functionality, osobna funkcja, do input and then div with class users_msg
	//get_data(flow_number)
	setTimeout(
		function() {
			msg.style.display = "block";
			document.getElementById('chatbox').style.height = '450px';
			document.getElementById("chatbot-form").style.display = "block";
			document.getElementById('chatbox').scrollTop += 1000;
			document.getElementById("chatbot-input").placeholder = "123 456 789";
			if(document.getElementById("chatbar").style.backgroundColor != ""){
				document.getElementById("Icon-Color").style.fill = document.getElementsByClassName("chatbar").style.backgroundColor;
			}
			else{
				document.getElementById("Icon-Color").style.fill = '#B0D4DD'
			}
	}, 1000);
	//next block
	// YEAH, HERE AWAIT FOR FUNCTION THAT HANDLES INPUT, OR MAYBE NOT
	return flow_number;
}
function link_block(flow_number){
    let link = document.getElementById(flow_number).innerHTML;
    window.open('https://'+link);
    let next_block = handle_flow_number(flow_number);
    check_next(next_block);
}
