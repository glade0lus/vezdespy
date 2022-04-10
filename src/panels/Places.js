import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, PanelHeaderBack, Group, List, Cell } from '@vkontakte/vkui';

const Places = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={props.go} data-to="home"/>}
		>
			Список локаций
		</PanelHeader>
        <Group>
            <List>
                {props.places.map((d, i) => <Cell expandable key={"cell" + String(i)}>{d.name}</Cell>)}
            </List>
        </Group>
	</Panel>
);

Places.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
    places: PropTypes.array.isRequired,
};

export default Places;
