// material-ui
import logo from 'assets/images/logo.png';

// ==============================|| LOGO ||============================== //

const Logo = () => {
    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         **/
        <img src={logo} alt="MOJTMS" width="60" height="40" />
    );
};

export default Logo;
