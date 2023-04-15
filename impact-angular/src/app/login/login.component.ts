import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // loginuserdata = {}
  constructor(private auth : AuthService,private _router: Router) { }
  public loginuserdata = { email: '', password:'' }; 
  ngOnInit() {
    var self = this;
    if (localStorage.hasOwnProperty("storageselectedclient") && (localStorage.getItem("storageselectedclient") !="")) {
      window.location.replace(location.origin+"/home");
    } else{
      localStorage.clear();
    }

    var input = document.getElementsByTagName("body")[0];
    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        self.loginuser();
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        // document.getElementsByClassName("loginbtn").click();
      }
    });
  }
  loginuser(){
    this.auth.login(this.loginuserdata)
    .subscribe(
      res=>{
        if(res.code=="204"){
            alert("usename and passsword is incorrect");
        }else{
            localStorage.setItem('token', res.token)
            localStorage.setItem('email', res.result.replace(/\s/g, ""))
            //localStorage.setItem('storageselectedclient', res.clientid);
            // localStorage.setItem('storageselectedclient', 'A0003');
            //console.log(res.token);
            // console.log(res);
            this._router.navigate(['/home']);
        }
        
      },
      err => {
        console.log(err);
      }
    )
  }
}
