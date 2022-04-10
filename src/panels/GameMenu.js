import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, PanelHeaderBack, Title, FormItem, Slider, Select, Input, Div, Button, Spacing } from '@vkontakte/vkui';

import Timer from './Timer';

const GameMenu = ({ id, go, gameData, timer, gameResult }) => {

    const [isTimeOut, setIsTimeOut] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [isGuessing, setIsGuessing] = useState(false);
    const [voteResult, setVoteResult] = useState("");
    let foundSpyFirst = -1;
    let foundSpySecond = -1;

    const [voteSelection, setVoteSelection] = useState(null);

    useEffect(() => {
        if (!timer.isRunning) timeOut();
    })

    const timeOut = () => {
        setIsTimeOut(true);
    }

    const playerVote = (e) => {
        // Я сдаюсь, остался всего один час до конца, а переменные каким-то образом сбрасываются обратно в -1
        if (Number(voteSelection) == gameData.playerSpy[0]) foundSpyFirst = Number(voteSelection);
        if (Number(voteSelection) == gameData.playerSpy[1]) foundSpySecond = Number(voteSelection);
        console.log(foundSpyFirst);
        console.log(foundSpySecond);
        
        console.log(gameData.playerSpy);
        if (foundSpyFirst == gameData.playerSpy[0] && foundSpySecond == gameData.playerSpy[1]) {
            if (gameData.playerSpy[1] == -1) {
                gameResult.str = `Игроки победили, ${gameData.playerNames[gameData.playerSpy[0]]} оказался шпионом. Игроки были на локации ${gameData.places[gameData.place].name}.`;
            } else {
                gameResult.str = `Игроки победили, ${gameData.playerNames[gameData.playerSpy[0]]} и ${gameData.playerNames[gameData.playerSpy[1]]} оказались шпионами. Игроки были на локации ${gameData.places[gameData.place].name}.`;
            }
        }
        if (voteSelection != gameData.playerSpy[0] && voteSelection != gameData.playerSpy[1]) {
            if (gameData.playerSpy[1] == -1) {
                gameResult.str = `Шпион победил, им был ${gameData.playerNames[gameData.playerSpy[0]]}. Игроки были на локации ${gameData.places[gameData.place].name}.`;
            } else {
                gameResult.str = `Шпионы победили, ими были ${gameData.playerNames[gameData.playerSpy[0]]} и ${gameData.playerNames[gameData.playerSpy[1]]}. Игроки были на локации ${gameData.places[gameData.place].name}.`;
            }
        }
        if (voteSelection == gameData.playerSpy[0] || voteSelection == gameData.playerSpy[1]) {
            setVoteResult(`${gameData.playerNames[voteSelection]} оказался шпионом. Остался ещё один.`)
        }
        if (gameResult.str) {
            gameData.hasStarted = false;
            timer.stop();
            go(e);
        }
        setIsGuessing(false);
    }

    const spyGuess = (e) => {
        timer.stop();
        setIsGuessing(true);
    }

    const spyGameOver = (e) => {
        gameResult.str = `Игроки были на локации ${gameData.places[gameData.place].name}.`;
        gameData.hasStarted = false;
        go(e);
    }

    const getPlayersList = () => {
        let options = []
        for (let i = 0; i < gameData.playerCount; i++) {
            if (i === foundSpyFirst || i === foundSpySecond) continue;
            options.push({
                value: i,
                label: gameData.playerNames[i],
            })
        }
        return options;
    }

    return (
        <Panel id={id}>
            <PanelHeader
                left={!isTimeOut && <PanelHeaderBack onClick={go} data-to="home" />}
            >
                {!isTimeOut ? "Игра" : "Время вышло"}
            </PanelHeader>
            <Div>
                <Timer timer={timer} onEnd={timeOut} />
                <Spacing />
                <Div>
                    {voteResult}
                </Div>
                {(!isVoting && !isGuessing) && <Button stretched size="l" mode="primary" onClick={e => { setIsVoting(true); }} >
                    [Любой игрок] Проголосовать против шпиона
                </Button>}
                {isVoting && <>
                    <Title level="3" style={{ marginBottom: 16, textAlign: "center" }}>
                        {!isTimeOut ? "Выберите игрока, если все проголосовали за него единогласно, иначе воздержитесь от голосования" :
                                      "Время вышло, проголосуйте за наиболее подозрительного игрока"}
                    </Title>
                    <FormItem top="Имя игрока">
                        <Select
                            placeholder="Выберите имя"
                            options={getPlayersList()}
                            onChange={(e) => setVoteSelection(e.target.value)}
                        />
                    </FormItem>
                    <Button stretched size="l" mode="primary" onClick={e => { playerVote(e); }} data-to="gameOver" key={"voteButton"}>
                        Проголосовать
                    </Button>
                    <Spacing />
                    {!isTimeOut && <Button stretched size="l" mode="primary" onClick={e => { setIsVoting(false); }} key={"skipVoteButton"}>
                        Воздержаться
                    </Button>}
                </>}
                <Spacing />
                {(!isVoting && !isGuessing && !isTimeOut) && <Button stretched size="l" mode="primary" onClick={e => { spyGuess(e); }} data-to="gameOver" key={"guessButton"}>
                    [Только шпион] Открыть карту шпиона и назвать локацию
                </Button>}
                {isGuessing && <Button stretched size="l" mode="primary" onClick={e => { spyGameOver(e); }} data-to="gameOver" key={"guessOverButton"}>
                    Показать локацию
                </Button>}
            </Div>
        </Panel>
    );
}

export default GameMenu;
