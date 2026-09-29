const form=document.getElementById('loginForm');
if(form){
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const user=document.getElementById('username').value;
  const pass=document.getElementById('password').value;
  if(user && pass){
   localStorage.setItem('admin_session','active');
   location.href='dashboard.html';
  }
 });
}

function requireAdmin(){
 if(!localStorage.getItem('admin_session')) location.href='login.html';
}
