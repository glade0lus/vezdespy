import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import GameCreate from './panels/GameCreate';
import Game from './panels/Game'
import GameMenu from './panels/GameMenu'
import GameOver from './panels/GameOver'
import Places from './panels/Places';

let gameData = {
	places: [
		{ "name": "Школа" },
		{ "name": "Свадьба" },
		{ "name": "Торговый центр" },
		{ "name": "Кладбище" },
		{ "name": "Парк" },
		{ "name": "Цирк" },
		{ "name": "Строительная площадка" },
		{ "name": "Пляж" },
		{ "name": "Театр" },
		{ "name": "Тюрьма" },
		{ "name": "Библиотека" },
		{ "name": "Рынок" },
		{ "name": "Космическая станция" },
		{ "name": "Ресторан" },
		{ "name": "Университет" },
	],
	place: 0,
	playerNames: Array(12).fill(""),
	playerCount: 3,
	playerSpy: [-1, -1],
	hasStarted: false,
}

let gameResult = {
	str: "",
}

let timer = {
	hasFlashlight: false,
	start: () => {
		timer.isRunning = true;
		timer.interval = setInterval(() => {
			if (timer.hasFlashlight && timer.seconds < 6 && timer.minutes === 0) {
				if (seconds % 2 == 0) {
					bridge.send("VKWebAppFlashSetLevel", { "level": 0 });
				} else {
					bridge.send("VKWebAppFlashSetLevel", { "level": 1 });
				}
			}
			if (timer.seconds > 0) {
				timer.seconds = timer.seconds - 1;
			}
			if (timer.seconds === 0) {
				if (timer.minutes === 0) {
					timer.end();
					clearInterval(timer.interval)
				} else {
					timer.minutes = timer.minutes - 1;
					timer.seconds = 59;
				}
			}
		}, 1000)
		return () => {
			if (timer.interval !== null) clearInterval(timer.interval);
		};
	},
	end: () => {
		timer.isRunning = false;
		timer._forceActivePanelState();
	},
	stop: () => {
		timer.isRunning = false;
		timer.minutes = 0;
		timer.seconds = 0;
		clearInterval(timer.interval)
		timer.interval = null;
	},
	_forceActivePanelState: () => {},
	minutes: 0,
	seconds: 0,
	isRunning: false,
	interval: null,
}

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		// Я макака у-а-а-а
		timer._forceActivePanelState = () => {
			setActivePanel('gameMenu');
		}
		bridge.send("VKWebAppFlashGetInfo");
		bridge.subscribe(({ detail: { type, data } }) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			} else if (type === 'VKWebAppFlashGetInfoResult') {
				if (data.is_available) {
					timer.hasFlashlight = true;
				}
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home id='home' go={go} gameData={gameData} timer={timer} />
					<GameCreate id='gameCreate' go={go} gameData={gameData} />
					<Game id='game' go={go} gameData={gameData} timer={timer} />
					<GameMenu id='gameMenu' go={go} gameData={gameData} timer={timer} gameResult={gameResult} />
					<GameOver id='gameOver' go={go} gameResult={gameResult} />
					<Places id='places' go={go} places={gameData.places} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
