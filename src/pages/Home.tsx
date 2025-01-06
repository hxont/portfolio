import './Home.css';
import edinburgh from '../assets/edinburgh.jpeg'
import { CiUser } from "react-icons/ci";
import { IoMenuSharp } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import {useState} from "react";
import {ReactTyped} from "react-typed";

function Home() {
    // 반응형 800px 이하일 때
    const [isMenuBarView, setIsMenuBarView] = useState(false);

    const handleView = () => {
        setIsMenuBarView(!isMenuBarView);
    }

    return (
        <>
            <div className="container">
                <img src={edinburgh} className="background"/>
                <div className="overlay"></div>
                <div className="header">
                    <div className="title"><a href="">Hxont</a></div>

                    <ul className={`menu ${isMenuBarView ? "show" : ""}`}>
                        <li><a href="">about me</a></li>
                        <li><a href="">skill</a></li>
                        <li><a href="">project</a></li>
                        <li><a href="">contact</a></li>
                        <li><a href="">guest</a></li>
                    </ul>

                    <ul className={`profile ${isMenuBarView ? "show" : ""}`}>
                        <a href=""><CiUser /></a>
                    </ul>

                    <button className="toggle" onClick={handleView}>
                        {isMenuBarView ? <HiMiniXMark/> : <IoMenuSharp/>}
                    </button>
                </div>

                <div className="textBox">
                <div className="text">
                    <ReactTyped strings={[
                        "Hello, World!",
                        "こんにちは、世界!",
                        "Bonjour, le monde!"
                    ]}
                                typeSpeed={50}
                                backSpeed={50}
                                loop/>
                </div>
                </div>
            </div>
        </>
    );
}

export default Home;
