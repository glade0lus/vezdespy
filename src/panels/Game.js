import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, PanelHeaderBack, Group, FormItem, Slider, Select, Input, Div, Button, Spacing } from '@vkontakte/vkui';

const Game = ({ id, go, gameData, timer }) => {
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [cardOpened, setCardOpened] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        setGameStarted(gameData.hasStarted)
    }, [gameData.hasStarted])

    const flipCard = () => {
        setCardOpened(true);
    }

    const hideCard = () => {
        setCardOpened(false);
        if (currentPlayer < gameData.playerCount - 1) {
            setCurrentPlayer(currentPlayer + 1);
        } else {
            gameData.hasStarted = true;
            timer.minutes = gameData.playerCount;
            timer.seconds = 0;
            timer.start();
            return true;
        }
        return false;
    }

    const GetPlace = () => {
        if (currentPlayer == gameData.playerSpy[0] || currentPlayer == gameData.playerSpy[1]) {
            return (
                <h2 align="center">Шпион</h2>
            )
        } else {
            return (
                <h2 align="center">{gameData.places[gameData.place].name}</h2>
            )
        }
    }

    const HideButton = () => {
        return (
            <Button stretched size="l" mode="primary" onClick={e => {if (hideCard()) go(e);}} data-to="gameMenu">
                Скрыть карточку
            </Button>
        )
    }

    const FlipButton = () => {
        if (cardOpened) {
            return (
                <Div>
                    {GetPlace()}
                    <Spacing size={20}/>
                    {HideButton()}
                </Div>
            )
        } else {
            return (
                <Button stretched size="l" mode="primary" onClick={flipCard}>
                    Перевернуть карточку
                </Button>
            )
        }
    }

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={go} data-to="home" />}
            >
                Раздача карточек
            </PanelHeader>
            <Div>
                <h2 align="center">
                    {gameData.playerNames[currentPlayer]}, твоя очередь.
                </h2>
            </Div>
            <Div>
                {FlipButton()}
            </Div>
        </Panel>
    );
}

Game.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    gameData: PropTypes.shape({
        places: PropTypes.array.isRequired,
        playerNames: PropTypes.array.isRequired,
        playerCount: PropTypes.number.isRequired,
        playerSpy: PropTypes.array.isRequired,
    })
};

export default Game;
