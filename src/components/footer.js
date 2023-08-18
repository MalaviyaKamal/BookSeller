import React from 'react';
import {Link} from "react-router-dom";
import siteLogo from "../assets/Tatvasoftlogo.svg";
import './footer.css';

const Footer=()=>{
    return(
        <>
        <div style={{marginBottom:'80px'}}></div>
        <div className='footerWrapper'>
            <footer>
                <div className='mainDiv'>
                <div className='container'>
                <div className='text-center'>
                    <div className='footerLogo'>
                        <Link to='/' title='Logo'>
                            <img src={siteLogo} alt='siteLogo' className='svgImg'/>
                        </Link>
                    </div>
                    <p className='copyright-text'>
                        &copy; 2015 Tatvasoft.com. All rights reserved
                    </p>
                </div>

                </div>
                </div>
            </footer>
        </div>
        </>
    );
}
export default Footer;