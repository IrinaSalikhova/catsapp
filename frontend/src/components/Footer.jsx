import React from 'react';
import '../assets/Footer.css';
import facebookIcon from '/facebook_logo.png';
import twitterIcon from '/x_logo.png';
import instagramIcon from '/instagram_logo.png';
import websiteIcon from '/web_logo.png';

const Footer = () => {
  return (
    <footer>
    <div class="footer-content">
      <p>
        <strong>Contributors: </strong>
        <a href="https://www.linkedin.com/in/hưng-lai-5b9148222" target="_blank" rel="noopener">Hung Lai, </a>
        <a href="https://ca.linkedin.com/in/irina-salikhova" target="_blank" rel="noopener">Irina Salikhova, </a>
        <a href="https://www.linkedin.com/in/hưng-lai-5b9148222" target="_blank" rel="noopener">Mahima Sawhney, </a>
        <a href="https://www.linkedin.com/in/hưng-lai-5b9148222" target="_blank" rel="noopener">Baoshan Li</a>
      </p>
      <p>
        <strong>Contact us:</strong>
        <a href="https://www.facebook.com/Carlington-Community-Health-Centre-1744342865792993/?fref=ts" target="_blank" rel="noopener">
          <img 
          src={facebookIcon} 
          alt="Facebook" 
          style={{width: '24px', height: '24px'}}
          />
        </a>
        <a href="https://x.com/CarlingtonCHC?mx=2" target="_blank" rel="noopener">
        <img 
          src={twitterIcon}  
          alt="Twitter" 
          style={{width: '24px', height: '24px'}}
          />
          </a>
        <a href="https://www.instagram.com/carlingtonchc/" target="_blank" rel="noopener">
        <img 
          src={instagramIcon} 
          alt="Instagram" 
          style={{width: '24px', height: '24px'}}
          />
          </a> 
        <a href="https://carlingtonchc.com" target="_blank" rel="noopener">
        <img 
          src={websiteIcon} 
          alt="Website" 
          style={{width: '24px', height: '24px'}}
          />
          </a>
      </p>
    </div>
  </footer>
  );
};

export default Footer;
