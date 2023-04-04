import './App.css';
import { FaHeart, FaToilet, FaGamepad, FaRegLightbulb, FaLightbulb } from 'react-icons/fa'; import { ImSpoonKnife } from 'react-icons/im'; import { TbMedicineSyrup, TbUserExclamation } from 'react-icons/tb'; import { BiMessageAltDots } from 'react-icons/bi'
import React, { useEffect, useState, useRef } from "react"; import ReactAudioPlayer from 'react-audio-player'; import { useCookies } from 'react-cookie';
import { msToSeconds, msToMinute, msToHours, msToDays, secondsToMs, minutesToMs, hoursToMs, daysToMs } from './TimeConversion';
import { Play } from './Play';

function App() {
  const [date, setDate] = useState(new Date())
  const [showName, setShowName] = useState(false); const [showTamagotchi, setShowTamaGotchi] = useState(true); const [mode, setMode] = useState(""); const [showPlay, setShowPlay] = useState(false); const [playArguments, setPlayArguments] = useState(""); const [showFeed, setShowFeed] = useState(false);
  const [showFeedAnimation, setShowFeedAnimation] = useState(false); const [feedChoice, setFeedChoice] = useState("meal"); const [washId, setWashId] = useState("wash"); const [showWash, setShowWash] = useState(false); const [showGame, setShowGame] = useState(false); 
  const [gameRandom1, setGameRandom1] = useState(0); const [gameRandom2, setGameRandom2] = useState(0); const [showDisc, setShowDisc] = useState(false); const [showMed, setShowMed] = useState(false); const [showLight, setShowLight] = useState(false); const [showSick, setShowSick] = useState(false)
  const [isSleeping, setIsSleeping] = useState(false)
  const [cookies, setCookie] = useCookies(['lastKnownDate', 'timeStart', 'hatchTime', 'hatchState', 'tamagotchi', 'name', 'hungry', 'happy', 'disc', 'weight', 'age', 'style', 'gen', 'growth', 
  'nextPoop', 'nextSick', 'nextHungry', 'nextHappy', 'poop' ,'sick', 'brat', 'bedtime', 'waketime', 'sleep', 'lights', 'nextGrowth', 'nextAge']);

  // First time?
  useEffect(() => {

    if (cookies.timeStart == undefined) {
      document.getElementById("tamagotchi").src = require("./gif/egg.gif")
      console.log("User has created their first egg.")
      setCookie('timeStart', new Date(), { path: '/' })
      setCookie('hatchState', "not hatched", { path: '/' })
      setCookie('hatchTime', new Date(date.getTime() + minutesToMs(1)), { path: '/' });
      if (Math.floor(Math.random() * 2) == 1) {
        setCookie('tamagotchi', 'petitchi', { path: '/' })
        setCookie('style', 'boy', { path: '/' })
      } else {
        setCookie('tamagotchi', 'shiropetitchi', { path: '/' })
        setCookie('style', 'girl', { path: '/' })
      }
      setCookie('hungry', "0", { path: '/' });
      setCookie('happy', "0", { path: '/' });
      setCookie('disc', "0", { path: '/' });
      setCookie('weight', "5", { path: '/' });
      setCookie('age', "0", { path: '/' });
      setCookie('growth', "egg", { path: '/' })
      setCookie('gen', "1", { path: '/' });
      setCookie('sick', 'false', { path: '/' })
      setCookie('sleep', 'false', { path: '/' })
      setCookie('poop', "0", { path: '/' })
      setCookie('lights', "on", { path: '/' })
      setCookie('incomingCareMistake', "false", { path: '/' })
      setCookie('nextCareMistake', new Date(date.getTime()), { path: '/' })
      setCookie('careMistakes', "0", { path: '/' })
    } else {
      document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
      setMode("default")
    }
    if (cookies.lights == "off") {
      setMode("lights")
      setShowLight(true)
      setShowTamaGotchi(false)
    }
    window.onbeforeunload = () => { setCookie('lastKnownDate', new Date(), { path: '/' }); }
  }, [])

  // Timer
  useEffect(() => {
    if (date > new Date(cookies.hatchTime) && cookies.hatchState == "not hatched") {
      handleHatch()
    }
    if (date > new Date(cookies.nextPoop)) {
      PoopHandler()
    }

    if (date > new Date(cookies.nextAge)) {
      setCookie('nextAge', new Date(date.getTime() + hoursToMs(24)), { path: '/' })
      setCookie('age', (parseInt(cookies.age) + 1).toString(), { path: '/' })
    }

    if (date > new Date(cookies.nextGrowth)) {
      GrowthHandler()
  }

    if (date > new Date(cookies.bedtime)) {
        SleepHandler()
      if (date > new Date(cookies.waketime)) {
        WakeHandler()
      }
      setTimeout(() => {
        setDate(new Date())
      }, 500);
      return
    } else { 
      if (date > new Date(cookies.nextSick)) {
        SickHandler()
      }
      if (date > new Date(cookies.nextHappy)) {
        HappyHandler()
      }
      if (date > new Date(cookies.nextHungry)) {
        HungryHandler()
      }
  }
    setTimeout(() => {
      setDate(new Date())
    }, 500);
    if (mode == "default") {
      handleDefault()
    } else if (mode == "game") {
      let tama = document.getElementById("game-tamagotchi")
      if (tama.alt == 1) {
        tama.className = "game-tamagotchi-flip"
        tama.alt = 0
      } else {
        tama.className = ""
        tama.alt = 1
      }
    } else if (mode == "game-animation-happy") {
      let tama = document.getElementById("game-tamagotchi")
      if (tama.alt == 1) {
        tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-happy.png")
        tama.alt = 0
      } else {
        tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
        tama.alt = 1
      }
    } else if (mode == "game-animation-angry") {
      let tama = document.getElementById("game-tamagotchi")
      if (tama.alt == 1) {
        tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-angry.png")
        tama.alt = 0
      } else {
        tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
        tama.alt = 1
      }
    } else if (mode == "discipline") {
      let tama = document.getElementById("tamagotchi")
      let angry = document.getElementById("disc-angry")
      if (tama.alt == 1) {
        angry.src = require("./png/angry-1.png")
        tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-angry.png")
        tama.alt = 0
      } else {
        angry.src = require("./png/angry-2.png")
        tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
        tama.alt = 1
      }
    } else if (mode == "medicine") {
      let med = document.getElementById("medicine")
      if (med.alt == 1) {
        med.src = require("./png/medicine-2.png")
        med.alt = 0
      } else {
        med.src = require("./png/medicine-1.png")
        med.alt = 1
    }
    }


  }, [date])

  // Button Handling Code Block
  const buttonHandler = (e) => {
    // Choose-Button
    if (e.target.id == "choose-button") {
      document.getElementById("button-audio").src = require("./audio/select.wav")
      document.getElementById("button-audio").play()
      if (mode == "naming") {
        let temp = [...nameArray]
        if (nameArray[nameIndex] == "" || nameArray[nameIndex] == "z") {
          temp.splice(nameIndex, 1, "a")
          setNameArray(temp)
        } else {
          temp.splice(nameIndex, 1, nameArray[0] = String.fromCharCode(nameArray[nameIndex].charCodeAt(0) + 1))
          setNameArray(temp)
        }
        document.getElementsByClassName("name-input")[nameIndex].value = temp[nameIndex]
      } else if (mode == "default") {
        if (iconIndex == document.getElementsByClassName("icon").length - 2) {
          setIconIndex(-1)
        } else {
          setIconIndex(iconIndex + 1)
        }
      } else if (mode == "hungryMeter") {
        switch(playArguments.page) {
          case 1:
            const temp = {
              playType: "hungryMeter",
              disc: cookies.disc,
              page: 2
            }
            setPlayArguments(temp)
            break
          case 2:
            const temp2 = {
              playType: "hungryMeter",
              age: cookies.age,
              weight: cookies.weight,
              name: cookies.name,
              page: 3
            }
            setPlayArguments(temp2)
            break
          case 3:
            const temp3 = {
              playType: "hungryMeter",
              style: cookies.style,
              gen: cookies.gen,
              page: 4
            }
            setPlayArguments(temp3)
            break
          case 4:
            setMode("default")
            setShowPlay(false)
            setShowTamaGotchi(true)
            setTamagotchiDefaultPosition("37%")
            setTimeout(() => {
              document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
            }, 1);
            break
        } 
      } else if (mode == "feeding" && !showFeedAnimation) {
        let temp;
        if (feedChoice == "meal" ) {
          setFeedChoice("snack")
          temp = 1
        } else {
          setFeedChoice("meal")
          temp = 0
        }
        let elems = document.getElementsByClassName("feed-cursor")
        Array.from(elems).forEach((e) => {
          e.src = require("./content/blank.png")
        })
        elems[temp].src = require("./png/cursor.png")
      } else if (mode == "washing") {
        return
      } else if (mode == "game") {
        if (gameRandom2 < gameRandom1) {
          document.getElementById("sound-audio").src = require("./audio/happy.wav")
          document.getElementById("sound-audio").play()
          setMode("game-animation-happy")
        } else {
          document.getElementById("sound-audio").src = require("./audio/angry.wav")
          document.getElementById("sound-audio").play()
          setMode("game-animation-angry")
        }
        let tama = document.getElementById("game-tamagotchi")
        tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
        tama.alt = 1
        document.getElementById("rand-num-2").style.opacity = 1
        setTimeout(() => {
          setMode("default")
          setShowTamaGotchi(true)
          setShowGame(false)
          setTamagotchiDefaultPosition("37%")
          setTimeout(() => {
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
          }, 1);
        }, 3000);
      } else if (mode == "lights" && cookies.sleep == "false") {
        setCookie('lights', "on", { path: '/' })
        setMode("default")
        setShowLight(false)
        setShowTamaGotchi(true)
        setTimeout(() => {
          if (cookies.sleep == "true") {
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-sleep.png")
          } else {
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
          }
        }, 1);
      }
    } 
    // Enter Button
    else if (e.target.id == "enter-button") {
      document.getElementById("button-audio").src = require("./audio/enter.wav")
      document.getElementById("button-audio").play()
      let disc;
      //enter - naming
      if (mode == "naming") {
        setNameIndex(nameIndex + 1)
      } 
      //enter - default
      else if (mode == "default") {
        switch(iconIndex) {
          case -1:
            return
          case 0:
            setShowPlay(true)
            setMode("hungryMeter")
            const temp = {
              playType: "hungryMeter",
              hungry: parseInt(cookies.hungry),
              happy: parseInt(cookies.happy),
              page: 1
            }
            setPlayArguments(temp)
            break
          case 1:
            if (cookies.sleep == "true" || cookies.sick == "true") {
              return
            }
            if (cookies.hungry == "4") {
              NoAnimation()
              document.getElementById("tamagotchi").style.left = "37%"
              disc = true
              break
            }
            setMode("feeding")
            setShowFeed(true)
            break
          case 2:
            if (cookies.sleep == "true"  || cookies.sick == "true") {
              return
            }
            setMode("washing")
            setShowWash(true)
            setTimeout(() => {
              setWashId("washing")
            }, 1);
            setTimeout(() => {
              setMode("default")
              setShowWash(false)
              setWashId("wash")
              setShowTamaGotchi(true)
              setTamagotchiDefaultPosition("37%")
              setTimeout(() => {
                document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
              }, 1);
              setCookie('poop', "0", { path: '/' })
            }, 2000);
            break
          case 3:
            if (cookies.sleep == "true"  || cookies.sick == "true") {
              return
            }
            setMode("game")
            setShowGame(true)
            let tempest3 = Math.floor(Math.random(0) * 8) + 1
            setGameRandom1(tempest3)
            let temp3 = tempest3
            while(tempest3 == temp3) {
              temp3 = Math.floor(Math.random(0) * 8) + 1
            }
            setGameRandom2(temp3)
            break
          case 4:
            if (cookies.sleep == "true"  || cookies.sick == "true") {
              return
            }
            setMode("discipline")
            disc = true
            setShowDisc(true)
            document.getElementById("tamagotchi").style.left = "37%"
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
            setTimeout(() => {
              setMode("default")
              setShowDisc(false)
              document.getElementById("tamagotchi").alt = "1"
              document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
            }, 3000);
            break
          case 5:
            if (cookies.sleep == "true") {
              return
            }
            if (cookies.sick == "false") {
              NoAnimation()
              document.getElementById("tamagotchi").style.left = "37%"
              disc = true
              break
            }
            setMode("medicine")
            disc = true
            setShowMed(true)
            document.getElementById("tamagotchi").style.left = "37%"
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-sad.png")
            setTimeout(() => {
              setCookie('sick', 'false', { path: '/' })
              setShowSick(false)
              setCookie('nextSick', new Date(date.getTime() + hoursToMs(Math.floor(Math.random() * 20 + 20))), { path: '/' })
              setMode("default")
              setShowMed(false)
              document.getElementById("tamagotchi").alt = "1"
              document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
            }, 4000);
            break
          case 6:
            setMode("lights")
            setShowLight(true)
            setCookie('lights', "off", { path: '/' })
            break
          }
        setIconIndex(-1)
        if (!disc) {
          setShowTamaGotchi(false)
        }
      } else if (mode == "feeding" && !showFeedAnimation) {
        setShowFeedAnimation(true)
        setTimeout(() => {
          FeedAnimation()
        }, 1);
      } else if (mode == "game") {
        if (gameRandom2 > gameRandom1) {
          document.getElementById("sound-audio").src = require("./audio/happy.wav")
          document.getElementById("sound-audio").play()
          setMode("game-animation-happy")
        } else {
          document.getElementById("sound-audio").src = require("./audio/angry.wav")
          document.getElementById("sound-audio").play()
          setMode("game-animation-angry")
        }
        let tama = document.getElementById("game-tamagotchi")
        tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
        tama.alt = 1
        document.getElementById("rand-num-2").style.opacity = 1
        setTimeout(() => {
          setTamagotchiDefaultPosition("37%")
          setMode("default")
          setShowTamaGotchi(true)
          setShowGame(false)
          setTimeout(() => {
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
          }, 1);
          let z = parseInt(cookies.happy)
          if (z < 4) {
            z = z + 1
            setCookie('happy', z.toString(), { path: '/' })
          }
        }, 3000);
      } else if (mode == "lights" && cookies.sleep == "false") {
        setCookie('lights', "on", { path: '/' })
        setMode("default")
        setShowLight(false)
        setShowTamaGotchi(true)
        setTimeout(() => {
          if (cookies.sleep == "true") {
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-sleep.png")
          } else {
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
          }
        }, 1);
      }

    } 
    // Cancel-Button
    else if (e.target.id == "cancel-button") {
      document.getElementById("button-audio").src = require("./audio/cancel.wav")
      document.getElementById("button-audio").play()
      if (mode == "naming" && nameIndex != 0) {
        setNameIndex(nameIndex - 1)
      } else if (mode == "default"){
        setIconIndex(-1)
      } else if (mode == "hungryMeter") {
        setMode("default")
        setShowPlay(false)
        setShowTamaGotchi(true)
        setTimeout(() => {
          document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
        }, 1);
      } else if (mode == "feeding") {
        setMode("default")
        setShowTamaGotchi(true)
        setShowFeedAnimation(false)
        setShowFeed(false)
        setTimeout(() => {
          document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
        }, 1);
      } else if (mode == "game") {
        setMode("default")
        setShowTamaGotchi(true)
        setShowGame(false)
        setTimeout(() => {
          document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
        }, 1);
      } else if (mode == "lights" && cookies.sleep == "false") {
        setCookie('lights', "on", { path: '/' })
        setMode("default")
        setShowLight(false)
        setShowTamaGotchi(true)
        setTimeout(() => {
          if (cookies.sleep == "true") {
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-sleep.png")
          } else {
            document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
          }
        }, 1);
      }
      setTamagotchiDefaultPosition("37%")
    }

  }

  // Hatch Related Code Block 
  const handleHatch = () => {
    let baby = cookies.tamagotchi;
    setCookie('hatchState', "hatched", { path: '/' })
    setCookie('growth', "baby", { path: '/' })
    setTimeout(() => {
      document.getElementById("sound-audio").src = require("./audio/alert.wav")
      document.getElementById("sound-audio").play()
    }, 0);

    const elem = document.getElementById("tamagotchi");
    elem.src = require("./png/egg-1.png")

    for (let i = 0; i <= 25; i++) {

      setTimeout(() => {
        if (i == 25) {
          elem.style.margin = "0%"
          elem.src = require("./png/" + baby + "/" + baby + "-hatch.png")
          setTimeout(() => {
            elem.src = require("./png/" + baby + "/" + baby + "-general-1.png")
            elem.style.marginBottom = "25%"
          }, i * 150 + 850);
          setTimeout(() => {
            setShowTamaGotchi(false); setShowName(true)
            setMode("naming")
          }, i * 150 + 3850);
        } else if (i % 2 == 0) {
          elem.style.margin = "0%"
          elem.style.marginLeft = "5%";
        } else {
          elem.style.margin = "0%"
          elem.style.marginRight = "5%";
        }
      }, i * 150);
    }
  }

  // NAME
  const [nameArray, setNameArray] = useState(["", "", "", "", ""]); const [nameIndex, setNameIndex] = useState(0)
  useEffect(() => {
    if (nameIndex > 4) {
      let temp = [...nameArray]
      temp = temp.toString().replace(/\,/g, '')
      setCookie('name', temp, { path: '/' });
      setTimeout(() => {
        setShowName(false)
        setShowTamaGotchi(true)
        setMode("default")
        setCookie('nextPoop', new Date(date.getTime() + minutesToMs(15)), { path: '/' })
        setCookie('nextSick', new Date(date.getTime() + minutesToMs(30)), { path: '/' })
        setCookie('nextHappy', new Date(date.getTime() + minutesToMs(3)), { path: '/' })
        setCookie('nextHungry', new Date(date.getTime() + minutesToMs(3)), { path: '/' })
        setCookie('nextGrowth', new Date(date.getTime() + minutesToMs(65)), { path: '/' })
        setCookie('bedtime', new Date(date.getTime() + minutesToMs(40)), { path: '/' })
        setCookie('waketime', new Date(date.getTime() + minutesToMs(45)), { path: '/' })
      }, 2000);
    }
    Array.from(document.getElementsByClassName("caret")).forEach((caret) => {
      caret.id = ""
    })
    if (document.getElementsByClassName("caret")[nameIndex] != undefined) {
      document.getElementsByClassName("caret")[nameIndex].id = "caret-blink"
    }
  }, [nameIndex])
  useEffect(() => {
    Array.from(document.getElementsByClassName("caret")).forEach((caret) => {
      caret.id = ""
    })
  }, [nameArray])

  // Icon Handling Code Block
  const skipFirstRunForIndex = useRef(true)
  const [iconIndex, setIconIndex] = useState(-1)
  useEffect(() => {
    if (skipFirstRunForIndex.current) {
      skipFirstRunForIndex.current = false;
      return
    }
    let icons = document.getElementsByClassName("icon")
    Array.from(document.getElementsByClassName("icon")).forEach((icon) => {
      icon.style.opacity = .5
    })
    if (icons[iconIndex] != undefined) {
      icons[iconIndex].style.opacity = 1;
    }
  }, [iconIndex])
  const onIconClick = (e) => {
    setIconIndex(e)
    document.getElementById("button-audio").src = require("./audio/select.wav")
    document.getElementById("button-audio").play()
  }

  // Default Handling Code Block
  const [tamagotchiDefaultPosition, setTamagotchiDefaultPosition] = useState("37%")
  const handleDefault = () => {
    if (!showTamagotchi || cookies.sick == "true" || cookies.sleep == "true") {
      return
    }
    let tama = document.getElementById("tamagotchi")
    let dist = parseFloat(tamagotchiDefaultPosition.replace("%", ""))
    const ran = Math.floor(Math.random() * 3)
    if (ran == 0) {
      if (parseFloat(tamagotchiDefaultPosition) >= 74) {
        dist = dist - 37/5
        setTamagotchiDefaultPosition(dist + "%")
        tama.style.left = tamagotchiDefaultPosition
       } else {
        tama.className = "game-tamagotchi-flip"
        dist = dist + 37/5
        setTamagotchiDefaultPosition(dist + "%")
        tama.style.left = tamagotchiDefaultPosition
      }
    } else if (ran == 1) {
      if (parseFloat(tamagotchiDefaultPosition) <= 1) {
        dist = dist + 37/5
        tama.style.left = tamagotchiDefaultPosition
       } else {
        tama.className = ""
        dist = dist - 37/5
        setTamagotchiDefaultPosition(dist + "%")
        tama.style.left = tamagotchiDefaultPosition
      }
    } 

    const gif = Math.floor(Math.random() * 2)
    if (gif == 0) {
      tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
    } else if (gif == 1) {
      tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-2.png")
    }
  }

  // Feeding Code Clock
 function Feed() {
    if (!showFeedAnimation) {
      let temp = []
      temp.push(<div className="feed-text-container"><img className="feed-cursor" src={require("./png/cursor.png")}/><div className="text" style={{position: "relative"}}>Meal</div></div>)
      temp.push(<div className="feed-text-container"><img className="feed-cursor" src={require("./content/blank.png")}/><div className="text" style={{position: "relative"}}>Snack</div></div>)
      return <>
      <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "start"}}>
        {temp}
      </div>
      </>
    } else {
      return <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-evenly", alignItems: "end"}}><img  id="food-animation" src={require("./png/food/" +cookies.growth +"-"+ feedChoice +"-1.png")}/><img  id="tamagotchi-animation" src={require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-eat-2.png")}/></div>
    }
  }

  const FeedAnimation = () => {
    let tama = document.getElementById("tamagotchi-animation")
    let food = document.getElementById("food-animation")
    for (let i = 1; i <= 6; i++) {
      if (i == 6) {
        setTimeout(() => {
          setShowFeedAnimation(false)
          let temp = parseInt(cookies.hungry) 
          if (temp != 4) {
            temp = temp + 1
            setCookie('hungry', temp.toString(), { path: '/' })
          }
          if (cookies.growth != "baby") {
            let x = parseInt(cookies.weight)
            if (feedChoice == "meal") {
              x = x + 1
            } else {
              x = x + 2
            }
            setCookie('weight', x.toString(), { path: '/' })
          } 
          if (feedChoice == "snack") {
            let y = parseInt(cookies.happy)
            if (y < 4) {
              y = y + 1
              setCookie('happy', y.toString(), { path: '/' })
            }
          }
          setFeedChoice("meal")
        }, i * 500);
      }
       else if (i % 2 != 0) {
        setTimeout(() => {
          tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-eat-1.png")
          if (i == 1) {
            food.src = require("./png/food/" +cookies.growth +"-"+ feedChoice +"-2.png")
          } else if (i == 3) {
            food.src = require("./png/food/" +cookies.growth +"-"+ feedChoice +"-3.png")
          } else if (i == 5) {
            food.src = require("./content/blank.png")
          }
        }, 500 * i)
      } else {
        setTimeout(() => {
          tama.src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-eat-2.png")
        }, 500 * i)
      }
    }
  }

  const NoAnimation = () => {
    setMode("no")
    setTamagotchiDefaultPosition("37%")
    document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-no.png")
    document.getElementById("tamagotchi").className = ""
    for (let i = 1; i < 5; i++) {
      if (i == 4) {
        setTimeout(() => {
          setMode("default")
          document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-general-1.png")
        }, i * 500);
      }
      if (i % 2) {
        setTimeout(() => {
          document.getElementById("tamagotchi").className="game-tamagotchi-flip"
        }, i * 500);
      } else {
        setTimeout(() => {
          document.getElementById("tamagotchi").className = ""
        }, i * 500);
      }
    }
  }

  const PoopHandler = () => {
    let temp = parseInt(cookies.poop)
    if (temp < 4) {
      temp = temp + 1
    }
    setCookie('poop', temp.toString(), { path: '/' })
    if (cookies.growth == "baby") {
      setCookie('nextPoop', new Date(date.getTime() + minutesToMs(30)), { path: '/' })
    } else {
      setCookie('nextPoop', new Date(date.getTime() + hoursToMs(Math.floor(Math.random() * 3 + 2) )), { path: '/' })
    }
  }

  const SickHandler = () => {
    setCookie('sick', 'true', { path: '/' })
    if (document.getElementById("tamagotchi") != undefined) {
      document.getElementById("tamagotchi").style.left = "37%"
      document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-sad.png")
    }
    let temp = Math.floor(Math.random() * 20 + 20)
  }

  const SleepHandler = () => {
    if (cookies.sleep != "true") {
      document.getElementById("sound-audio").src = require("./audio/alert.wav")
      document.getElementById("sound-audio").play()
      setCookie('attention', 'true', { path: '/' })
    }
    setCookie('sleep', 'true', { path: '/' })
    if (document.getElementById("tamagotchi") != undefined) {
      document.getElementById("tamagotchi").style.left = "37%"
      document.getElementById("tamagotchi").src = require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-sleep.png")
    }
  }

  const WakeHandler = () => {
    setCookie('sleep', 'false', { path: '/' })
    setCookie('lights', "on", { path: '/' })
    setMode("default")
    setShowLight(false)
    setShowTamaGotchi(true)
    let d = new Date()
    let a = new Date()

    d.setHours(20); d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0)
    a.setDate(a.getDate() + 1);a.setHours(8); a.setMinutes(0); a.setSeconds(0); a.setMilliseconds(0);

    setCookie('bedtime', new Date(d), { path: '/' })
    setCookie('waketime', new Date(a), { path: '/' })

  }

  const HungryHandler = () => {
    let temp = parseInt(cookies.hungry)
    if (temp > 0) {
      temp = temp - 1
      setCookie('hungry', temp.toString(), { path: '/' });
      if (cookies.growth == 'baby') {
        setCookie('nextHungry', new Date(date.getTime() + minutesToMs(3)), { path: '/' })
      } else {
        setCookie('nextHungry', new Date(date.getTime() + hoursToMs(1)), { path: '/' })
      }
    } 
  }

  const HappyHandler = () => {
    let temp = parseInt(cookies.happy)
    if (temp > 0) {
      temp = temp - 1
      setCookie('happy', temp.toString(), { path: '/' });
      if (cookies.growth == 'baby') {
        setCookie('nextHappy', new Date(date.getTime() + minutesToMs(3)), { path: '/' })
      } else {
        setCookie('nextHappy', new Date(date.getTime() + hoursToMs(1)), { path: '/' })
      } 
    } 
  }

  const GrowthHandler = () => {
    switch(cookies.growth) {
      case "baby":
        setCookie('growth', "child", { path: '/' })
        let childArray = ['marutchi', 'hitodetchi']
        setCookie('tamagotchi', childArray[Math.floor(Math.random() * 2)], { path: '/' })
        setCookie('nextGrowth', new Date(date.getTime() + hoursToMs(24)), { path: '/' })
        setCookie('age', "1", { path: '/' })
        setCookie('nextAge', new Date(date.getTime() + hoursToMs(24)), { path: '/' })
        break
      case "child":
        setCookie('weight', "10", {path: '/'})
        setCookie('growth', "teen", { path: '/' })
        let teenArray = ['ringotchi', 'young mametchi', 'ufotchi', 'nikatchi', 'oniontchi']
        setCookie('tamagotchi', childArray[Math.floor(Math.random() * teenArray.length - 1)], { path: '/' })
        setCookie('nextGrowth', new Date(date.getTime() + hoursToMs(48)), { path: '/' })
      case "teen":
        setCookie('weight', "20", {path: '/'})
        setCookie('growth', "adult", { path: '/' })
        let adultArray = ['mametchi', 'pyonchitchi', 'violetchi', 'ginjirotchi', 'kuchipatchi', 'pochitchi', 'kusatchi', 'nyorotchi', 'tarakotchi', 'hanatchi', 'kaerutchi', 'takotchi', 'kiwitchi', 'masktchi', 'whaletchi']
        setCookie('tamagotchi', childArray[Math.floor(Math.random() * adultArray.length - 1)], { path: '/' })
        setCookie('nextGrowth', new Date(date.getTime() + hoursToMs(48)), { path: '/' })
      case "adult":
        setCookie('weight', "30", {path: '/'})
        setCookie('growth', "senior", { path: '/' })
        setCookie('nextGrowth', new Date(date.getTime() + hoursToMs(60)), { path: '/' })
        let seniorMaleArray = ['ojitchi', 'oyajitchi']
        if (cookies.style == "girl") {
          setCookie('tamagotchi', 'otokitchi', { path: '/' })
        } else {
          setCookie('tamagotchi', seniorMaleArray[Math.floor(Math.random() * 2)], { path: '/' })
        }
      case "senior":
        setCookie('growth', "baby", { path: '/' })
        setCookie('nextGrowth', new Date(date.getTime() + hoursToMs(48)), { path: '/' })
        let babyArray = ['shiropetitchi', 'petitchi']
        setCookie('tamagotchi', babyArray[Math.floor(Math.random() * 2)], { path: '/' })
        setCookie('gen', (parseInt(cookies.gen) + 1).toString(), { path: '/' })
        setCookie('nextPoop', new Date(date.getTime() + minutesToMs(15)), { path: '/' })
        setCookie('nextSick', new Date(date.getTime() + minutesToMs(30)), { path: '/' })
        setCookie('nextHappy', new Date(date.getTime() + minutesToMs(3)), { path: '/' })
        setCookie('nextHungry', new Date(date.getTime() + minutesToMs(3)), { path: '/' })
        setCookie('nextGrowth', new Date(date.getTime() + minutesToMs(65)), { path: '/' })
        setCookie('bedtime', new Date(date.getTime() + minutesToMs(40)), { path: '/' })
        setCookie('waketime', new Date(date.getTime() + minutesToMs(45)), { path: '/' })
    }
  }

  const Poopinator = (x) => {
    let temp = [];
    if (cookies.growth == "baby" || cookies.growth == "child") {
      for (let i = 0; i < x; i++) {
        if (i > 1) {
          temp.push(<img style={{width: "15%", height: "15%", left: i * 16 - 32 + "%", position: "absolute"}}src={require("./png/etc/small-poop.png")}/>)
        } else {
          temp.push(<img style={{width: "15%", height: "15%", right: i * 16 + "%", position: "absolute"}}src={require("./png/etc/small-poop.png")}/>)
        }
      }
    } else {
      for (let i = 0; i < x; i++) {
        if (i > 1) {
          temp.push(<img style={{width: "15%", height: "15%", left: i * 16 - 32 + "%", position: "absolute"}}src={require("./png/etc/big-poop.png")}/>)
        } else {
          temp.push(<img style={{width: "15%", height: "15%", right: i * 16 + "%", position: "absolute"}}src={require("./png/etc/big-poop.png")}/>)
        }
      }
    }
    return temp
  }

  return (
    <>
      <ReactAudioPlayer id="sound-audio" />
      <ReactAudioPlayer id="button-audio" />
      <div id="background" />
      <div id="wrapper">
        <img id="tamagotchi-image" src={require("./content/tamagatchi-toy.png")} />
        <div className="bar" style={{ top: "1.1%" }}>
          <FaHeart className="icon" onClick = {() => {if (mode == "default") {onIconClick(0)}}}/> <ImSpoonKnife className="icon" onClick = {() => {if (mode == "default") {onIconClick(1)}}} /><FaToilet className="icon" onClick = {() => {if (mode == "default") {onIconClick(2)}}}/><FaGamepad className="icon" onClick = {() => {if (mode == "default") {onIconClick(3)}}}/>
        </div>

        <div className="pixel" id="screen">
          {cookies.sleep == "true" && (mode == "default" || mode == "lights") ? <><div style={cookies.lights == "on" ?{bottom: "35%", right: "30%"} : {bottom: "35%", right: "30%", color: "#8dc37a"}} className='text'> Z</div> <div style={cookies.lights == "on" ?{bottom: "55%", right: "18%", fontSize: "10vh"} : {bottom: "55%", right: "18%", color: "#8dc37a", fontSize: "10vh"}} className='text'> Z</div> </>: <></>}
          {mode == "default" || mode == "medicine"? Poopinator(parseInt(cookies.poop)) : <></>}
          {showTamagotchi ? <img id="tamagotchi" alt="1" src={require("./content/blank.png")}/> : <></>}
          {showName ? <>
            <div className="text" id="name-text">NAME</div>
            <div id="name-input-container">
              <div id="caret-container">
                <div className="caret" id="caret-blink" alt="0" />
                <div className="caret" alt="1" />
                <div className="caret" alt="2" />
                <div className="caret" alt="3" />
                <div className="caret" alt="4" />
              </div>
              <input className="text name-input" maxLength="1" onClick={() => { setNameIndex(0) }} onChange={(e) => { let temp = [...nameArray]; temp.splice(0, 1, e.target.value); setNameArray(temp); }} />
              <input className="text name-input" maxLength="1" onClick={() => { setNameIndex(1) }} onChange={(e) => { let temp = [...nameArray]; temp.splice(1, 1, e.target.value); setNameArray(temp); }} />
              <input className="text name-input" maxLength="1" onClick={() => { setNameIndex(2) }} onChange={(e) => { let temp = [...nameArray]; temp.splice(2, 1, e.target.value); setNameArray(temp); }} />
              <input className="text name-input" maxLength="1" onClick={() => { setNameIndex(3) }} onChange={(e) => { let temp = [...nameArray]; temp.splice(3, 1, e.target.value); setNameArray(temp); }} />
              <input className="text name-input" maxLength="1" onClick={() => { setNameIndex(4) }} onChange={(e) => { let temp = [...nameArray]; temp.splice(4, 1, e.target.value); setNameArray(temp); }} />

            </div>
          </> : <></>}
          {showPlay ? Play(playArguments) : <></>}
          {showFeed ? Feed() : <></>}
          {showWash ? <img id={washId} src={require("./png/etc/wash.png")}/> : <></>}
          {showGame ? <div id="game-container"><div className='text' style={{position: "relative", width: "33%", textAlign: "center"}}>{gameRandom1}</div><img alt="1" id="game-tamagotchi"style={{width: "17vh"}} src={require("./png/" + cookies.tamagotchi + "/" + cookies.tamagotchi + "-eat-1.png")}/><div id="rand-num-2" className='text' style={{position: "relative", width: "33%", textAlign: "center", opacity: "0"}}>{gameRandom2}</div></div> : <></>}
          {showDisc ? <img id="disc-angry" style={{width: "17vh", height: "17vh", position: "absolute", right: "10%", bottom: "30%"}} src={require("./png/angry-2.png")}/> : <></>}
          {showMed ? <>
          <img alt= "1" id="medicine" style={{width: "20%", height: "22%", position: "absolute", left: "15%", bottom: "25%"}} src={require("./png/medicine-1.png")}/>
          </>: <></>}
          {showLight ? <div style={{backgroundColor: "black", width: "100%", height: "100%"}}/> : <></>}
          {cookies.sick == "true" ? <img style={{position: "absolute", right: "20%", bottom: "40%", width: "10%"}} src={cookies.growth == "baby" || cookies.growth =="child" ? require("./png/etc/small-skull.png") :require("./png/etc/big-skull.png")}/> : <></>}
        </div>

        <div id="button-container">
          <input type="button" className="button" id="choose-button" onClick={(e) => { buttonHandler(e) }} />
          <input type="button" className="button" id="enter-button" onClick={(e) => { buttonHandler(e) }} />
          <input type="button" className="button" id="cancel-button" onClick={(e) => { buttonHandler(e) }} />
        </div>

        <div className="bar" style={{ top: "64.9%" }}>
          <BiMessageAltDots className="icon" onClick = {() => {if (mode == "default") {onIconClick(4)}}}/> <TbMedicineSyrup className="icon" onClick = {() => {if (mode == "default") {onIconClick(5)}}}/> {true ? <FaRegLightbulb className="icon" onClick = {() => {if (mode == "default") {onIconClick(6)}}}/> : <FaLightbulb />} <TbUserExclamation id="attention" />
        </div>
      </div>
    </>
  );
}

export default App;
