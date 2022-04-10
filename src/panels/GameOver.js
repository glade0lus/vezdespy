import React, { useState, useEffect } from 'react';
import { Title, Panel, PanelHeader, PanelHeaderBack, Div } from '@vkontakte/vkui';

const Timer = ({ id, go, gameResult }) => {

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={go} data-to="home" />}
            >
                Игра окончена
            </PanelHeader>
            <Div>
                <Title level="1" style={{ textAlign: "center" }}>
                    {gameResult.str}
                </Title>
            </Div>
        </Panel>
    )
}

export default Timer;