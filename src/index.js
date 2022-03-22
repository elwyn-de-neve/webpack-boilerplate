import "./style/style.css";
import getData from "./functions/getData";
import logo from "./images/logo.svg";

console.log( "Main script is running!" );

const btn = document.getElementById( "btn" );

if ( btn ) {
    btn.addEventListener( "click",
        getData
    );
}