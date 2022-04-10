import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, PanelHeaderBack, Group, FormItem, Slider, Select, Input, Div, Button, Spacing } from '@vkontakte/vkui';

const GameCreate = ({ id, go, gameData }) => {
    function useArrayRef() {
        const refs = []
        return [refs, el => el && refs.push(el)]
    }

    const [playerCount, setPlayerCount] = useState(3);
    const [playerNames, playerNamesRef] = useArrayRef();

    const options = () => {
        let options = [];
        for (let i = 3; i <= 12; i += 1) {
            options.push({ value: i, label: i });
        }
        return options;
    };

    function generateRandom(min = 0, max = 12) {
        let difference = max - min;
        let rand = Math.random();
        rand = Math.floor( rand * difference);
        rand = rand + min;
        return rand;
    }

    const startGame = () => {
        let playerNamesStr = [];
        for (let i = 0; i < playerCount; i++) {
            playerNamesStr.push(playerNames[i].value);
        }
        gameData.playerNames = playerNamesStr;
        gameData.playerCount = playerCount;
        gameData.place = Math.floor(Math.random() * gameData.places.length);
        gameData.playerSpy = [-1, -1];
        let firstSpy = generateRandom(0, playerCount);
        gameData.playerSpy[0] = firstSpy;
        if (playerCount > 5) {
            let secondSpy = firstSpy;
            while (secondSpy == firstSpy) {
                secondSpy = generateRandom(0, playerCount);
            }
            gameData.playerSpy[1] = secondSpy;
        }
        console.log(gameData);
    };

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={go} data-to="home" />}
            >
                Начать игру
            </PanelHeader>
            <Group>
                <FormItem top="Количество игроков">
                    <Slider
                        min={3}
                        max={12}
                        step={1}
                        value={Number(playerCount)}
                        onChange={(playerCount) => setPlayerCount(playerCount)}
                    />
                </FormItem>
                <FormItem>
                    <Select
                        value={String(playerCount)}
                        onChange={(e) => setPlayerCount(e.target.value)}
                        options={options()}
                    />
                </FormItem>
                <FormItem top="Имена игроков">
                    {Array.from({ length: playerCount }, (_, i) => i + 1).map((d) =>
                    <div key={"player" + String(d)}>
                        <Input type="text" defaultValue={"Игрок " + String(d)} getRef={playerNamesRef} />
                        <Spacing />
                    </div>
                    )}
                </FormItem>
                <Div>
                    <Button stretched size="l" mode="primary" onClick={e => {startGame(); go(e);}} data-to="game">
                        Начать игру
                    </Button>
                </Div>
            </Group>
        </Panel>
    )
}

GameCreate.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};

export default GameCreate;
