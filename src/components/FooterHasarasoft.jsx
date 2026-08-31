import Hasarasoft from "../assets/HasaraSoft.svg";

const Footer = () => {
    return (
        <footer className='text-[#A89885] flex flex-col items-center bg-[#FDFAF6]'>
            <p className="text-sm">Powered By</p>
            <a href="https://t.me/+2pm-y1rTWkY1NDEy" className='md:w-1/5 md:h-1/5 w-1/2 h-1/2'><img src={Hasarasoft} alt="HasaraSoft" /></a>
        </footer>
    );
}

export default Footer;