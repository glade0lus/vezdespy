import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar } from '@vkontakte/vkui';

import Timer from './Timer';

const Home = ({ id, go, gameData, timer }) => {
	const [gameStarted, setGameStarted] = useState(false);
	useEffect(() => {
		setGameStarted(gameData.hasStarted);
	}, [gameData.hasStarted])

	return (
	<Panel id={id}>
		<PanelHeader>ВездеШпион</PanelHeader>
		<Group header={<Header mode="secondary">Главное меню</Header>}>
			<Div>
				{gameStarted ? <Timer timer={timer}/> : undefined}
				{gameStarted ? 
					<Button stretched size="l" mode="primary" onClick={go} data-to="gameMenu">
						Продолжить игру
					</Button>
				:
					<Button stretched size="l" mode="primary" onClick={go} data-to="gameCreate">
						Начать игру
					</Button>
				}
			</Div>
			<Div>
				<Button stretched size="l" mode="secondary" onClick={go} data-to="places">
					Список локаций
				</Button>
			</Div>
		</Group>
	</Panel>
)}

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
