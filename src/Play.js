import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './App.css';

export function Play(x) {
    const HungryOrHappy = (n) => {
        let temp = []
        for (let i = 0; i < n; i++) {
            temp.push(<img className = "play-icon"src={require("./png/heart.png")}/>)

        }
        for (let i = 0; i < 4 - n; i++) {
            temp.push(<img className = "play-icon"src={require("./png/heart-em.png")}/>)
        }
        return temp
    }
    const DisciplineMeter = (n) => {
        let temp = []
        for (let i = 0; i < 9 - n; i++) {
            temp.push(<div style={{width: "11.2%", height: "100%", backgroundColor: "#8dc37a"}}></div>)
        }
        return temp
    }
    if (x.playType == "hungryMeter") {
        if (x.page == 1) {        
            return <>
            <div className='play'>
                <div className='text play-text' style={{marginBottom: "2%", marginLeft: "4%"}}>Hungry</div>
                <div className='play-icon-container'>{HungryOrHappy(parseInt(x.hungry))} </div>
                <div className='text play-text' style={{marginBottom: "2%", marginLeft: "4%"}}>Happy</div>
                <div className='play-icon-container'>{HungryOrHappy(parseInt(x.happy))} </div>
            </div>
        </>
        } else if (x.page == 2) {
            return  <>
                        <div className='play' style={{justifyContent: "end", alignItems: "center", paddingBottom: "15%"}}>
                            <div className='text play-text' style={{marginBottom: "5%", fontSize: "11vh"}}>Training</div>
                            <img style={{width: "90%", height: "31%"}}src={require("./png/meter.png")}/>
                            <div style={{width: "78%", height: "15%", position: "absolute", top: "66%", display: "flex", flexDirection: "row-reverse"}}>
                                {DisciplineMeter(parseInt(x.disc))}
                            </div>
                        </div>
                    </>
        } else if (x.page == 3) {
            return  <>
            <div className='play' style={{flexDirection: "row"}}>
                <div style={{width: "50%", height: "50%", left: "0%", top: "0%", position: "absolute", display: "flex", justifyContent: "space-between", flexDirection: "column", paddingLeft: "2%", paddingTop: "2%"}}>
                    <img style={{width: "35%", height: "40%"}} src={require("./png/happy.png")}/>
                    <img style={{width: "35%", height: "40%"}} src={require("./png/scale.png")}/>

                </div>
                <div style={{width: "50%", height: "50%", left: "50%", top: "0%", position: "absolute", display: "flex", justifyContent: "space-between", flexDirection: "column", alignItems:"end", paddingTop: "2%"}}>
                    <div className='text play-text'>{x.age}Yr</div>
                    <div className='text play-text'>{x.weight}g</div>
                </div>
                <div style={{width: "50%", height: "50%", left: "0%", top: "50%", position: "absolute", display: "flex", justifyContent: "end", flexDirection: "column", paddingLeft: "2%"}}>
                    <div className='text play-text' style={{marginBottom: "5%", fontSize: "9vh"}}>NAME</div>
                    <div className='text play-text' style={{marginBottom: "5%", fontSize: "9vh"}}>{x.name}</div>
                </div>
                <div style={{width: "50%", height: "50%", left: "50%", top: "50%", position: "absolute"}}>

                </div>
            </div>
        </>
        } else if (x.page == 4) {
            return  <>
            <div className='play' style={{flexDirection: "column"}}>
                <div style={{width: "100%", height: "50%", left: "0%", top: "0%",  display: "flex", justifyContent: "space-evenly", flexDirection: "column", paddingLeft: "2%", paddingTop: "2%"}}>
                    <div className='text play-text' style={{fontSize: "11vh"}}>Style</div>
                    <div className='text play-text' style={{textAlign:"center"}}>{x.style}</div>
                </div>
                <div style={{width: "100%", height: "50%", left: "0%", top: "0%",  display: "flex", justifyContent: "space-evenly", flexDirection: "column", paddingLeft: "2%", paddingTop: "2%"}}>
                    <div className='text play-text' style={{fontSize: "11vh"}}>Gene.</div>
                    <div className='text play-text' style={{textAlign:"center"}}>{x.gen}G</div>
                </div>
            </div>
        </>
        }

    } else if (x.playType == "feeding") {
        return
    }


}